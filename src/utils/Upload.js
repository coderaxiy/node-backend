const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const mongoose = require('mongoose');

const uploadImage = (storePath, schema) => {
    const storage = multer.diskStorage({
        destination: async function (req, file, cb) {
            try {
                if (
                    !mongoose.Types.ObjectId.isValid(req.params.id)
                    || !(await schema.findOne({ _id: req.params.id }))
                ) {
                    cb(new Error('Invalid user ID'));
                }

                const destination = path.join(__dirname, storePath);
                const files = await fs.readdir(destination);

                for (const file of files) {
                    if (file.split('.')[0] === req.params.id) {
                        await fs.unlink(path.join(destination, file));
                        break;
                    }
                }

                cb(null, destination);
            } catch (err) {
                cb(err);
            }
        },
        filename: function (req, file, cb) {
            const fileName = req.params.id + path.extname(file.originalname);
            cb(null, fileName);
        },
    });

    const allowedExtensions = ['jpg', 'png', 'jpeg'];

    const fileFilter = (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().substring(1);
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file extension. Only JPG, PNG, and JPEG are allowed.'));
        }
    };

    const limits = {
        fileSize: 3 * 1024 * 1024, // 3 MB limit
    };

    const upload = multer({ storage, fileFilter, limits });

    return (req, res, next) => {
        return new Promise((resolve, reject) => {
            upload.single('file')(req, res, (err) => {
                if (err) {
                    res.status(422).send({ success: false, message: err.message });
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
            .then(() => next())
            .catch((err) => next(err));
    };
};

module.exports = uploadImage;
