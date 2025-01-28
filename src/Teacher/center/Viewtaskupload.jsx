import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import TeacherNavbar from "../TeacherNavbar";
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
export default function Viewtaskupload() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const urlapi = "http://34.101.102.183:3000/teacher/";
  async function submitnilai(data) {
    const hasil = await axios.post(urlapi + "simpannilai", data, {
      headers: {
        "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    navigate(0);
  }
  const navigate = useNavigate();
  const dataload = useLoaderData();
  console.log(dataload);
  useEffect(() => {
    document.getElementById("containerutama").style.maxHeight =
      document.getElementById("containerutama").offsetHeight + "px";
    document.getElementById("containerdalam").style.height = "90%";
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
            <button
              className="btn btn-danger font-white"
              style={{ width: "100px" }}
              onClick={() => {
                navigate("../");
              }}
            >
              Back
            </button>
            <br></br>
            <br></br>
            <div className="container">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th style={{ minWidth: "5px", maxWidth: "5px" }}>No</th>
                    <th style={{ minWidth: "70%" }}>Name</th>
                    <th>Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {dataload.map((data, counter) => {
                    return (
                      <tr>
                        <td>{counter + 1}</td>
                        <td>
                          <a
                            href={
                              "https://storage.googleapis.com/elearning-bucket-2025/" +
                              data.path
                            }
                            target="_blank"
                          >
                            {data.namauser}
                          </a>
                        </td>
                        <td>
                          {data.nilai == -1 && (
                            <>
                              <form onSubmit={handleSubmit(submitnilai)}>
                                <input
                                  type="text"
                                  hidden
                                  value={data.id}
                                  {...register("idsubmit")}
                                ></input>
                                <input
                                  type="number"
                                  required
                                  {...register("nilai")}
                                ></input>
                                <input type="submit" value={"Save"}></input>
                              </form>
                            </>
                          )}
                          {data.nilai > -1 && data.nilai}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
