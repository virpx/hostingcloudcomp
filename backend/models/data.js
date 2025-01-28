const mongoose = require("mongoose");

const materiKursusSchema = new mongoose.Schema(
  {
    path: String,
    name: String,
  },
  {
    versionKey: false,
  }
);

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answers: [answerSchema],
    score: Number,
  },
  {
    versionKey: false,
  }
);

const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
});

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const kursusSchema = new mongoose.Schema(
  {
    nama_kursus: String,
    kategori: String,
    harga: Number,
    materi: [materiKursusSchema],
    quiz: [quizSchema],
    assignment: [assignmentSchema],
    owner: mongoose.Schema.ObjectId,
    deskripsi: String,
    thumb_path: String,
    active: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    email: String,
    name: String,
    password: String,
    profile_path: String,
    role: Number, //student 0 || teacher 1
    active: Number,
    createdAt: Date,
    updatedAt: Date,
    listkursus: [
      {
        _id: false,
        kursus: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Kursus",
        },
        last_progress: { type: Number, default: 1 },
        current_index: { type: Number, default: 1 },
        nilai_quiz: [
          {
            name: String,
            score: Number,
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const transactionSchema = new mongoose.Schema(
  {
    order_id: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kursus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kursus",
      required: true,
    },
    paid_amount: Number,
    status: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const tugasSchema = new mongoose.Schema(
  {
    tugas_id: mongoose.Schema.Types.ObjectId,
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    path: String,
    score: {
      type: Number,
      default: -1,
    },
  },
  {
    versionKey: false,
  }
);
const forumanswerSchema = new mongoose.Schema({
  iduser: mongoose.Schema.Types.ObjectId,
  answer: String,
  ishighlight: {
    type: Boolean,
    default: false,
  },
});
const forumSchema = new mongoose.Schema(
  {
    kursus_id: mongoose.Schema.Types.ObjectId,
    question: String,
    lanswer: [forumanswerSchema],
  },
  {
    versionKey: false,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
const Kursus = mongoose.model("Kursus", kursusSchema);
const User = mongoose.model("User", userSchema);
const Tugas = mongoose.model("Tugas", tugasSchema);
const Forum = mongoose.model("Forum", forumSchema);
module.exports = { Kursus, User, Tugas, Transaction, Forum };
