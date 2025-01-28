// OTPSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  kodeOTP: "",
};

export const OTPSlice = createSlice({
  name: "OTP",
  initialState,
  reducers: {
    setOTP: (state, action) => {
      const characters = "0123456789";
      let randomString = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }
      state.kodeOTP = randomString;
    },
  },
});

export const { setOTP } = OTPSlice.actions;

export default OTPSlice.reducer;
