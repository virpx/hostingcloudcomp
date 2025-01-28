import React, { useEffect, useState } from "react";
import axios from "axios";
import "./tempat.css";

const MyChart = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalKursus, setTotalKursus] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setloading] = useState("belum");
  const fetchData = async () => {
    try {
      const responseUsers = await axios.get("http://localhost:3000/users");
      const responseKursus = await axios.get("http://localhost:3000/kursus");

      console.log("Response Users:", responseUsers.data);
      console.log("Response Kursus:", responseKursus.data);

      if (responseUsers.data.length > 0 && responseKursus.data.length > 0) {
        const students = responseUsers.data.filter((user) => user.role === 0);
        const teachers = responseUsers.data.filter((user) => user.role === 1);

        setTotalUsers(responseUsers.data.length);
        setTotalKursus(responseKursus.data.length);
        setTotalStudents(students.length);
        setTotalTeachers(teachers.length);
        setloading("sudah");
      } else {
        console.error("Data not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    {
      data: [
        { name: "Total Users", value: 12 },
        { name: "Total Kursus", value: 13 },
      ],
    },
  ];

  return (
    <div>
      <h2>Total Users dan Total Kursus</h2>
      <div className="Tempat">
        <div className="Kotak">
          <h1 style={{ color: "black" }}>Total Kusus: {totalKursus}</h1>
        </div>
        <div className="Kotak">
          <h1 style={{ color: "black" }}>Total Students: {totalStudents}</h1>
        </div>
        <div className="Kotak">
          <h1 style={{ color: "black" }}>Total Teachers: {totalTeachers}</h1>
        </div>
      </div>
    </div>
  );
};

export default MyChart;
