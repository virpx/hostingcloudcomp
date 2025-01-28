import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import React from "react";
import Carousel from "./Index/Carousel";
import Footer from "./Index/Footer";

const Index: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <Carousel />
      <Footer />
    </div>
  );
};

export default Index;
