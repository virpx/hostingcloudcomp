const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Kursus, Transaction, Tugas, Forum } = require("./models/data");
const uploadProfile = require("./controller/uploadProfile");
const uploadAssignment = require("./controller/uploadAssignment");
const getPPTeacher = require("./controller/getPPTeacher");
const app = express();
const port = 3000;
const cors = require("cors");
const teacher = require("./teacher");
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const helper = require("./helper");

const secret = "rahasia";
app.use("/teacher", teacher);
app.post("/register", async (req, res) => {
  let { name, password, cpassword, email, role } = req.body;

  if (password.length < 8) {
    return res.status(400).json({
      message: "Minimum password length is 8 characters!",
    });
  }

  if (password !== cpassword) {
    return res.status(400).json({
      message: "Password and Confirm Password Unmatched!",
    });
  }

  let checkEmail = await User.find({ email: email });

  if (checkEmail.length !== 0) {
    return res.status(400).json({ message: "Email already in use" });
  }

  let hashedPassword;
  await bcrypt.hash(password, 10).then((hash) => {
    hashedPassword = hash;
  });

  const addUser = await User.insertMany([
    {
      name: name,
      password: hashedPassword,
      email: email,
      profile_path: null,
      role: parseInt(role),
      active: 1,
      createdAt: helper.formatDate(new Date()),
      updatedAt: helper.formatDate(new Date()),
      listkursus: [],
    },
  ]);

  return res.status(200).json({
    message: "Registered Succesfully!",
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  const findUser = await User.find({
    email: email,
  });

  if (findUser == 0) {
    return res
      .status(400)
      .json({ message: "The user has not been registered" });
  }

  const checkPassword = await bcrypt.compare(password, findUser[0].password);

  if (!checkPassword) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  let token = jwt.sign(
    {
      _id: findUser[0]._id,
      role: findUser[0].role,
    },
    secret,
    { expiresIn: "3600s" }
  );
  return res.status(200).json({
    email: email,
    token: token,
    _id: findUser[0]._id,
    message: "You have successfully logged in to your account.",
  });
});

//get activeuser
app.get("/activeUser", async (req, res) => {
  let flag = false;
  let user;
  let data;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
      }
    } catch (err) {}
  }
  return res.status(200).json({
    user,
  });
});

//get all user
app.get("/users", async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
});

//get all Transaction
app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  return res.status(200).json(transactions);
});

//get all kursus
app.get("/kursus", async (req, res) => {
  const kursus = await Kursus.find({ active: 1 });
  return res.status(200).json(kursus);
});

//get list kursus user
app.get("/listKursus", async (req, res) => {
  let flag = false;
  let user;
  let data;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  const kursus = await User.aggregate([
    {
      $lookup: {
        from: "kursus",
        localField: "listkursus.kursus",
        foreignField: "_id",
        as: "kursus",
      },
    },
    {
      $match: {
        _id: user[0]._id,
      },
    },
  ]);
  var listkursus = [];

  kursus[0].listkursus.map((k, index) => {
    const newData = {
      kursus: kursus[0].kursus[index],
      start_enroll: k.start_enroll,
      stop_enroll: k.stop_enroll,
      last_progress: k.last_progress,
      current_index: k.current_index,
    };
    listkursus.push(newData);
  });

  return res.status(200).json({
    listkursus,
  });
});

//get kursus information
app.get("/kursus/:_id", async (req, res) => {
  const kursus = await Kursus.find({ _id: req.params._id });
  console.log(kursus.materi)
  const user = await User.find({ _id: kursus[0].owner });
  return res.status(200).json({
    kursus: kursus,
    teacher: user,
  });
});

//update current index
app.put("/currentindex", async (req, res) => {
  let { id_kursus, current_index } = req.body;
  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  const updateUser = await User.updateOne(
    {
      _id: id_user,
      "listkursus.kursus": id_kursus,
    },
    {
      $set: {
        "listkursus.$.current_index": current_index,
      },
    }
  );
  return res.status(200).json({ message: "sukses" });
});

//update last progress
app.put("/lastprogress", async (req, res) => {
  let { id_kursus, last_progress } = req.body;
  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  const getUser = await User.findOne(
    { _id: id_user },
    { listkursus: { $elemMatch: { kursus: id_kursus } } }
  );

  let specificListKursus;
  if (getUser) {
    specificListKursus = getUser.listkursus[0];
  }

  if (specificListKursus.last_progress < last_progress) {
    const updateUser = await User.updateOne(
      {
        _id: id_user,
        "listkursus.kursus": id_kursus,
      },
      {
        $set: {
          "listkursus.$.last_progress": last_progress,
        },
      }
    );
  }

  return res.status(200).json({ message: "sukses" });
});

//get current course progress info
app.get("/currentCourse", async (req, res) => {
  let { id_kursus } = req.query;
  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }
  const getUser = await User.findOne(
    { _id: id_user },
    { listkursus: { $elemMatch: { kursus: id_kursus } } }
  );

  let specificListKursus;
  if (getUser) {
    specificListKursus = getUser.listkursus[0];
  }

  return res.status(200).json({ specificListKursus });
});

//submit jawaban
app.post("/submitquiz", async (req, res) => {
  let { id_quiz, id_kursus, jawaban } = req.body;
  const getKursus = await Kursus.findOne({ _id: id_kursus });

  let filteredQuiz = getKursus.quiz.filter(
    (quiz) => quiz._id.toString() === id_quiz
  );

  let score = 0;
  let maxScore = 0;
  filteredQuiz[0].questions.map((q, index) => {
    q.answers.map((a) => {
      if (a.isCorrect) {
        if (jawaban[index] == a.text) {
          score += q.score;
        }
        maxScore += q.score;
      }
    });
  });

  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }
  const newScore = (score / maxScore) * 100;
  const newData = { name: filteredQuiz[0].name, score: newScore };
  const pushNilai = await User.updateOne(
    { _id: id_user, "listkursus.kursus": id_kursus },
    { $push: { "listkursus.$.nilai_quiz": newData } }
  );
  console.log(pushNilai);
  return res.status(200).json({ score: newScore, maxScore: 100 });
});

//get all tugas
app.get("/tugas", async (req, res) => {
  const tugas = await Tugas.find();
  return res.status(200).json({
    tugas,
  });
});

//upload pp
app.post("/uploadpp", uploadProfile.singleFile);

//get pp
app.get("/getpp", uploadProfile.getImage);

//get ppteacher
app.get("/getppteacher", getPPTeacher.getPPTeacher);

//submit assignment
app.post("/submitassignment", uploadAssignment.singleFile);

//get assignment
app.get("/getassignment", uploadAssignment.getPdf);

//get list forum di kursus
app.get("/listforum", async (req, res) => {
  let { kursus_id } = req.query;
  const result = await Forum.aggregate([
    {
      $match: { kursus_id: new ObjectId(kursus_id) },
    },
    {
      $unwind: { path: "$lanswer", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "users",
        localField: "lanswer.iduser",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$_id",
        kursus_id: { $first: "$kursus_id" },
        question: { $first: "$question" },
        lanswer: {
          $push: {
            $cond: {
              if: { $ne: ["$user", []] },
              then: {
                iduser: "$lanswer.iduser",
                answer: "$lanswer.answer",
                ishighlight: "$lanswer.ishighlight",
                user: {
                  email: "$user.email",
                  name: "$user.name",
                },
              },
              else: "$$REMOVE",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        kursus_id: 1,
        question: 1,
        lanswer: {
          $cond: {
            if: { $eq: ["$lanswer", [null]] },
            then: [],
            else: "$lanswer",
          },
        },
      },
    },
  ]);

  return res.status(200).json({
    listforum: result,
  });
});

//insert answer to forum
app.post("/submitanswer", async (req, res) => {
  let { forum_id, answer } = req.body;

  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  const newAnswer = {
    iduser: id_user,
    answer: answer,
    ishighlight: false,
  };

  const result = await Forum.updateOne(
    { _id: forum_id },
    { $push: { lanswer: newAnswer } }
  );

  return res.status(200).json({ message: "berhasil" });
});

//post question to forum
app.post("/askquestion", async (req, res) => {
  let { id_kursus, question } = req.body;

  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  const result = await Forum.insertMany([
    {
      kursus_id: id_kursus,
      question: question,
      lanswer: [],
    },
  ]);
  console.log(result);
  return res.status(200).json({ message: "berhasil" });
});

//send otp
app.post("/sendotp", async (req, res) => {
  let { email, otp } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    return res
      .status(400)
      .json({ message: "Account not found, you have to register first" });
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "learnfocusontarget@outlook.com",
      pass: "noreplylearnfocus222Q",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  transporter.sendMail(
    {
      from: "learnfocusontarget@outlook.com", // verified sender email
      to: email, // recipient email
      subject: "Verification Code (OTP) to Reset Password", // Subject line
      text: "Verification Code (OTP) is " + otp, // plain text body
      // html: "<b>Hello world!</b>", // html body
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
  return res.status(200).json({ message: "Code sent to " + email });
});

app.post("/resetpassword", async (req, res) => {
  let { password, cpassword, email } = req.body;

  if (password.length < 8) {
    return res.status(400).json({
      message: "Minimum password length is 8 characters!",
    });
  }

  if (password !== cpassword) {
    return res.status(400).json({
      message: "Password and Confirm Password Unmatched!",
    });
  }

  let checkEmail = await User.findOne({ email: email });

  let hashedPassword;
  await bcrypt.hash(password, 10).then((hash) => {
    hashedPassword = hash;
  });

  await User.updateOne(
    { email: checkEmail.email },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );
  return res.status(200).json({
    message: "Reset Password Succesfully!",
  });
});

//TRANSACTION
app.post("/create-payment", async (req, res) => {
  let { id_kursus, gross_amount } = req.body;

  let user, id_user;
  const token = req.headers["x-auth-token"] || "";
  if (token) {
    try {
      data = jwt.verify(token, secret);
      user = await User.find({ _id: data._id });
      if (user) {
        flag = true;
        id_user = data._id;
      }
    } catch (err) {
      return res.status(400).json({
        err,
      });
    }
  }

  try {
    gross_amount = parseInt(gross_amount);
    const order_id = helper.generateOrderId(id_user);
    const midtransPromise = axios.post(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        transaction_details: {
          order_id,
          gross_amount,
        },
        credit_card: {
          secure: true,
        },
      },
      {
        auth: {
          username: "SB-Mid-server-ZCktv1JIy74Z0J9kPErDHJ77",
          password: "",
        },
      }
    );

    const cekada = await Transaction.findOne({
      user: id_user,
      kursus: id_kursus,
    });
    if (cekada && cekada.status == "pending") {
      const updateid = await Transaction.updateOne(
        {
          user: id_user,
          kursus: id_kursus,
        },
        { $set: { order_id: order_id } }
      );
    }
    if (cekada == null) {
      const newTransaction = new Transaction({
        order_id: order_id,
        user: id_user,
        kursus: id_kursus,
        paid_amount: gross_amount,
        status: "pending",
      });
      newTransaction.save();
    }

    return res.status(200).json((await midtransPromise).data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to handle Midtrans payment notifications
app.post("/payment-notification-handler", async (req, res) => {
  const listTrans = await Transaction.find();
  listTrans.map(async (l) => {
    const url = "https://api.sandbox.midtrans.com/v2" + `/${l.order_id}/status`;
    const data = (
      await axios.get(url, {
        auth: {
          username: "SB-Mid-server-ZCktv1JIy74Z0J9kPErDHJ77",
          password: "",
        },
      })
    ).data;

    if (data.status_code == "404") {
      return;
    }

    try {
      const transaction = await Transaction.findOne({
        order_id: data.order_id,
      });

      if (!transaction) {
        console.log(`Transaction with order_id ${data.order_id} not found.`);
        return;
      }

      transaction.status = data.transaction_status;

      await transaction.save();

      console.log(
        `Transaction with order_id ${data.order_id} updated successfully.`
      );

      if (
        data.transaction_status === "capture" ||
        data.transaction_status === "settlement"
      ) {
        const newKursus = {
          kursus: transaction.kursus,
          last_progress: 1,
          current_index: 1,
          nilai_quiz: [],
        };
        const finduser = await User.findOne({ _id: transaction.user });
        var sudahenroll = false;

        finduser.listkursus.map((lk) => {
          if (lk.kursus == newKursus.kursus) {
            sudahenroll = true;
          }
        });

        if (!sudahenroll) {
          const pushKursus = await User.updateOne(
            { _id: transaction.user },
            { $push: { listkursus: newKursus } }
          );
        }
      }
    } catch (error) {
      console.error("Error handling payment notification:", error);
    }
  });

  res.status(200).json({ status: "success" });
});

app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb+srv://vieryp21:GVANIVVTMJh3Ipao@cluster0.tgidq.mongodb.net/proyekfpw");
    console.log("Database connected");
  } catch (e) {
    console.log("Error database connection \n", e);
  }
  console.log(`Example app listening on port ${port}!`);
});
