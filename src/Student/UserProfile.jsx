import {
  Avatar,
  Button,
  IconButton,
  Input,
  Typography,
  Paper,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import authHeader from "../services/auth-header";
import { Buffer } from "buffer";
import Footer from "../Index/Footer";
import TeacherNavbar from "../Teacher/TeacherNavbar";

const host = "http://34.101.102.183:3000";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [avatarSrc, setAvatarSrc] = useState("/images/example.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [currentUser, setUser] = useState();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const newSelectedFile = event.target.files[0];
    setSelectedFile(newSelectedFile);

    if (newSelectedFile) {
      const objectURL = URL.createObjectURL(newSelectedFile);
      setAvatarSrc(objectURL);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${host}/getpp`, {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      });
      const imageSrc = response.data;
      setAvatarSrc(imageSrc);
      console.log(imageSrc);
    } catch (error) {
      console.error("Error fetching image:", error.message);
    }
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
    getUserInfo();
  }, []);

  const handleSaveClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("email", user.email);
      formData.append("profile_image", selectedFile);
      try {
        const response = await axios.post(`${host}/uploadpp`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": authHeader()["x-access-token"],
          },
        });

        if (response.status === 200) {
          const objectURL = URL.createObjectURL(selectedFile);
          setAvatarSrc(objectURL);
          alert("Successfully Changed Profile Picture");
          location.reload();
          getUserInfo();
        } else {
          console.error("Profile picture upload failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div>
      {currentUser && (
        <div>
          {currentUser.role === 0 ? <Navbar /> : <TeacherNavbar />}
          <Paper
            elevation={3}
            style={{ maxWidth: "400px", margin: "20px auto", padding: "20px" }}
          >
            <div style={{ textAlign: "center" }}>
              <h1>Profile</h1>
              <IconButton onClick={handleButtonClick}>
                <IconButton style={{ position: "absolute", zIndex: "100" }}>
                  <EditIcon style={{ fontSize: "35pt", color: "grey" }} />
                </IconButton>
                <Avatar
                  src={avatarSrc}
                  style={{
                    margin: "20px",
                    width: "120px",
                    height: "120px",
                    border: "4px solid #1877f2",
                  }}
                />
              </IconButton>

              <Input
                type="file"
                inputRef={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div>
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td style={{ color: "grey" }}>{currentUser.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td style={{ color: "grey" }}>{currentUser.email}</td>
                    </tr>
                    <tr>
                      <td>Role</td>
                      <td style={{ color: "grey" }}>
                        {currentUser.role === 0 ? "Student" : "Teacher"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
                style={{ marginTop: "20px" }}
              >
                Save Profile Picture
              </Button>
            </div>
          </Paper>
          <br></br>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
