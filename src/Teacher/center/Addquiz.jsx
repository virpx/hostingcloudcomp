import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import TeacherNavbar from "../TeacherNavbar";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
export default function Addquiz() {
  const dataload = useLoaderData();
  const navigate = useNavigate();
  const urlapi = "http://localhost:3000/teacher/";
  const [quizName, setQuizName] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: "",
      answers: [
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
      ],
      score: 0,
    },
  ]);

  useEffect(() => {
    document.getElementById("containerutama").style.maxHeight =
      document.getElementById("containerutama").offsetHeight + "px";
    document.getElementById("containerdalam").style.height = "90%";
    if (dataload[0] == "edit") {
      setQuizName(dataload[3].name);
      setQuizQuestions(dataload[3].questions);
    }
  }, []);

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...quizQuestions];
    newQuestions[index].question = e.target.value;
    setQuizQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].answers[answerIndex].text = e.target.value;
    setQuizQuestions(newQuestions);
  };

  const handleIsCorrectChange = (questionIndex, answerIndex) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].answers.forEach((answer, index) => {
      answer.isCorrect = index === answerIndex;
    });
    setQuizQuestions(newQuestions);
  };

  const handleQuizNameChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleScoreChange = (questionIndex, e) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].score = parseInt(e.target.value, 10) || 0;
    setQuizQuestions(newQuestions);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const newQuestions = [...quizQuestions];
    newQuestions.splice(questionIndex, 1);
    setQuizQuestions(newQuestions);
  };

  const handleData = async () => {
    const datasend = {
      name: quizName,
      questions: quizQuestions,
      idkursus: dataload[1],
    };

    try {
      const response = await axios.post(urlapi + "addquiz", datasend, {
        headers: {
          "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
          "content-type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data === "sukses") {
        alert("Success");
        navigate("../");
      } else {
        alert("Gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  const handleData2 = async () => {
    const datasend = {
      name: quizName,
      questions: quizQuestions,
      idkursus: dataload[1],
      idquiz: dataload[2],
    };

    try {
      const response = await axios.post(urlapi + "editquiz", datasend, {
        headers: {
          "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
          "content-type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data === "sukses") {
        alert("Success");
        navigate("../");
      } else {
        alert("Gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataload[0] == "add") {
      handleData();
    } else {
      handleData2();
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#5840ba",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "20px",
        }}
      >
        <TeacherNavbar></TeacherNavbar>
        <div
          id="containerutama"
          className="container d-flex justify-content-center align-items-center"
          style={{
            overflow: "scroll",
            flexGrow: "1",
            width: "100%",
            background: "white",
            marginTop: "20px",
            borderRadius: "20px",
            display: "flex",
          }}
        >
          <div
            id="containerdalam"
            className="container"
            style={{
              flexDirection: "column",
              width: "96%",
              height: "90px",
              background: "",
            }}
          >
            <form style={{ color: "black" }} onSubmit={handleSubmit}>
              <button
                type="button"
                className="btn btn-danger font-white"
                style={{ width: "100px" }}
                onClick={() => {
                  navigate("../");
                }}
              >
                Back
              </button>
              <div className="float-end">
                <b>Quiz name:</b>
                <input
                  type="text"
                  value={quizName}
                  onChange={handleQuizNameChange}
                  required
                />
              </div>
              <br></br>
              <br></br>
              <div>
                {quizQuestions.map((question, questionIndex) => (
                  <div key={questionIndex}>
                    <b>{questionIndex + 1}. </b>
                    <input
                      required
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e)}
                    />
                    Score:
                    <input
                      type="number"
                      value={question.score}
                      onChange={(e) => handleScoreChange(questionIndex, e)}
                      required
                    />
                    <button
                      className="btn btn-danger"
                      type="button"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleDeleteQuestion(questionIndex)}
                    >
                      Delete
                    </button>
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answerIndex}>
                        <input
                          type="radio"
                          checked={answer.isCorrect}
                          onChange={() =>
                            handleIsCorrectChange(questionIndex, answerIndex)
                          }
                          required
                        />
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleAnswerChange(questionIndex, answerIndex, e)
                          }
                          required
                        />
                      </div>
                    ))}
                    <br></br>
                    <br></br>
                  </div>
                ))}
              </div>
              <br></br>
              <br></br>
              <div style={{ display: "flex" }}>
                <button
                  type="button"
                  className="btn btn-primary font-white"
                  style={{ width: "100px", marginRight: "10px" }}
                  onClick={() => {
                    setQuizQuestions([
                      ...quizQuestions,
                      {
                        question: "",
                        answers: [
                          {
                            text: "",
                            isCorrect: false,
                          },
                          {
                            text: "",
                            isCorrect: false,
                          },
                          {
                            text: "",
                            isCorrect: false,
                          },
                          {
                            text: "",
                            isCorrect: false,
                          },
                        ],
                        score: 0,
                      },
                    ]);
                  }}
                >
                  Add new Question
                </button>
                <button
                  type="submit"
                  className="btn btn-success font-white"
                  style={{ width: "100px" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
