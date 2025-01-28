import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import TeacherNavbar from "../TeacherNavbar";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
export default function Addmateri() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dataload = useLoaderData();
  console.log(dataload);
  const urlapi = "http://34.101.102.183:3000/teacher/";
  async function submitform(data) {
    if (dataload[0] == "add") {
      const formdata = new FormData();
      formdata.append("idkursus", dataload[1]);
      formdata.append("nama", data.nama);
      formdata.append("filepdf", data.filepdf[0]);
      var hasil = await axios.post(urlapi + "addmateri", formdata, {
        headers: {
          "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
        },
      });
      if (hasil.data == "success") {
        alert("Success Add Topics");
        navigate("../");
      }
    } else {
      if (data.filepdf.length == 0) {
        var datasend = {
          nama: data.nama,
          idkursus: dataload[1],
          idmateri: dataload[2],
        };
        var hasil = await axios.post(urlapi + "editmateri", datasend, {
          headers: {
            "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
            "content-type": "application/x-www-form-urlencoded",
          },
        });
        if (hasil.data == "sukses") {
          alert("Success");
          navigate("../");
        } else {
          alert("Gagal");
        }
      } else {
        const formupload = new FormData();
        formupload.append("nama", data.nama);
        formupload.append("idkursus", dataload[1]);
        formupload.append("idmateri", dataload[2]);
        formupload.append("filepdf", data.filepdf[0]);
        var hasil = await axios.post(urlapi + "editmateripdf", formupload, {
          headers: {
            "x-auth-token": JSON.parse(localStorage.getItem("user")).token,
          },
        });
        if (hasil.data == "sukses") {
          alert("Success");
          navigate("../");
        } else {
          alert("Gagal");
        }
      }
    }
  }
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
            <form onSubmit={handleSubmit(submitform)}>
              {dataload[0] == "add" && (
                <>
                  <TextField
                    id="outlined-required"
                    label="Name"
                    sx={{ width: "100%", marginTop: "20px" }}
                    {...register("nama")}
                  />
                  <p
                    style={{
                      fontSize: "20px",
                      marginTop: "15px",
                      color: "black",
                    }}
                  >
                    PDF
                  </p>
                  <input
                    type="file"
                    className="form-control"
                    style={{
                      display: "inline",
                      width: "100%",
                      marginTop: "-10px",
                    }}
                    {...register("filepdf")}
                  ></input>
                </>
              )}
              {dataload[0] == "edit" && (
                <>
                  <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    sx={{ width: "100%", marginTop: "20px" }}
                    defaultValue={dataload[3].name}
                    {...register("nama")}
                  />
                  <p
                    style={{
                      fontSize: "20px",
                      marginTop: "15px",
                      color: "black",
                    }}
                  >
                    PDF
                  </p>
                  <input
                    type="file"
                    className="form-control"
                    style={{
                      display: "inline",
                      width: "100%",
                      marginTop: "-10px",
                    }}
                    {...register("filepdf")}
                  ></input>
                </>
              )}
              <button
                type="submit"
                className="btn btn-success"
                style={{ width: "100%", marginTop: "20px", height: "50px" }}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
