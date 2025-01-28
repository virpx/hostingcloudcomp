const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User, Kursus, Transaction } = require("../models/data");
const jwt = require("jsonwebtoken");
const { Storage } = require('@google-cloud/storage');
const secret = "rahasia";
let id = 1;
const storagecloud = new Storage({
  keyFilename: path.join(__dirname, 'elearning-447808-3f750f5f211a.json'), // Replace with your key file path
  projectId: 'elearning-447808', // Replace with your project ID
});
const bucketName = 'elearning-bucket-2025'; // Replace with your bucket name
const bucket = storagecloud.bucket(bucketName);
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000000,
  },
  fileFilter: (req, file, callback) => {
    const rules = /jpeg|jpg|png/;

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileMimeType = file.mimetype;

    const cekExt = rules.test(fileExtension);
    const cekMime = rules.test(fileMimeType);

    if (cekExt && cekMime) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(
        new multer.MulterError(
          "Tipe file harus .png, .jpg atau .jpeg",
          file.fieldname
        )
      );
    }
  },
});

const singleFile = (req, res) => {
  const uploadingFile = upload.single("profile_image");
  uploadingFile(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .send((err.message || err.code) + " pada field " + err.field);
    }

    let user, id_user;
    const token = req.headers["x-auth-token"] || "";

    if (token) {
      try {
        const data = jwt.verify(token, secret);
        user = await User.findOne({ _id: data._id });

        if (user) {
          flag = true;
          id_user = data._id;
        }
      } catch (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
    }
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const blob = bucket.file(req.body.email+fileExtension);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file.');
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const fileName = req.file.filename;
        const result = await User.updateOne(
          { _id: id_user },
          {
            $set: {
              profile_path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
              updatedAt: new Date(),
            },
          }
        );
        return res.status(200).json({ fileName });
      } catch (err) {
        console.error('Error making file public:', err);
        res.status(500).send('File uploaded but failed to make it public.');
      }
    });

    blobStream.end(req.file.buffer);
  });
};

const getImage = async (req, res) => {
  let user, id_user;
  const token = req.headers["x-auth-token"] || "";

  if (token) {
    try {
      const data = jwt.verify(token, secret);
      user = await User.findOne({ _id: data._id });

      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }

  if (user.profile_path == null) {
    fs.readFile("profiles/dummy.jpeg", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "File not found or could not be read." });
      }
      const base64Image = data.toString("base64");
      return res.status(200).send("data:image/jpeg;base64,"+base64Image);
    });
  }else{
    return res.status(200).send(user.profile_path);
  }
};

module.exports = {
  singleFile,
  getImage,
};
