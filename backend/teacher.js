const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Kursus, Tugas, Forum, Transaction } = require("./models/data");
const multer = require("multer");
const secret = "rahasia";
const uploadAssignment = require("./controller/uploadAssignment");
const fs = require("fs");
const { log } = require("util");
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const gstorage = new Storage({
  keyFilename: path.join(__dirname, 'elearning-447808-a6e174381b57.json'), // Replace with your key file path
  projectId: 'elearning-447808', // Replace with your project ID
});
const bucketName = 'elearning-bucket-2025'; // Replace with your bucket name
const bucket = gstorage.bucket(bucketName);
router.get("/ceklogin", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      data = jwt.verify(token, secret);
      if (data.role == 1) {
        return res.status(200).send("valid");
      } else {
        return res.status(200).send("invalid");
      }
    } catch (err) {
      return res.status(200).send("invalid");
    }
  }
});
router.get("/teacherdata", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      const datauser = await User.findOne({ _id: tokendata._id });
      const datakursus = await Kursus.find({
        owner: datauser._id,
      });
      const datamurid = await User.find();
      const datamuridenroll = [];
      for (const iterator of datakursus) {
        for (const iterator2 of datamurid) {
          for (const iterator3 of iterator2.listkursus) {
            if (iterator3.kursus.toString() == iterator._id.toString()) {
              datamuridenroll.push(iterator2);
              break;
            }
          }
        }
      }
      const date = new Date(datauser.createdAt);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const tanggaljoin = new Intl.DateTimeFormat("id-ID", options).format(
        date
      );
      var kategorikursus = ["All"];
      for (const iterator of datakursus) {
        if (kategorikursus.indexOf(iterator.kategori) == -1) {
          kategorikursus.push(iterator.kategori);
        }
      }
      var penjualantahunini = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const user = await User.find();

      const promises = datakursus.map(async (k) => {
        const currentYear = new Date().getFullYear();
        const getTrans = await Transaction.find({ kursus: k._id });

        getTrans.forEach((transaction) => {
          const transactionYear = new Date(transaction.createdAt).getFullYear();
          const transactionMonth = new Date(transaction.createdAt).getMonth();

          if (transactionYear === currentYear) {
            const monthIndex = transactionMonth;

            penjualantahunini[monthIndex] += 1;
          }
        });
      });

      await Promise.all(promises);
      var dataout = {};
      dataout.userdata = {
        nama: datauser.name,
        join: tanggaljoin,
      };
      dataout.kursus = {
        jumlah: datakursus.length,
        kategori: kategorikursus,
        lkursus: datakursus,
      };
      dataout.student = {
        jumlah: datamuridenroll.length,
      };
      dataout.chart = penjualantahunini;
      return res.status(200).json(dataout);
    } catch (err) {
      return res.status(200).send("invalid");
    }
  }
});
router.get("/courselist", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    var dataout = [];
    const datakursus = await Kursus.find({
      owner: tokendata._id,
    });
    const murid = await User.find();
    for (const iterator of datakursus) {
      var bisadelete = 1;
      for (const iterator2 of murid) {
        for (const iterator3 of iterator2.listkursus) {
          if (iterator3.kursus.toString() == iterator._id.toString()) {
            bisadelete = 0;
            break;
          }
        }
        if (bisadelete == 0) {
          // supaya murid lain tidak perlu di cek
          break;
        }
      }
      var databaru = [];
      databaru.push(bisadelete);
      databaru.push(iterator);
      dataout.push(databaru);
    }
    return res.status(200).json(dataout);
  }
});
var filenameupload = "";
const materibarustorage = multer.memoryStorage();
const upload = multer({ storage: materibarustorage });
router.post("/addkursus", upload.single("thumbimg"), async (req, res) => {
  const token = req.headers["x-auth-token"];
  var owner = "";
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      owner = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { nama_kursus, kategori, harga, deskripsi } = req.body;
    var sekarang = String(Date.now());
    const blob = bucket.file(sekarang+".pdf");
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
        await Kursus.insertMany({
          nama_kursus: nama_kursus,
          kategori: kategori,
          harga: parseInt(harga),
          deskripsi: deskripsi,
          owner: owner,
          thumb_path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
          active: 1,
          materi: [],
          assignment: [],
          quiz: [],
        });
        return res.status(200).send("success");
      } catch (err) {
        console.error('Error making file public:', err);
        res.status(500).send('File uploaded but failed to make it public.');
      }
    });
    blobStream.end(req.file.buffer);
  }
});
router.get("/getimage", (req, res) => {
  var pathe = atob(req.query.pathe).toString().split("/");
  return res.sendFile(pathe[1], { root: pathe[0] });
});
router.get("/getcoursedetail/:id", async (req, res) => {
  const token = req.headers["x-auth-token"];
  var owner = "";
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      owner = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    var hasil = await Kursus.findOne({
      _id: req.params.id,
    });
    return res.status(200).json(hasil);
  }
});
router.post("/updatekursusnoimage", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      owner = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { nama_kursus, kategori, harga, deskripsi, id } = req.body;
    await Kursus.updateOne(
      {
        _id: id,
      },
      {
        nama_kursus: nama_kursus,
        kategori: kategori,
        harga: harga,
        deskripsi: deskripsi,
      }
    );
    return res.status(200).send("success");
  }
});
router.post(
  "/updatekursuswithimage",
  upload.single("thumbimg"),
  async (req, res) => {
    const token = req.headers["x-auth-token"];
    if (token == null || token == "") {
      return res.status(200).send("invalid");
    } else {
      try {
        tokendata = jwt.verify(token, secret);
        owner = tokendata._id.toString();
      } catch (err) {
        return res.status(200).send("invalid");
      }
      const { nama_kursus, kategori, harga, deskripsi, id } = req.body;
      const ambilkursus = await Kursus.findOne({
        _id: id,
      });
      try{
        await bucket.file(ambilkursus.thumb_path.split("/")[ambilkursus.thumb_path.split("/").length-1]).delete();
      }catch{

      }
      var sekarang = String(Date.now());
      const blob = bucket.file(sekarang+".jpg");
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
          await Kursus.updateOne(
            {
              _id: id,
            },
            {
              nama_kursus: nama_kursus,
              kategori: kategori,
              harga: harga,
              deskripsi: deskripsi,
              thumb_path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
            }
          );
          return res.status(200).send("success");
        } catch (err) {
          console.error('Error making file public:', err);
          res.status(500).send('File uploaded but failed to make it public.');
        }
      });
      blobStream.end(req.file.buffer);
    }
  }
);
router.get("/deletekursus/:id", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { id } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: id,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      fs.unlink("./" + ambilkursus.thumb_path, (err) => {
        if (err) {
          throw err;
        }
      });
      await Kursus.deleteOne({
        _id: id,
      });
      return res.status(200).send("success");
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.get("/aktifmatikankursus/:id", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { id } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: id,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      await Kursus.updateOne(
        {
          _id: id,
        },
        {
          active: ambilkursus.active * -1,
        }
      );
      return res.status(200).send("success");
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.get("/getcenter/:id", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { id } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: id,
    });
    const murid = await User.find();
    var bisadelete = 1;
    for (const iterator2 of murid) {
      for (const iterator3 of iterator2.listkursus) {
        if (iterator3.kursus.toString() == id) {
          bisadelete = 0;
          break;
        }
      }
      if (bisadelete == 0) {
        // supaya murid lain tidak perlu di cek
        break;
      }
    }
    if (ambilkursus.owner == tokendata._id.toString()) {
      return res.status(200).json([bisadelete, ambilkursus]);
    } else {
      return res.status(403).send("gagal");
    }
  }
});
const materistorage = multer.memoryStorage();
const uploadmateri = multer({ storage: materistorage });
router.post("/addmateri", uploadmateri.single("filepdf"), async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { nama, idkursus } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      var sekarang = String(Date.now());
      const blob = bucket.file(sekarang+".pdf");
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
          const databaru = {
            path: `https://storage.googleapis.com/${bucketName}/${blob.name}`,
            name: nama,
          };
          await Kursus.updateOne(
            {
              _id: idkursus,
            },
            { $push: { materi: databaru } }
          );
          console.log(databaru)
          return res.status(200).send("success");
        } catch (err) {
          console.error('Error making file public:', err);
          res.status(500).send('File uploaded but failed to make it public.');
        }
      });
      blobStream.end(req.file.buffer);
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.get("/gettopicdetail/:idkursus/:idmateri", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idmateri, idkursus } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilmateri = ambilkursus.materi.find((materi) =>
        materi._id.equals(idmateri)
      );
      return res.status(200).json(ambilmateri);
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.post("/editmateri", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idmateri, idkursus, nama } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilmateriIndex = ambilkursus.materi.findIndex((materi) =>
        materi._id.equals(idmateri)
      );
      ambilkursus.materi[ambilmateriIndex].name = nama;
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.post(
  "/editmateripdf",
  uploadmateri.single("filepdf"),
  async (req, res) => {
    const token = req.headers["x-auth-token"];
    if (token == null || token == "") {
      return res.status(200).send("invalid");
    } else {
      try {
        tokendata = jwt.verify(token, secret);
      } catch (err) {
        return res.status(200).send("invalid");
      }
      const { idmateri, idkursus, nama } = req.body;
      const ambilkursus = await Kursus.findOne({
        _id: idkursus,
      });
      if (ambilkursus.owner == tokendata._id.toString()) {
        const ambilmateriIndex = ambilkursus.materi.findIndex((materi) =>
          materi._id.equals(idmateri)
        );
        // fs.unlink(
        //   "../frontend/public/" + ambilkursus.materi[ambilmateriIndex].path,
        //   (err) => {
        //     if (err) {
        //       throw err;
        //     }
        //   }
        // );
        try{
          await bucket.file(ambilkursus.materi[ambilmateriIndex].path.split("/")[ambilkursus.materi[ambilmateriIndex].path.split("/").length-1]).delete();
        }catch{

        }
        var sekarang = String(Date.now());
        const blob = bucket.file(sekarang+".pdf");
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
            ambilkursus.materi[ambilmateriIndex].path =`https://storage.googleapis.com/${bucketName}/${blob.name}`;
            ambilkursus.materi[ambilmateriIndex].name = nama;
            ambilkursus.save();
            return res.status(200).send("sukses");
          } catch (err) {
            console.error('Error making file public:', err);
            res.status(500).send('File uploaded but failed to make it public.');
          }
        });
        blobStream.end(req.file.buffer);
      } else {
        print("beda");
        return res.status(403).send("gagal");
      }
    }
  }
);
router.get("/removemateri/:idkursus/:idmateri", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idmateri, idkursus, nama } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilmateriIndex = ambilkursus.materi.findIndex((materi) =>
        materi._id.equals(idmateri)
      );
      ambilkursus.materi.splice(ambilmateriIndex, 1);
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});

router.post("/addtask", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idkursus, nama, deskripsi } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const databaru = {
        name: nama,
        desc: deskripsi,
      };
      await Kursus.updateOne(
        {
          _id: idkursus,
        },
        { $push: { assignment: databaru } }
      );
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.get("/gettaskdetail/:idkursus/:idtask", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idtask, idkursus } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambiltask = ambilkursus.assignment.find((assignment) =>
        assignment._id.equals(idtask)
      );
      return res.status(200).json(ambiltask);
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.post("/edittask", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idtask, idkursus, nama, deskripsi } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambiltaskindex = ambilkursus.assignment.findIndex((assignment) =>
        assignment._id.equals(idtask)
      );
      ambilkursus.assignment[ambiltaskindex].name = nama;
      ambilkursus.assignment[ambiltaskindex].desc = deskripsi;
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});
router.get("/removetask/:idkursus/:idtask", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idkursus, idtask } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambiltaskindex = ambilkursus.assignment.findIndex((assignment) =>
        assignment._id.equals(idtask)
      );
      ambilkursus.assignment.splice(ambiltaskindex, 1);
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});

router.get("/taskkumpul/:idtask", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idtask } = req.params;
    console.log(idtask);
    const usertugas = await Tugas.find({
      tugas_id: idtask,
    });
    var out = [];
    for (const iterator of usertugas) {
      console.log(iterator);
      const usere = await User.findOne({
        _id: iterator.user_id,
      });
      var datapush = {
        path: iterator.path,
        namauser: usere.name,
        nilai: iterator.score,
        id: iterator._id.toString(),
      };
      out.push(datapush);
    }
    console.log(out);
    return res.status(200).json(out);
  }
});
router.post("/simpannilai", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idsubmit, nilai } = req.body;
    console.log(req.body);
    await Tugas.updateMany(
      {
        _id: idsubmit,
      },
      {
        score: nilai,
      }
    );
    return res.status(200).send("sukses");
  }
});
router.get("/reportdata", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      var idguru = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const kursusguru = await Kursus.find({
      owner: idguru,
    });
    var jumlahearning = 0;
    var jumlahstudent = 0;
    var penjualantahunini = [
      {
        jumlah: 0,
        month: "Jan",
      },
      {
        jumlah: 0,
        month: "Feb",
      },
      {
        jumlah: 0,
        month: "Mar",
      },
      {
        jumlah: 0,
        month: "Apr",
      },
      {
        jumlah: 0,
        month: "May",
      },
      {
        jumlah: 0,
        month: "June",
      },
      {
        jumlah: 0,
        month: "July",
      },
      {
        jumlah: 0,
        month: "Aug",
      },
      {
        jumlah: 0,
        month: "Sept",
      },
      {
        jumlah: 0,
        month: "Oct",
      },
      {
        jumlah: 0,
        month: "Nov",
      },
      {
        jumlah: 0,
        month: "Dec",
      },
    ];
    var pendapatantahunini = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const user = await User.find();
    for (const iterator of kursusguru) {
      var tmpjumlahstudent = 0;
      for (const iterator2 of user) {
        const indexuser = iterator2.listkursus.findIndex((listkursus) =>
          listkursus.kursus.equals(iterator._id.toString())
        );
        if (indexuser != -1) {
          var bulanpenjualan = new Date(
            iterator2.listkursus[indexuser].createdAt
          );
          tmpjumlahstudent++;
        }
      }
      jumlahstudent += tmpjumlahstudent;
    }

    const promises = kursusguru.map(async (k) => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().toLocaleString("en-US", {
        month: "short",
      });
      const getTrans = await Transaction.find({ kursus: k._id });

      getTrans.forEach((transaction) => {
        const transactionYear = new Date(transaction.createdAt).getFullYear();
        const transactionMonth = new Date(transaction.createdAt).toLocaleString(
          "en-US",
          { month: "short" }
        );

        if (transactionYear === currentYear) {
          const monthIndex = penjualantahunini.findIndex(
            (item) => item.month === transactionMonth
          );
          if (monthIndex !== -1) {
            penjualantahunini[monthIndex].jumlah += 1;
            pendapatantahunini[monthIndex] += transaction.paid_amount;
            if (currentMonth == transactionMonth) {
              jumlahearning += transaction.paid_amount;
            }
          }
        }
      });
    });
    await Promise.all(promises);

    const listTransaksi = [];
    const TransDesc = await Transaction.find().sort({ _id: -1 });

    const promises2 = TransDesc.map(async (transaction) => {
      try {
        var coursePromise = Kursus.findOne({ _id: transaction.kursus });
        var studentPromise = User.findOne({ _id: transaction.user });

        var [course, student] = await Promise.all([
          coursePromise,
          studentPromise,
        ]);

        const dateObject = new Date(transaction.createdAt);

        const formattedDate = dateObject.toISOString().split("T")[0];

        if (course && student) {
          let newList = {
            student_name: student.name,
            course_name: course.nama_kursus,
            date: formattedDate,
            paid_amount: transaction.paid_amount,
            payment_status: transaction.status,
          };
          listTransaksi.push(newList);
        } else {
          console.log("Course or student not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

    await Promise.all(promises2);

    var dataout = {
      jumlahkursus: kursusguru.length,
      jumlahearning: jumlahearning,
      jumlahstudent: jumlahstudent,
      penjualantahunini: penjualantahunini,
      pendapatantahunini: pendapatantahunini,
      listTransaksi: listTransaksi,
    };
    return res.status(200).json(dataout);
  }
});
router.get("/getchannel", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      var idguru = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const lkursus = await Kursus.find({
      owner: idguru,
    });
    var dataforum = [];
    for (const iterator of lkursus) {
      const forume = await Forum.find({
        kursus_id: iterator._id,
      });
      for (const iterator2 of forume) {
        var answere = null;
        for (const iterator3 of iterator2.lanswer) {
          if (iterator3.ishighlight) {
            answere = iterator3.answer;
            break;
          }
        }
        dataforum.push([iterator.nama_kursus, iterator2, answere]);
      }
    }
    return res.status(200).json(dataforum);
  }
});
router.post("/addanswer", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
      var idguru = tokendata._id.toString();
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idforum, jawaban } = req.body;
    var forumload = await Forum.findOne({
      _id: idforum,
    });
    for (var i = 0; i < forumload.lanswer.length; i++) {
      forumload.lanswer[i].ishighlight = false;
    }
    forumload.save();
    var databaru = {
      iduser: idguru,
      answer: jawaban,
      ishighlight: true,
    };
    await Forum.updateOne(
      {
        _id: idforum,
      },
      { $push: { lanswer: databaru } }
    );
    return res.status(200).send("sukses");
  }
});
router.get("/getforumdetail/:idforum", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idforum } = req.params;
    const forumout = await Forum.findOne({
      _id: idforum,
    });
    return res.status(200).json(forumout);
  }
});
router.get("/getnamauser/:iduser", async (req, res) => {
  const { iduser } = req.params;
  const user = await User.findOne({
    _id: iduser.toString(),
  });
  return res.status(200).send(user.name);
});
router.get("/highlight/:idanswer/:idforum", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idforum, idanswer, jawaban } = req.params;
    var forumload = await Forum.findOne({
      _id: idforum,
    });
    for (var i = 0; i < forumload.lanswer.length; i++) {
      forumload.lanswer[i].ishighlight = false;
    }
    for (var i = 0; i < forumload.lanswer.length; i++) {
      if (forumload.lanswer[i]._id.toString() == idanswer) {
        forumload.lanswer[i].ishighlight = true;
        break;
      }
    }
    forumload.save();
    return res.status(200).send("sukses");
  }
});

//remove quiz
router.get("/removequiz/:idkursus/:idquiz", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idkursus, idquiz } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilquizindex = ambilkursus.quiz.findIndex((quiz) =>
        quiz._id.equals(idquiz)
      );
      ambilkursus.quiz.splice(ambilquizindex, 1);
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});

//addquiz
router.post("/addquiz", async (req, res) => {
  let tokendata;
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idkursus, name, questions } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const databaru = {
        name: name,
        questions: questions,
      };
      await Kursus.updateOne(
        {
          _id: idkursus,
        },
        { $push: { quiz: databaru } }
      );
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});

//getquiz
router.get("/getquizdetail/:idkursus/:idquiz", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idquiz, idkursus } = req.params;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilquiz = ambilkursus.quiz.find((quiz) =>
        quiz._id.equals(idquiz)
      );
      return res.status(200).json(ambilquiz);
    } else {
      return res.status(403).send("gagal");
    }
  }
});

//editquiz
router.post("/editquiz", async (req, res) => {
  const token = req.headers["x-auth-token"];
  if (token == null || token == "") {
    return res.status(200).send("invalid");
  } else {
    try {
      tokendata = jwt.verify(token, secret);
    } catch (err) {
      return res.status(200).send("invalid");
    }
    const { idquiz, idkursus, name, questions } = req.body;
    const ambilkursus = await Kursus.findOne({
      _id: idkursus,
    });
    if (ambilkursus.owner == tokendata._id.toString()) {
      const ambilquizindex = ambilkursus.quiz.findIndex((quiz) =>
        quiz._id.equals(idquiz)
      );
      ambilkursus.quiz[ambilquizindex].name = name;
      ambilkursus.quiz[ambilquizindex].questions = questions;
      await ambilkursus.save();
      return res.status(200).send("sukses");
    } else {
      return res.status(403).send("gagal");
    }
  }
});

//getpdf
router.get("/viewassignment/:filename", uploadAssignment.getPdf);

module.exports = router;
