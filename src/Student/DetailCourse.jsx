import { useLoaderData, useNavigate } from "react-router-dom";
import Footer from "../Index/Footer";
import Navbar from "../Navbar";
import "../css/detailcourse.css";
import authHeader from "../services/auth-header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";

const host = "http://34.101.102.183:3000";
const DetailCourse = () => {
  const navigate = useNavigate();
  const data = useLoaderData();

  const auth = () => {
    var header = authHeader();
    if (header == null) {
      navigate("/login");
    }
  };

  const [course, setCourse] = useState(data.kursus[0]);
  const [teacher, setTeacher] = useState(data.teacher[0]);
  const [imageSrc, setImageSrc] = useState("");
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `${host}/getppteacher?id_user=${teacher._id}`
      );
      const imageSrc = response.data;
      setImageSrc(imageSrc);
    } catch (error) {
      console.error("Error fetching image:", error.message);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);
  const hrefemail = "mailto:" + teacher.email;

  const handleenroll = async () => {
    const result = await axios.post(
      `${host}/create-payment`,
      { id_kursus: course._id, gross_amount: course.harga },
      {
        headers: {
          "x-auth-token": authHeader()["x-access-token"],
        },
      }
    );
    window.open(result.data.redirect_url, "_blank", "rel=noopener noreferrer");
  };

  return (
    <>
      <Navbar />
      <div id="main-container">
        <div id="header-section">
          <h1 id="title-text">Course Detail</h1>
          <p id="subtitle-text">Explore the details of our amazing course</p>
        </div>
        <div className="content-section" id="course-overview-section">
          <h2 id="course-overview-content">Course Overview</h2>
          <p id="course-overview-content">Title: {course.nama_kursus}</p>
          <p id="course-overview-content">Price: Rp. {course.harga},00</p>
          <h3 id="course-overview-content">Material Titles:</h3>
          <ul id="course-overview-content">
            {course.materi.map((c, index) => {
              return (
                <li>
                  Material {index + 1}: {c.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="content-section" id="instructor-information-section">
          <h2 id="course-overview-content">Instructor Information</h2>
          <div className="instructor-profile">
            <img
              src={imageSrc}
              alt="Instructor Profile"
              width={100}
              height={100}
              id="profile-image"
            />
            <div id="instructor-info-container">
              <p className="instructor-info-text">Name: {teacher.name}</p>
              <p className="instructor-info-text">Email: {teacher.email}</p>
            </div>
          </div>
        </div>
        <div className="content-section" id="enrollment-information-section">
          <h2 id="course-overview-content">Enrollment Information</h2>
          <p id="course-overview-content">
            Ready to join?&nbsp;
            <span
              id="enrollment-link"
              style={{ cursor: "pointer" }}
              onClick={() => {
                auth();
                if (!auth()) {
                  handleenroll();
                }
              }}
            >
              Enroll now
            </span>
          </p>
          <p id="course-overview-content">
            Have questions? Contact us at&nbsp;
            <a href={hrefemail} id="enrollment-link">
              {teacher.email}
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DetailCourse;
