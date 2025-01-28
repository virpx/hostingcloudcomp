import React from "react";
import "../css/footer.css";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <footer>
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>
              InnospehereLearn is dedicated to providing high-quality online
              courses to help you achieve your learning goals. Join us on a
              journey of knowledge and skill development.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <div
                  className="quick"
                  onClick={() => {
                    navigate("/courses");
                  }}
                >
                  Courses
                </div>
              </li>
              <li>
                <div
                  className="quick"
                  onClick={() => {
                    navigate("/aboutus");
                  }}
                >
                  About Us
                </div>
              </li>
              <li>
                <div
                  className="quick"
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  Contact
                </div>
              </li>
              <li>
                <div
                  className="quick"
                  onClick={() => {
                    navigate("/faq");
                  }}
                >
                  FAQ
                </div>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <a href="mailto:info@innospeherelearn.com">
              <EmailIcon /> info@innospeherelearn.com
            </a>
            <p>
              <LocalPhoneIcon /> +62-815-554-646
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2023 InnospehereLearn. All rights reserved. | Privacy Policy |
            Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
