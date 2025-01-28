import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/loginstudent.css";
import React from "react";
import authHeader from "./services/auth-header";

const host = "http://34.101.102.183:3000";
const Login = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const handleData = async (data) => {
    if (data.email == "admin@innospeherelearn.com") {
      if (data.password == "proyekfpw") {
        navigate("/admin");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            token:
              "$2a$12$1CjlWcncg0dY58qcmwLqD.pKkz7oalJM97AbY6nDB.PWsXgGOewTG",
            _id: "ADMIN",
            message: "You have successfully logged in to your account.",
          })
        );
      } else {
        alert("You Are Not an Admin!");
      }
    } else {
      try {
        const result = await axios
          .post(`${host}/login`, {
            email: data.email,
            password: data.password,
          })
          .then((response) => {
            if (response.data.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
              localStorage.setItem("storedTime", Date.now().toString());
            }

            return response.data;
          });
        alert(result.message);

        if (
          result.message == "You have successfully logged in to your account."
        ) {
          try {
            const result = await axios.get(`${host}/activeUser`, {
              headers: {
                "x-auth-token": authHeader()["x-access-token"],
              },
            });

            if (result.data.user[0].role == 0) {
              navigate("/mycourses/" + result.data.user[0]._id);
            } else if (result.data.user[0].role == 1) {
              navigate("/teacher");
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="backgroundlogin">
      <div className="login-container">
        <h2 style={{ marginBottom: 20 }}>Login</h2>
        <form onSubmit={handleSubmit(handleData)}>
          <div className="form-group">
            <label htmlFor="studentId">Email:</label>
            <input
              type="email"
              id="studentId"
              required
              {...register("email")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              required
              {...register("password")}
            />
            <Link
              to="/forgotpassword"
              className="register-link"
              style={{ marginLeft: "157px" }}
            >
              Forgot password?
            </Link>
          </div>
          <button className="login-button">Login</button>
        </form>
        <p style={{ marginTop: 20 }}>
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
