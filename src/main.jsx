import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./slices/store.js";
import Home from "./Home.jsx";
import Error from "./Error";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import Index from "./Index";
import Courses from "./Student/Courses";
import MyCourses from "./Student/MyCourses.jsx";
import Faq from "./Index/Faq.tsx";
import Contact from "./Index/Contact.tsx";
import About from "./Index/About.tsx";
import DetailCourse from "./Student/DetailCourse.jsx";
import Class from "./Student/Class.jsx";
import Homeadmin from "./admin/Homeadmin.jsx";
import authHeader from "./services/auth-header";
import Indexteacher from "./Teacher/Indexteacher.jsx";
import Listkursus from "./Teacher/Listkursus.jsx";
import AddCourse from "./Teacher/Addcourse.jsx";
import Forumteacher from "./Teacher/Forumteacher.jsx";
import Detailforumteacher from "./Teacher/Detailforumteacher.jsx";
import Reportteacher from "./Teacher/Reportteacher.jsx";
import Editcourse from "./Teacher/Editcourse.jsx";
import Coursecenter from "./Teacher/Coursecenter.jsx";
import Addmateri from "./Teacher/center/Addmateri.jsx";
import Addtask from "./Teacher/center/Addtask.jsx";
import Addquiz from "./Teacher/center/Addquiz.jsx";
import Viewtaskupload from "./Teacher/center/Viewtaskupload.jsx";
import UserProfile from "./Student/UserProfile.jsx";
import ListsUser from "./admin/Userss.jsx";
import Transs from "./admin/Transs.jsx";
import ForgotPassword from "./ForgetPassword.jsx";

const host = "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/courses",
        element: <Courses />,
        loader: async () => {
          var header = authHeader();
          if (header !== null) {
            const result = await axios.get(`${host}/kursus`);
            const result2 = await axios.get(`${host}/listKursus`, {
              headers: {
                "x-auth-token": authHeader()["x-access-token"],
              },
            });
            return {
              kursus: result.data,
              listkursus: result2.data.listkursus,
            };
          } else {
            const result = await axios.get(`${host}/kursus`);
            const result2 = await axios.get(`${host}/kursus`);
            return {
              kursus: result.data,
              listkursus: result2.data.kursus,
            };
          }
        },
      },
      {
        path: "/course/detail/:id",
        element: <DetailCourse />,
        loader: async ({ params }) => {
          const result = await axios.get(`${host}/kursus/${params.id}`);
          return { kursus: result.data.kursus, teacher: result.data.teacher };
        },
      },
      {
        path: "/mycourses/:_id",
        element: <MyCourses />,
        loader: async ({ params }) => {
          const result = await axios.get(`${host}/listKursus`, {
            headers: {
              "x-auth-token": authHeader()["x-access-token"],
            },
          });
          return { listkursus: result.data.listkursus };
        },
      },
      {
        path: "/mycourses/class/:id",
        element: <Class />,
        loader: async ({ params }) => {
          const result = await axios.get(`${host}/kursus/${params.id}`, {
            headers: {
              "x-auth-token": authHeader()["x-access-token"],
            },
          });
          return { kursus: result.data.kursus };
        },
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/aboutus",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin",
        children: [
          {
            index: true,
            element: <Homeadmin></Homeadmin>,
          },
          {
            path: "ListUser",
            element: <ListsUser></ListsUser>,
          },
          {
            path: "ListTrans",
            element: <Transs></Transs>,
          },
        ],
      },
      {
        path: "teacher",
        children: [
          {
            index: true,
            element: <Indexteacher></Indexteacher>,
          },
          {
            path: "course",
            children: [
              {
                index: true,
                element: <Listkursus></Listkursus>,
              },
              {
                path: "add",
                element: <AddCourse></AddCourse>,
              },
              {
                path: "edit/:id",
                loader: async (data) => {
                  var axiosget = await axios.get(
                    "http://localhost:3000/teacher/getcoursedetail/" +
                      data.params.id,
                    {
                      headers: {
                        "x-auth-token": JSON.parse(localStorage.getItem("user"))
                          .token,
                      },
                    }
                  );
                  return axiosget.data;
                },
                element: <Editcourse></Editcourse>,
              },
              {
                path: "center/:id",
                children: [
                  {
                    index: true,
                    loader: async (data) => {
                      var axiosget = await axios.get(
                        "http://localhost:3000/teacher/getcenter/" +
                          data.params.id,
                        {
                          headers: {
                            "x-auth-token": JSON.parse(
                              localStorage.getItem("user")
                            ).token,
                          },
                        }
                      );
                      return axiosget.data;
                    },
                    element: <Coursecenter></Coursecenter>,
                  },
                  {
                    path: "addtopic",
                    loader: (data) => {
                      console.log(data.params);
                      return ["add", data.params.id];
                    },
                    element: <Addmateri></Addmateri>,
                  },
                  {
                    path: "addtask",
                    loader: (data) => {
                      return ["add", data.params.id];
                    },
                    element: <Addtask></Addtask>,
                  },
                  {
                    path: "addquiz",
                    loader: (data) => {
                      return ["add", data.params.id];
                    },
                    element: <Addquiz></Addquiz>,
                  },
                  {
                    path: "editquiz/:idquiz",
                    loader: async (data) => {
                      var hasil = await axios.get(
                        "http://localhost:3000/teacher/getquizdetail/" +
                          data.params.id +
                          "/" +
                          data.params.idquiz,
                        {
                          headers: {
                            "x-auth-token": JSON.parse(
                              localStorage.getItem("user")
                            ).token,
                          },
                        }
                      );
                      return [
                        "edit",
                        data.params.id,
                        data.params.idquiz,
                        hasil.data,
                      ];
                    },
                    element: <Addquiz></Addquiz>,
                  },
                  {
                    path: "task/:idtaske",
                    loader: async (data) => {
                      var hasil = await axios.get(
                        "http://localhost:3000/teacher/taskkumpul/" +
                          data.params.idtaske,
                        {
                          headers: {
                            "x-auth-token": JSON.parse(
                              localStorage.getItem("user")
                            ).token,
                          },
                        }
                      );
                      return hasil.data;
                    },
                    element: <Viewtaskupload></Viewtaskupload>,
                  },
                  {
                    path: "edittopic/:idtopic",
                    loader: async (data) => {
                      var hasil = await axios.get(
                        "http://localhost:3000/teacher/gettopicdetail/" +
                          data.params.id +
                          "/" +
                          data.params.idtopic,
                        {
                          headers: {
                            "x-auth-token": JSON.parse(
                              localStorage.getItem("user")
                            ).token,
                          },
                        }
                      );
                      return [
                        "edit",
                        data.params.id,
                        data.params.idtopic,
                        hasil.data,
                      ];
                    },
                    element: <Addmateri></Addmateri>,
                  },
                  {
                    path: "edittask/:idtask",
                    loader: async (data) => {
                      var hasil = await axios.get(
                        "http://localhost:3000/teacher/gettaskdetail/" +
                          data.params.id +
                          "/" +
                          data.params.idtask,
                        {
                          headers: {
                            "x-auth-token": JSON.parse(
                              localStorage.getItem("user")
                            ).token,
                          },
                        }
                      );
                      return [
                        "edit",
                        data.params.id,
                        data.params.idtask,
                        hasil.data,
                      ];
                    },
                    element: <Addtask></Addtask>,
                  },
                ],
              },
            ],
          },
          {
            path: "report",
            loader: async () => {
              var hasil = await axios.get(
                "http://localhost:3000/teacher/reportdata",
                {
                  headers: {
                    "x-auth-token": JSON.parse(localStorage.getItem("user"))
                      .token,
                  },
                }
              );
              return hasil.data;
            },
            element: <Reportteacher></Reportteacher>,
          },
          {
            path: "forum",
            children: [
              {
                index: true,
                loader: async () => {
                  var hasil = await axios.get(
                    "http://localhost:3000/teacher/getchannel",
                    {
                      headers: {
                        "x-auth-token": JSON.parse(localStorage.getItem("user"))
                          .token,
                      },
                    }
                  );
                  return hasil.data;
                },
                element: <Forumteacher></Forumteacher>,
              },
              {
                path: ":idforum",
                loader: async (data) => {
                  var hasil = await axios.get(
                    "http://localhost:3000/teacher/getforumdetail/" +
                      data.params.idforum,
                    {
                      headers: {
                        "x-auth-token": JSON.parse(localStorage.getItem("user"))
                          .token,
                      },
                    }
                  );
                  var namaarr = [];
                  for (const iterator of hasil.data.lanswer) {
                    const namauser = await axios.get(
                      "http://localhost:3000/teacher/getnamauser/" +
                        iterator.iduser
                    );
                    namaarr.push(namauser.data);
                  }
                  console.log(namaarr);
                  return [data.params.idforum, hasil.data, namaarr];
                },
                element: <Detailforumteacher></Detailforumteacher>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
