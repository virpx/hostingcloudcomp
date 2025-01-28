import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "../css/carousel.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Scrollbar, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import authHeader from "../services/auth-header";

export default function Carousel() {
  const navigate = useNavigate();
  var header = authHeader();
  return (
    <div id="Carousel">
      <Swiper
        scrollbar={{
          hide: true,
        }}
        slidesPerView={1}
        loop={true}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={800}
        modules={[Scrollbar, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="slide-content">
            <h1>Discover Exciting Courses</h1>
            <p>
              Explore a variety of courses and enhance your knowledge with our
              interactive website.
            </p>
            {header == null && (
              <button
                className="join-button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Join Now
              </button>
            )}
          </div>
          <img
            src="https://www.qs.com/wp-content/uploads/2015/05/students-or-teenagers-with-laptop-and-tablet-computers.jpg"
            alt="Course Image"
            id="imgcarousel"
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <h1>Expand Your Horizons</h1>
            <p>
              Discover more about different subjects and broaden your skills
              through our engaging website.
            </p>
            {header == null && (
              <button
                className="join-button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Join Now
              </button>
            )}
          </div>
          <img
            src="https://www.hamline.edu/sites/default/files/styles/scale_width_1920/public/2023-07/commencement2018-127.20230712170626003.jpg?h=c7db29bb&itok=cMVL2AvZ"
            alt="Course Image"
            id="imgcarousel"
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <h1>Your Learning Journey Starts Here</h1>
            <p>
              Click the button to start your educational adventure with a
              variety of courses.
            </p>
            {header == null && (
              <button
                className="join-button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Join Now
              </button>
            )}
          </div>
          <img
            src="https://storage.googleapis.com/wp-static/wp-ucp/2022/08/UCP-Video-Cover-Homepage.jpg"
            alt="Course Image"
            id="imgcarousel"
          />
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <h1>Embrace the World of Knowledge</h1>
            <p>
              Witness the beauty of learning with our diverse courses in every
              slide.
            </p>
            {header == null && (
              <button
                className="join-button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Join Now
              </button>
            )}
          </div>
          <img
            src="https://www.hamline.edu/sites/default/files/styles/scale_width_1920/public/2023-07/fall_shoot_2021-491.jpg?h=5d170c9e&itok=e0W0Xc43"
            alt="Course Image"
            id="imgcarousel"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
