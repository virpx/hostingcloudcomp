import {
  AppBar,
  CircularProgress,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";
import TeacherNavbar from "./TeacherNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
const chartsParams = {
  margin: { bottom: 20, left: 25, right: 5 },
  height: 300,
};
const host = "http://34.101.102.183:3000";
export default function Indexteacher() {
  const [color, setColor] = useState("#4e79a7");
  const [kategoripilih, setkategoripilih] = useState("All");
  const navigate = useNavigate();
  const [loadingpage, setloadingpage] = useState("belum");
  const [dataload, setdataload] = useState();
  const [kursusshow, setkursusshow] = useState();
  const loaddata = async () => {
    var axiosdata = await axios.get(
      "http://34.101.102.183:3000/teacher/teacherdata",
      {
        headers: {
          "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
        },
      }
    );
    setdataload(axiosdata.data);
    setkursusshow(axiosdata.data.kursus.lkursus);
    setloadingpage("sudah");
    settingheight();
  };
  function settingheight() {
    try {
      document.getElementById("containerkanan").style.height = "100%";
    } catch (e) {
      setTimeout(function () {
        settingheight();
      }, 100);
    }
  }
  function gantikursusshow(pilihan) {
    if (pilihan == "All") {
      setkursusshow(dataload.kursus.lkursus);
    } else {
      var datae = [];
      for (const iterator of dataload.kursus.lkursus) {
        if (iterator.kategori == pilihan) {
          datae.push(iterator);
        }
      }
      setkursusshow(datae);
    }
  }

  const [imageSrc, setImageSrc] = useState("");
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `${host}/getppteacher?id_user=` +
          JSON.parse(localStorage.getItem("user"))._id,
      );
      const imageSrc = response.data;
      setImageSrc(imageSrc);
      console.log(imageSrc);
    } catch (error) {
      console.error("Error fetching image:", error.message);
    }
  };

  useEffect(() => {
    document.getElementById("containerutama").style.maxHeight =
      document.getElementById("containerutama").offsetHeight + "px";
    loaddata();
    fetchImage();
  }, []);

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
          className="container"
          style={{
            flexGrow: "1",
            width: "100%",
            background: "white",
            marginTop: "20px",
            borderRadius: "20px",
            display: "flex",
          }}
        >
          {loadingpage == "belum" && (
            <div
              style={{ width: "100%", height: "100%" }}
              className="d-flex justify-content-center align-items-center"
            >
              <CircularProgress />
            </div>
          )}
          {loadingpage == "sudah" && (
            <>
              <div style={{ width: "500px", height: "100%", background: "" }}>
                <div
                  style={{
                    width: "100%",
                    height: "max-content",
                    background: "",
                    paddingTop: "30px",
                    marginLeft: "30px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "arial",
                      fontSize: "30px",
                      color: "black",
                    }}
                  >
                    <b>Hello,</b> {dataload.userdata.nama}👋
                  </p>
                  <p
                    style={{
                      fontFamily: "arial",
                      fontSize: "15px",
                      color: "rgb(146, 146, 146)",
                    }}
                  >
                    Welcome, nice to see you again!
                  </p>
                  <div
                    style={{ width: "100%", height: "auto", background: "" }}
                  >
                    <p
                      style={{
                        fontFamily: "arial",
                        fontSize: "30px",
                        color: "black",
                      }}
                    >
                      <b>Your Classes</b>
                    </p>
                    <div
                      className="container_kategori_select"
                      style={{
                        width: "90%",
                        height: "40px",
                        background: "",
                        display: "flex",
                        overflow: "scroll",
                      }}
                    >
                      {dataload.kursus.kategori.map((data, counter) => {
                        return (
                          <>
                            <div
                              className="d-flex justify-content-center align-items-center"
                              style={{
                                width: "max-content",
                                paddingLeft: "5px",
                                cursor: "pointer",
                                borderBottom:
                                  kategoripilih == data
                                    ? "2px solid #5840ba"
                                    : "2px solid white",
                                paddingRight: "5px",
                                height: "max-content",
                                color: "black",
                                fontFamily: "arial",
                                fontSize: "15px",
                                marginLeft: counter == 0 ? "" : "20px",
                              }}
                              onClick={() => {
                                setkategoripilih(data);
                                gantikursusshow(data);
                              }}
                            >
                              {data}
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <div
                      className="container_hasil_kategori"
                      style={{
                        width: "90%",
                        height: "max-content",
                        background: "",
                        marginTop: "10px",
                      }}
                    >
                      <ul className="list-group">
                        {kursusshow.map((data) => {
                          return (
                            <>
                              <li
                                className="list-group-item d-flex justify-content-center align-items-center"
                                style={{
                                  marginTop: "10px",
                                  cursor: "pointer",
                                  background: "#fef5e6",
                                  border: "none",
                                }}
                              >
                                <img
                                  src={
                                    data.thumb_path
                                  }
                                  className="img-fluid"
                                  width={50}
                                  height={50}
                                ></img>
                                <div
                                  style={{ flexGrow: "1", marginLeft: "20px" }}
                                >
                                  {data.nama_kursus}
                                </div>
                              </li>
                            </>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="containerkanan"
                style={{
                  flexGrow: "1",
                  height: "10px",
                  background: "",
                  overflow: "scroll",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "330px",
                    background: "",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "300px",
                      height: "290px",
                      background: "white",
                      borderRadius: "12px",
                      paddingTop: "20px",
                      marginTop: "30px",
                      marginLeft: "30px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    }}
                  >
                    <div
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "250px",
                        height: "130px",
                        backgroundImage:
                          "url('https://i.pinimg.com/736x/0e/f0/d8/0ef0d88f468b4d68d8da02e5db11bb96.jpg')",
                        backgroundSize: "100% 100%",
                        borderRadius: "12px",
                      }}
                    >
                      <img
                        src={imageSrc}
                        width={100}
                        height={100}
                        style={{
                          filter: "brightness(100%)",
                          borderRadius: "12px",
                          marginTop: "80px",
                          marginLeft: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate("/profile");
                        }}
                      ></img>
                    </div>
                    <p
                      style={{
                        marginTop: "60px",
                        marginLeft: "55px",
                        color: "black",
                      }}
                    >
                      <b>{dataload.userdata.nama}</b>
                    </p>
                    <p
                      style={{
                        marginTop: "-10px",
                        marginLeft: "55px",
                        color: "grey",
                      }}
                    >
                      <svg
                        version="1.1"
                        width={20}
                        height={20}
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 490.01 490.01"
                        xml:space="preserve"
                      >
                        <g>
                          <g>
                            <rect
                              id="XMLID_60_"
                              x="-14.319"
                              y="147.421"
                              transform="matrix(0.3244 -0.9459 0.9459 0.3244 -125.6895 185.1588)"
                              style={{ fill: "#A7A9AC" }}
                              width="162.194"
                              height="66.298"
                            />
                            <path d="M169.994,106.097l-6.1,3c-7.6,3.7-16.5,4.2-24.4,1.4l-10.2-3.6c-0.6-0.4-1.2-0.7-1.8-0.9l-62.8-21.5			c-4.7-1.6-9.9,0.9-11.5,5.6l-52.7,153.5c-0.8,2.3-0.6,4.8,0.4,6.9s2.9,3.8,5.2,4.6l62.7,21.5c1,0.3,2,0.5,2.9,0.5			c3.8,0,7.3-2.4,8.6-6.1l49.7-144.6l3.4,1.2c12.5,4.4,26.5,3.6,38.5-2.2l6.1-3c7.5-3.7,16.3-4.2,24.2-1.5l115.3,39.7			c-1.2,4.8-3.6,10.5-8,13.6c-4.9,3.4-12.2,3.4-21.8,0.1l-51.4-17.6c-2.4-0.8-5-0.6-7.2,0.6c-2.2,1.2-3.8,3.3-4.5,5.7			c-0.1,0.3-7.2,26.9-29.9,39.1c-14.3,7.7-32.1,8-53,0.9c-4.7-1.6-9.9,0.9-11.5,5.6c-1.6,4.7,0.9,9.9,5.6,11.5			c12,4.1,23.3,6.2,33.8,6.2c12.2,0,23.4-2.7,33.6-8.2c20.3-10.9,30.8-30,35.6-41.4l42.9,14.7c15.3,5.3,28.1,4.5,38-2.4			c15.9-11,16.7-33.3,16.8-34.3c0.1-4-2.4-7.5-6.1-8.8l-122.4-42.2C195.694,99.497,181.794,100.397,169.994,106.097z			 M66.194,256.497l-45.6-15.6l46.7-136.3l45.6,15.6L66.194,256.497z" />{" "}
                            <rect
                              id="XMLID_142_"
                              x="334.311"
                              y="148.377"
                              transform="matrix(-0.4395 -0.8982 0.8982 -0.4395 434.9314 634.4379)"
                              style={{ fill: "#3C92CA" }}
                              width="162.188"
                              height="66.294"
                            />{" "}
                            <path d="M410.194,266.797l-21.5,19.8c-19.5,17.9-41.5,33-65.3,44.6l-114.1,55.8c-5,2.5-11.1,0.4-13.6-4.7			c-2.5-5-0.4-11.1,4.7-13.6l1.4-0.7l0,0l62.4-30.5c4.5-2.2,6.4-7.6,4.2-12.1c-2.2-4.5-7.6-6.4-12.1-4.2l-62.4,30.5l0,0l-31.4,15.4			c-5,2.5-11.1,0.4-13.6-4.7c-1.2-2.4-1.4-5.2-0.5-7.7c0.9-2.6,2.7-4.6,5.1-5.8l23.7-11.6l0,0l67.8-33.2c4.5-2.2,6.4-7.6,4.2-12.1			s-7.6-6.4-12.1-4.2l-67.9,33.3l0,0l-2.6,1.3l-32.4,15.9c-2.4,1.2-5.2,1.4-7.7,0.5c-2.6-0.9-4.6-2.7-5.8-5.1			c-2.5-5-0.4-11.1,4.7-13.6l11.2-5.5l0,0l22.9-11.2l6.4-3.1l0,0l52.6-25.8c4.5-2.2,6.4-7.6,4.2-12.1s-7.6-6.4-12.1-4.2l-57,27.9			l-24.9,12.2c-5,2.4-11.1,0.4-13.6-4.7c-1.2-2.4-1.4-5.2-0.5-7.7c0.9-2.6,2.7-4.6,5.1-5.8l43.5-21.3c4.5-2.2,6.4-7.6,4.2-12.1			s-7.6-6.4-12.1-4.2l-43.5,21.3c-6.8,3.3-11.9,9.1-14.3,16.2s-2,14.8,1.3,21.6c2.1,4.2,5.1,7.7,8.7,10.3c-6.3,8.3-7.9,19.7-3,29.7			c3.3,6.8,9.1,11.9,16.2,14.3c3,1,6,1.5,9,1.5c-0.1,4.5,0.8,9,2.9,13.1c4.9,10,15,15.8,25.4,15.8c4.2,0,8.4-0.9,12.4-2.9l6.4-3.1			c0.3,3.4,1.2,6.7,2.7,9.9c4.9,10,15,15.8,25.4,15.8c4.2,0,8.4-0.9,12.4-2.9l114.1-55.8c25.4-12.4,48.8-28.4,69.6-47.5l25.5-23.5			l58.4-28.6c4.5-2.2,6.4-7.6,4.2-12.1l-71.4-145.5c-1.1-2.2-2.9-3.8-5.2-4.6c-2.3-0.8-4.8-0.6-6.9,0.4l-59.6,29.1			c-4.5,2.2-6.4,7.6-4.2,12.1L410.194,266.797z M405.394,106.197l63.3,129.5l-43.3,21.2l-63.3-129.5L405.394,106.197z" />
                          </g>
                        </g>
                      </svg>
                      &nbsp; {dataload.userdata.join}
                    </p>
                  </div>
                  <div
                    style={{
                      flexGrow: "1",
                      height: "290px",
                      marginTop: "30px",
                      background: "white",
                      marginLeft: "20px",
                      marginRight: "20px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div
                      style={{ width: "90%", height: "90%", background: "" }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div
                        style={{
                          width: "70px",
                          height: "100px",
                          background: "",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate("course");
                        }}
                      >
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            background: "#a2d2ff",
                            borderRadius: "12px",
                            boxShadow:
                              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <svg
                            style={{ color: "black" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            class="bi bi-book"
                            viewBox="0 0 16 16"
                          >
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                          </svg>
                        </div>
                        <p
                          align="center"
                          style={{ marginTop: "10px", color: "black" }}
                        >
                          Course
                        </p>
                      </div>
                      <div
                        style={{
                          width: "70px",
                          height: "100px",
                          background: "",
                          marginLeft: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate("report");
                        }}
                      >
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            background: "#ffd6a5",
                            borderRadius: "12px",
                            boxShadow:
                              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <svg
                            style={{ color: "black" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            class="bi bi-bar-chart"
                            viewBox="0 0 16 16"
                          >
                            <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
                          </svg>
                        </div>
                        <p
                          align="center"
                          style={{ marginTop: "10px", color: "black" }}
                        >
                          Report
                        </p>
                      </div>
                      <div
                        style={{
                          width: "70px",
                          height: "100px",
                          background: "",
                          marginLeft: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          navigate("forum");
                        }}
                      >
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            background: "#ff9770",
                            borderRadius: "12px",
                            boxShadow:
                              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <svg
                            style={{ color: "black" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            fill="currentColor"
                            class="bi bi-chat-right-dots"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                            <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                          </svg>
                        </div>
                        <p
                          align="center"
                          style={{ marginTop: "10px", color: "black" }}
                        >
                          Forum
                        </p>
                      </div>

                      <div
                        style={{
                          width: "70px",
                          height: "100px",
                          background: "",
                          marginLeft: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          localStorage.removeItem("user");
                          localStorage.removeItem("storedTime");
                          navigate("/");
                        }}
                      >
                        <div
                          style={{
                            width: "70px",
                            height: "70px",
                            background: "red",
                            borderRadius: "12px",
                            boxShadow:
                              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                          }}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <g>
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z" />{" "}
                            </g>
                          </svg>
                        </div>
                        <p
                          align="center"
                          style={{ marginTop: "10px", color: "black" }}
                        >
                          Logout
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    background: "",
                    display: "flex",
                    marginTop: "30px",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: "80px",
                      background: "rgb(162, 210, 255)",
                      marginLeft: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      borderRadius: "5px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    }}
                  >
                    <span style={{ fontSize: "20px", color: "black" }}>
                      <b>Total Student</b>{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "black",
                        margin: "0px",
                      }}
                    >
                      {dataload.student.jumlah}
                    </span>
                  </div>
                  <div style={{ width: "50px" }}></div>
                  <div
                    style={{
                      width: "50%",
                      height: "80px",
                      background: "rgb(255, 151, 112)",
                      marginRight: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      borderRadius: "5px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                    }}
                  >
                    <span style={{ fontSize: "20px", color: "black" }}>
                      <b>Total Course</b>{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "black",
                        margin: "0px",
                      }}
                    >
                      {dataload.kursus.jumlah}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    background: "",
                    paddingBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      flexGrow: "1",
                      height: "380px",
                      paddingBottom: "20px",
                      background: "white",
                      borderRadius: "12px",
                      marginTop: "30px",
                      marginLeft: "30px",
                      marginRight: "20px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <p
                      className="text-center color-black text-dark"
                      style={{ fontSize: "20px", marginTop: "30px" }}
                    >
                      <b>This Year's Sales Chart</b>
                    </p>
                    <Stack
                      direction="column"
                      spacing={2}
                      alignItems="center"
                      sx={{ width: "95%" }}
                    >
                      <LineChart
                        {...chartsParams}
                        series={[
                          {
                            data: dataload.chart,
                          },
                        ]}
                        xAxis={[
                          {
                            scaleType: "band",
                            data: [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "June",
                              "July",
                              "Aug",
                              "Sept",
                              "Oct",
                              "Nov",
                              "Dec",
                            ],
                          },
                        ]}
                      />
                    </Stack>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
