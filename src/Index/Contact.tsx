import React from "react";
import Navbar from "../Navbar";
import "../css/contact.css";
import Footer from "./Footer";
const Contact = () => {
  return (
    <div>
      <Navbar />
      <div id="luarcontact">
        <h2>Get in Touch</h2>
        <p>
          If you have any questions or inquiries, feel free to reach out to us
          using the contact information below:
        </p>
        <div className="contact-info">
          <p>
            Email:
            <a href="mailto:info@innospherelearn.com">
              info@innospherelearn.com
            </a>
          </p>
          <p>Phone: +62-815-554-646</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
