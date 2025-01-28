import Navbar from "../Navbar";
import { useLoaderData, useNavigate } from "react-router-dom";
import authHeader from "../services/auth-header";
import { useEffect, useState } from "react";
import Footer from "../Index/Footer";
import "../css/mycourse.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const auth = () => {
    var header = authHeader();
    if (header == null) {
      navigate("/login");
    }
  };

  const data = useLoaderData();

  const [courses, setCourses] = useState(data.listkursus);
  useEffect(() => {
    auth();
  }, []);
  console.log(data);
  return (
    <>
      <Navbar />

      <div className="course-containerM">
        {courses.length > 0 &&
          courses.map((course, index) => (
            <div
              key={course.nama_kursus}
              className="course-cardM"
              onClick={() => {
                navigate("/mycourses/class/" + course.kursus._id);
              }}
            >
              <div className="course-card-textM">
                <h2>{course.kursus.nama_kursus}</h2>
                {/* <p>Teacher: {course.teacher}</p> */}
                <p>{course.kursus.kategori}</p>
              </div>
            </div>
          ))}

        {courses.length == 0 && <div>Anda Belum Beli Kursus Apapun</div>}
      </div>

      <Footer />
    </>
  );
};

export default MyCourses;
