const ApiError = require("../errors/ApiError");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("../services/JwtService");
const config = require("config");
const path = require("path");
const {writeLogs} = require("../utils/writeLogs");

const registration = async (req, res) => {
  try {
    const {
      image,
      first_name,
      last_name,
      email,
      password,
      username,
      phone_number,
      // is_active,
      // is_ban,
    } = req.body;

    const checkUnique = await User.findOne({ username });

    if (checkUnique) {
      return res
        .status(403)
        .send({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 7);

    const newUser = await User({
      image,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      username,
      phone_number,
      is_active: true,
      is_ban: false,
    });

    await newUser.save();

    const payload = {
      id: newUser._id,
      email,
      password,
      is_active: newUser.is_active,
    };

    const tokens = jwt.generateTokens(payload);

    const hashedToken = bcrypt.hashSync(tokens.token, 7);

    newUser.refresh_token = hashedToken;
    await newUser.save();

    res
      .cookie("token", tokens.token, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
      })
      .status(200)
      .send(tokens);
  } catch (error) {
    writeLogs('registration', error)

    ApiError.internal(res, { success: false, message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email) return res.status(422).send({ success: false, message: 'Email is required!' })
    if(!password) return res.status(422).send({ success: false, message: 'Password is required!' })

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: `User with email: ${email} not found` });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Wrong password!" });
    }

    const payload = {
      id: user.id,
      is_active: user.is_active,
    };

    const tokens = jwt.generateTokens(payload);

    const hashedToken = bcrypt.hashSync(tokens.token, 7);

    newUser.refresh_token = hashedToken;

    await user.save();

    res
      .cookie("token", tokens.token, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
      })
      .status(200)
      .send(tokens);
  } catch (error) {
    writeLogs('login', error)

    ApiError.internal(res, { success: false, message: 'Internal Server Error' });
  }
};

const createUserImage = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: 'Invalid user ID' });
  }

  if(req.file) {
    const filename = path.join(
        config.get('baseUrl'),
        'user/image/',
        req.params.id) + path.extname(req.file.originalname
    )

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        image: filename
      }, { new: true })

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      await user.save();

      res.status(200).send({ success: true });
    } catch (error) {
      writeLogs('createUserImage', error)

      ApiError.internal(res, { success: false, message: 'Internal Server Error' });
    }

  } else {
    ApiError.badRequest(res, { success: false, message: 'File must not be blank' });
  }
}

const getUserImage = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiError.badRequest(res, {
        success: false,
        message: 'Bad Request'
      })
    }

    const id = req.params.id.split('.')[0]

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid plant ID' });
    }

    const filePath = path.join(__dirname, '../store/user', req.params.id)
    res.sendFile(filePath, (err) => {
      if (err) return  ApiError.notFound(res, ({ success: false, message: 'Not Found' }));
    });
  } catch (error) {
    writeLogs('getUserImage', error)

    if (error.code === 'ENOENT') {
      ApiError.notFound(res, ({ success: false, message: 'Not Found' }));
    } else {
      ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
    }
  }
}

const getListUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});

    res
      .status(200)
      .send({ message: "Completed successfully.", data: allUsers });
  } catch (error) {
    writeLogs('getListUsers', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res.status(200).send({ message: "Completed successfully.", data: user });
  } catch (error) {
    writeLogs('getUserById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id." });
    }

    const {
      image,
      first_name,
      last_name,
      email,
      password,
      username,
      phone_number,
      is_active,
      is_ban,
    } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 7);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        image,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username,
        phone_number,
        is_active: true,
        is_ban: false,
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).send({ message: "Canceled, could not be found." });
    }

    await updatedUser.save();

    const payload = {
      id: updatedUser._id,
      email,
      password,
      is_active: updatedUser.is_active,
    };

    const tokens = jwt.generateTokens(payload);

    const hashedToken = bcrypt.hashSync(tokens.token, 7);

    updatedUser.refresh_token = hashedToken;
    await updatedUser.save();

    res
      .cookie("token", tokens.token, {
        maxAge: config.get("refresh_ms"),
        httpOnly: true,
      })
      .status(200)
      .send(tokens);
  } catch (error) {
    writeLogs('updateUserById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id." });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully", data: deletedUser });
  } catch (error) {
    writeLogs('deleteUserById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

module.exports = {
  registration,
  login,
  getListUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUserImage,
  getUserImage
};
