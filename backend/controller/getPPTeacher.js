const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { User, Kursus, Transaction } = require("../models/data");
const jwt = require("jsonwebtoken");
const secret = "rahasia";
let id = 1;
const { ObjectId } = require("mongodb");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folderName = `profiles/`;

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }

    callback(null, folderName);
  },
  filename: (req, file, callback) => {
    console.log(file);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (file.fieldname == "profile_image") {
      callback(null, `${req.body.email}${fileExtension}`);
    } else if (file.fieldname == "pengguna_file[]") {
      callback(null, `${req.body.email}${fileExtension}`);
      id++;
    } else {
      callback(null, false);
    }
  },
});

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

const getPPTeacher = async (req, res) => {
  let { id_user } = req.query;
  const user = await User.findOne({ _id: new ObjectId(id_user) });

  if (user.profile_path == null) {
    fs.readFile("profiles/dummy.jpeg", (err, data) => {
      if (err) {
        return res.status(500).json({ error: "File not found or could not be read." });
      }
      const base64Image = data.toString("base64");
      console.log(base64Image)
      return res.status(200).send("data:image/jpeg;base64,"+base64Image);
    });
  }else{
    return res.status(200).send(user.profile_path);
  }
};

module.exports = {
  getPPTeacher,
};
