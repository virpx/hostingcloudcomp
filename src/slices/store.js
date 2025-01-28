import { configureStore } from "@reduxjs/toolkit";
import resetPassword from "./resetPassword";

const store = configureStore({
  reducer: {
    resetPassword: resetPassword,
  },
});
export default store;
