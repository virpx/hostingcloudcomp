const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User, Kursus, Transaction, Tugas } = require("../models/data");
const jwt = require("jsonwebtoken");
const { Storage } = require('@google-cloud/storage');
const secret = "rahasia";
let id = 1;
const storagecloud = new Storage({
  keyFilename: path.join(__dirname, 'elearning-447808-a6e174381b57.json'), // Replace with your key file path
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
    const rules = /pdf/;

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileMimeType = file.mimetype;

    const cekExt = rules.test(fileExtension);
    const cekMime = rules.test(fileMimeType);

    if (cekExt && cekMime) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(
        new multer.MulterError("Tipe file harus .pdf", file.fieldname)
      );
    }
  },
});

const singleFile = (req, res) => {
  const uploadingFile = upload.single("assignment_pdf");
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
    var sekarang = String(Date.now());
    const fileName = sekarang+".pdf";
    const tugasId = req.body.tugas_id;
    const email = req.body.email;
    const blob = bucket.file(fileName);
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
        const existingTugas = await Tugas.findOne({
          tugas_id: tugasId,
          user_id: id_user,
        });
    
        if (existingTugas) {
          const result = await Tugas.updateOne(
            {
              tugas_id: tugasId,
              user_id: id_user,
            },
            {
              $set: {
                path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
              },
            }
          );
    
          const body = req.body;
          return res.status(200).json(body);
        }
    
        const result = await Tugas.create({
          tugas_id: tugasId,
          user_id: id_user,
          path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
          score: -1,
        });
    
        const body = req.body;
        return res.status(200).json(body);
      } catch (err) {
        console.error('Error making file public:', err);
        res.status(500).send('File uploaded but failed to make it public.');
      }
    });
    blobStream.end(req.file.buffer);
  });
};

const getPdf = (req, res) => {
  let { filename } = req.params;
  return res.status(200).send(`https://storage.googleapis.com/${bucketName}/${filename}`);
};

module.exports = {
  singleFile,
  getPdf,
};
