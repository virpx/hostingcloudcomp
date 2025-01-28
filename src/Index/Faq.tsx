import Footer from "./Footer";
import Navbar from "../Navbar";
import "../css/faq.css";
import React from "react";

const Faq = () => {
  return (
    <div>
      <Navbar />
      <div id="luarfaq">
        <h2>Frequently Asked Questions</h2>

        <ul>
          <li>
            <h3>Q: How do I enroll in a course?</h3>
            <p>
              A: To enroll in a course, simply visit our website, browse the
              available courses, and click on the "Enroll" button for the
              desired course. Follow the on-screen instructions to complete the
              enrollment process.
            </p>
          </li>
          <li>
            <h3>Q: Can I access course materials on mobile devices?</h3>
            <p>
              A: Yes, our platform is mobile-friendly. You can access course
              materials, lectures, and assignments on your mobile device by
              logging in to your account through the web browser.
            </p>
          </li>
          <li>
            <h3>Q: What is the duration of a course?</h3>
            <p>
              A: The duration of each course varies. You can find the specific
              duration details on the course page. Some courses are self-paced,
              allowing you to complete them at your own convenience, while
              others may have fixed schedules.
            </p>
          </li>
          <li>
            <h3>Q: How do I reset my password?</h3>
            <p>
              A: To reset your password, click on the "Forgot Password" link on
              the login page. Follow the instructions sent to your registered
              email to set up a new password for your account.
            </p>
          </li>
          <li>
            <h3>Q: Are there any prerequisites for the courses?</h3>
            <p>
              A: Prerequisites vary for each course and are listed on the course
              details page. Make sure to review the prerequisites before
              enrolling to ensure you have the necessary background for the
              course.
            </p>
          </li>
          <li>
            <h3>Q: How can I contact support for technical issues?</h3>
            <p>
              A: If you encounter any technical issues, please contact our
              support team at support@example.com. Provide a detailed
              description of the issue, and our team will assist you as soon as
              possible.
            </p>
          </li>
          <li>
            <h3>Q: Is financial aid available for courses?</h3>
            <p>
              A: We offer financial aid for eligible individuals. To apply for
              financial aid, visit the course page and click on the "Financial
              Aid" or "Scholarship" section for more information and application
              instructions.
            </p>
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
