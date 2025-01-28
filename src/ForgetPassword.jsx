import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setOTP } from "./slices/resetPassword";
import { useEffect, useState } from "react";
import axios from "axios";
const host = "http://localhost:3000";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [OTP, setKodeOTP] = useState("");
  const [email, setEmail] = useState("");
  const [sudahverif, setSudahVerif] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const getOTP = () => {
    dispatch(setOTP());
  };
  useEffect(() => {
    getOTP();
  }, []);

  const kodeOTP = useSelector((state) => state.resetPassword.kodeOTP);
  const handleKode = async (data) => {
    try {
      setKodeOTP(kodeOTP);
      setEmail(data.email);
      const result = await axios.post(`${host}/sendotp`, {
        email: data.email,
        otp: kodeOTP,
      });
      alert(result.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleOTP = (data) => {
    if (data.kode == OTP) {
      setSudahVerif(true);
    }
  };

  const handleReset = async (data) => {
    try {
      const result = await axios.post(`${host}/resetpassword`, {
        email: email,
        password: data.password,
        cpassword: data.cpassword,
      });
      alert(result.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className="backgroundlogin">
      <div className="login-container" style={{ width: "400px" }}>
        <h2 style={{ marginBottom: 20 }}>Account Recovery</h2>
        {!sudahverif && (
          <div>
            <form onSubmit={handleSubmit(handleKode)}>
              <div className="form-group">
                <label htmlFor="studentId">Email:</label>
                <input
                  type="email"
                  id="studentId"
                  required
                  style={{ width: "210px" }}
                  {...register("email")}
                />
                <button className="login-button" style={{ width: "110px" }}>
                  Send Code
                </button>
              </div>
            </form>
            <form onSubmit={handleSubmit(handleOTP)}>
              <div className="form-group">
                <label htmlFor="studentId">Verification Code:</label>
                <input
                  type="text"
                  id="studentId"
                  required
                  {...register("kode")}
                />
              </div>

              <Link to="/login" className="register-link float-start">
                to Login Page
              </Link>
              <button className="login-button float-end">Next</button>
            </form>
          </div>
        )}
        {sudahverif && (
          <div>
            <form onSubmit={handleSubmit(handleReset)}>
              <div className="form-group">
                <label htmlFor="password">New Password:</label>
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
              <button className="login-button" style={{ width: "110px" }}>
                Reset
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
