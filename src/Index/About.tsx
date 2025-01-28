import React from "react";
import Navbar from "../Navbar";
import "../css/about.css";
import Footer from "./Footer";
const About = () => {
  return (
    <div>
      <Navbar />
      <div id="luarabout">
        <p>
          InnoSphere Learn is dedicated to providing high-quality online courses
          to help you achieve your learning goals. We invite you to join us on a
          journey of knowledge and skill development.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to empower individuals by providing accessible and
          engaging online courses that foster continuous learning and skill
          enhancement. We believe in the transformative power of education to
          shape lives and careers.
        </p>

        <h2>Why Choose InnoSphere Learn?</h2>
        <p>At InnoSphere Learn, we prioritize the following:</p>
        <ul>
          <li>High-quality course content</li>
          <li>Experienced and passionate instructors</li>
          <li>Flexible learning options</li>
          <li>Supportive learning community</li>
          <li>Continuous improvement and innovation</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default About;
