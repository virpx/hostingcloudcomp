import { useEffect, useState } from "react";
import * as React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Footer from "../Index/Footer";
import Navbar from "../Navbar";
import "../css/class.css";
import "../css/quiz.css";
import "../css/coursereport.css";
import "../css/courseassignment.css";
import authHeader from "../services/auth-header";
import axios from "axios";
const host = "http://34.101.102.183:3000";
const Class = () => {
  const navigate = useNavigate();
  const data = useLoaderData();
  const [course, setCourse] = useState(data.kursus[0]);
  const [courseInfo, setCourseInfo] = useState();
  const materiObjects = course.materi;
  const quizObjects = course.quiz;
  const assignmentObjects = course.assignment;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentBoard, setCurrentBoard] = useState("material");
  const [currentUser, setUser] = useState();
  const totalPages = materiObjects.length;
  const [quiz, setQuiz] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [completedAssignment, setCompletedAssignment] = useState(null);
  const [forumList, setForumList] = useState();
  const [Forum, setForum] = useState(null);

  const getCurrentCourseInfo = async () => {
    const getData = await axios.get(
      `${host}/currentCourse?id_kursus=${course._id}`,
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
    setCourseInfo(getData.data.specificListKursus);
    setCurrentPage(getData.data.specificListKursus.current_index);
  };

  const getForumInfo = async () => {
    const getData = await axios.get(
      `${host}/listforum?kursus_id=${course._id}`,
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
    setForumList(getData.data.listforum);
  };

  const getUserInfo = async () => {
    const getData = await axios.get(`${host}/activeUser`, {
      headers: {
        "x-auth-token": authHeader()["x-access-token"],
      },
    });
    setUser(getData.data.user[0]);
  };

  useEffect(() => {
    getCurrentCourseInfo();
    getUserInfo();
  }, []);

  useEffect(() => {
    getForumInfo();
  }, [courseInfo]);

  const getCompleteAssignment = async () => {
    const getData = await axios.get(`${host}/tugas`, {
      headers: {
        "x-auth-token": authHeader()["x-access-token"],
      },
    });
    var completed = getData.data.tugas.filter(
      (item) => item.user_id === currentUser._id
    );
    setCompletedAssignment(completed);
  };

  useEffect(() => {
    getCompleteAssignment();
  }, [currentUser]);

  useEffect(() => {
    getCompleteAssignment();
  }, [assignment]);

  const updateCurrentIndex = async () => {
    const updateData = await axios.put(
      `${host}/currentindex`,
      {
        id_kursus: course._id,
        current_index: currentPage,
      },
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
  };

  const updateLastProgress = async () => {
    const updateData = await axios.put(
      `${host}/lastprogress`,
      {
        id_kursus: course._id,
        last_progress: currentPage,
      },
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    updateCurrentIndex();
    updateLastProgress();
  }, [currentPage]);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = selectedAnswer;
    setSelectedAnswers(newSelectedAnswers);
  };
  const [sudahlogin, setSudahLogin] = React.useState(false);
  const auth = () => {
    var header = authHeader();
    if (header != null) {
      const storedTime = localStorage.getItem("storedTime");
      const expirationTimeInSeconds = 3600;
      if (
        storedTime &&
        (Date.now() - parseInt(storedTime)) / 1000 < expirationTimeInSeconds
      ) {
        setSudahLogin(true);
      } else {
        alert("Session has expired or does not exist. Please Login again.");
        localStorage.clear();
        navigate("/");
        location.reload();
      }
    }
  };

  useEffect(() => {
    auth();
  }, [currentBoard]);

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("tugas_id", assignmentObjects[assignment]._id);
    formData.append("email", currentUser.email);
    formData.append("assignment_pdf", file);

    try {
      const response = await axios.post(`${host}/submitassignment`, formData, {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Successfully Completed The Assignment");
      setAssignment(null);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  const [textValue, setTextValue] = useState("");
  const [textValue2, setTextValue2] = useState("");

  const handleComment = async () => {
    const updateData = await axios.post(
      `${host}/submitanswer`,
      {
        forum_id: forumList[Forum]._id,
        answer: textValue,
      },
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
    alert("Successfully Posted an Answer");
    getForumInfo();
    setTextValue("");
  };
  const handlequestion = async () => {
    const updateData = await axios.post(
      `${host}/askquestion`,
      {
        id_kursus: course._id,
        question: textValue2,
      },
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
    alert("Successfully Posted a Question");
    getForumInfo();
    setTextValue2("");
  };

  return (
    <>
      <Navbar />
      {quizObjects !== null && (
        <div>
          <div id="sidebar">
            <div
              onClick={() => {
                setCurrentBoard("material");
              }}
            >
              Material
            </div>
            <div
              onClick={() => {
                setCurrentBoard("quiz");
              }}
            >
              Quiz
            </div>
            <div
              onClick={() => {
                setCurrentBoard("assignment");
              }}
            >
              Assignment
            </div>
            <div
              onClick={() => {
                setCurrentBoard("forum");
              }}
            >
              Forums
            </div>
            <div
              onClick={() => {
                setCurrentBoard("report");
              }}
            >
              Report
            </div>
          </div>

          {currentBoard == "material" && (
            <div id="content">
              <iframe
                src={materiObjects[currentPage - 1].path}
                type="application/pdf"
                width="100%"
                height="1000px"
              />
              <div className="button-container">
                <button
                  className={`button orange-button`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className={`button orange-button`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentBoard == "quiz" && (
            <div id="content">
              <h1 style={{ marginLeft: "10px" }}>Quiz List</h1>
              {quiz == null && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {quizObjects.map((e, index) => (
                    <div
                      key={e.name}
                      className="course-cardM"
                      onClick={() => {
                        setQuiz(index);
                      }}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                    >
                      <div className="course-card-textM">
                        <h2>{e.name}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {quiz !== null && (
                <div>
                  <button
                    id="submit-btn"
                    type="button"
                    onClick={() => {
                      setQuiz(null);
                      setSelectedAnswers([]);
                    }}
                  >
                    Back
                  </button>
                  {currentUser.listkursus.map((l) => {
                    if (l.kursus === course._id) {
                      const quizScore = l.nilai_quiz.find(
                        (n) => n.name === quizObjects[quiz].name
                      );

                      if (quizScore) {
                        return (
                          <div style={{ marginLeft: "10px" }}>
                            <br></br>
                            Your Quiz Score is {quizScore.score}
                          </div>
                        );
                      } else {
                        return (
                          <div>
                            <h1 style={{ marginLeft: "10px" }}>
                              {quizObjects[quiz].name}
                            </h1>
                            {quizObjects[quiz].questions.map((q, index) => (
                              <div key={index}>
                                <p id="soal" style={{ marginLeft: "10px" }}>
                                  {index + 1}. {q.question}
                                </p>
                                {quizObjects[quiz].questions[index].answers.map(
                                  (a, answerIndex) => (
                                    <label id="jawaban" key={answerIndex}>
                                      <input
                                        type="radio"
                                        value={a.text}
                                        style={{
                                          marginLeft: "10px",
                                        }}
                                        id="radio"
                                        checked={
                                          selectedAnswers[index] === a.text
                                        }
                                        onChange={() =>
                                          handleAnswerChange(index, a.text)
                                        }
                                      />
                                      {a.text}
                                    </label>
                                  )
                                )}
                              </div>
                            ))}
                            <button
                              id="submit-btn"
                              type="button"
                              onClick={async () => {
                                const updateData = await axios.post(
                                  `${host}/submitquiz`,
                                  {
                                    id_kursus: course._id,
                                    id_quiz: quizObjects[quiz]._id,
                                    jawaban: selectedAnswers,
                                  },
                                  {
                                    headers: {
                                      "x-auth-token":
                                        authHeader()["x-access-token"],
                                    },
                                  }
                                );
                                alert(
                                  "score: " +
                                    updateData.data.score +
                                    "/" +
                                    updateData.data.maxScore
                                );
                                setQuiz(null);
                                setSelectedAnswers([]);
                                getUserInfo();
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}

          {currentBoard == "assignment" && (
            <div id="content">
              <h1 style={{ marginLeft: "10px" }}>Assignment List</h1>
              {assignment == null && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {assignmentObjects.map((e, index) => {
                    const completedAssignmentItem = completedAssignment.find(
                      (c) => e._id === c.tugas_id
                    );

                    return (
                      <div
                        key={e.name}
                        className="course-cardM"
                        onClick={() => {
                          if (completedAssignmentItem) {
                            alert(
                              `Already Completed\nScore: ${completedAssignmentItem.score}`
                            );
                          } else {
                            setAssignment(index);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="course-card-textM">
                          <h2>{e.name}</h2>
                          {completedAssignmentItem && (
                            <p style={{ color: "greenyellow" }}>Completed</p>
                          )}
                          {completedAssignmentItem && (
                            <p>Score: {completedAssignmentItem.score}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {assignment != null && (
                <div>
                  <button
                    id="submit-btn"
                    type="button"
                    onClick={() => {
                      setAssignment(null);
                    }}
                  >
                    Back
                  </button>

                  <div id="assignment-container">
                    <h2>Assignment Information</h2>
                    <div class="form-group">
                      <label for="assignmentName">Assignment Name:</label>
                      <div class="readonly-input" id="assignmentName">
                        {assignmentObjects[assignment].name}
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="assignmentDescription">
                        Assignment Description:
                      </label>
                      <div class="readonly-input" id="assignmentDescription">
                        {assignmentObjects[assignment].desc}
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <label htmlFor="formFile">
                          Upload Your Assignment (PDF):
                        </label>
                        <input
                          className="form-control"
                          name="fileUpload"
                          accept=".pdf"
                          type="file"
                          id="formFile"
                          onChange={handleFileChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <button id="submitBtn" onClick={handleSubmit}>
                          Submit Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentBoard == "report" && (
            <div id="content">
              <div>
                <h1 id="report-title">Student Score Report</h1>
                <h2 style={{ color: "white" }}>Assignment Scores</h2>
                <table className="score-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentObjects.map((e, index) => {
                      const completedAssignmentItem = completedAssignment.find(
                        (c) => e._id === c.tugas_id
                      );

                      return (
                        <tr>
                          <td>{e.name}</td>
                          {!completedAssignmentItem && <td>-</td>}
                          {completedAssignmentItem && (
                            <td>{completedAssignmentItem.score}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <h2 style={{ color: "white" }}>Quiz Scores</h2>
                <table className="score-table">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUser.listkursus.map((l) => {
                      if (l.kursus === course._id) {
                        return course.quiz.map((q, index) => {
                          const matchingNilaiQuiz = l.nilai_quiz.find(
                            (n) => n.name === q.name
                          );

                          return (
                            <tr key={index}>
                              <td>{q.name}</td>
                              <td>
                                {matchingNilaiQuiz
                                  ? matchingNilaiQuiz.score
                                  : "-"}
                              </td>
                            </tr>
                          );
                        });
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentBoard == "forum" && (
            <div id="content">
              {Forum == null && (
                <div>
                  <textarea
                    value={textValue2}
                    onChange={(e) => setTextValue2(e.target.value)}
                    rows={4}
                    cols={50}
                    placeholder="Enter Question here..."
                    style={{ resize: "none", width: "100%", height: "15 0px" }}
                  />
                  <button id="submit-btn" onClick={handlequestion}>
                    Post a Question
                  </button>
                  <h2>{forumList.length} questions</h2>
                  <table class="table table-striped">
                    <tbody>
                      {forumList.map((f, index) => {
                        const highlightAnswer = f.lanswer.find(
                          (answer) => answer.ishighlight
                        );

                        return (
                          <tr
                            key={f._id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setForum(index);
                            }}
                          >
                            <td
                              style={{
                                width: "100px",
                              }}
                            >
                              <br></br>
                              {highlightAnswer && (
                                <p
                                  style={{
                                    backgroundColor: "#17D577",
                                    borderRadius: "5px",
                                    width: "110px",
                                  }}
                                >
                                  ✅{f.lanswer.length} answers &nbsp;
                                </p>
                              )}

                              {!highlightAnswer && (
                                <p
                                  style={{
                                    width: "110px",
                                  }}
                                >
                                  {f.lanswer[0].user.email == undefined ? (
                                    <>0</>
                                  ) : (
                                    f.lanswer.length
                                  )}
                                  &nbsp;answers &nbsp;
                                </p>
                              )}
                            </td>
                            <td>
                              <h3>{f.question}</h3>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {Forum !== null && (
                <div>
                  <button
                    id="submit-btn"
                    type="button"
                    onClick={() => {
                      setForum(null);
                    }}
                  >
                    Back
                  </button>
                  <br></br>
                  <br></br>
                  <h2 style={{ marginLeft: "10px" }}>
                    Question: {forumList[Forum].question}
                  </h2>

                  <h3 style={{ marginLeft: "10px" }}>
                    {forumList[Forum].lanswer[0].user.email == undefined ? (
                      <>0</>
                    ) : (
                      forumList[Forum].lanswer.length
                    )}
                    &nbsp;Answers &nbsp;
                  </h3>
                  <hr style={{ border: "3px solid #17D577" }}></hr>
                  {forumList[Forum].lanswer.map((a, index) => {
                    if (a.ishighlight) {
                      return (
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                          }}
                        >
                          <div style={{ fontSize: "30pt" }}>✅</div>
                          <div
                            style={{
                              paddingTop: "6px",
                              width: "100%",
                              fontSize: "16pt",
                            }}
                          >
                            <div style={{ fontSize: "12pt" }}>
                              <b>{a.user.name}</b>
                            </div>
                            {a.answer}
                          </div>
                        </div>
                      );
                    }
                  })}
                  <hr style={{ border: "3px solid #17D577" }}></hr>
                  {forumList[Forum].lanswer.map((a, index) => {
                    if (!a.ishighlight) {
                      return (
                        <div
                          style={{
                            marginLeft: "10px",
                          }}
                        >
                          <div
                            style={{
                              paddingTop: "6px",
                              width: "100%",
                              fontSize: "16pt",
                              marginLeft: "55px",
                            }}
                          >
                            <div style={{ fontSize: "12pt" }}>
                              <b>{a.user.name}</b>
                            </div>
                            {a.answer}
                          </div>
                          <hr style={{ border: "1px solid white" }}></hr>
                        </div>
                      );
                    }
                  })}

                  <div>
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      rows={4}
                      cols={50}
                      placeholder="Enter text here..."
                      style={{ resize: "none", width: "100%", height: "200px" }}
                    />
                    <br />
                    <button id="submit-btn" onClick={handleComment}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Class;
