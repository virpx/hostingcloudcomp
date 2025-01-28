import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/register.css";
import React from "react";
const Register = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const host = "http://34.101.102.183:3000";

  const handleData = async (data) => {
    if (data.email == "admin@innospeherelearn.com") {
      alert("Email already in use");
    } else {
      try {
        const result = await axios.post(`${host}/register`, {
          email: data.email,
          name: data.name,
          password: data.password,
          cpassword: data.cpassword,
          role: data.role,
        });
        alert(result.data.message);
        navigate("/login");
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div className="backgroundregister">
      <div className="register-container">
        <h2 style={{ marginBottom: 20 }}>Register</h2>
        <form onSubmit={handleSubmit(handleData)}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" required {...register("name")} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required {...register("email")} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              required
              {...register("password")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cpassword">Confirm Password:</label>
            <input
              type="password"
              id="password"
              required
              {...register("cpassword")}
            />
          </div>
          <div className="role-selector">
            <label htmlFor="role">Select Role:</label>
            <select id="role" {...register("role")}>
              <option value="1">Teacher</option>
              <option value="0">Student</option>
            </select>
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p style={{ marginTop: 20 }}>
          Already have an account?
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
