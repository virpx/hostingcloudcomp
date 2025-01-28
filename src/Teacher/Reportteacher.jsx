import { useEffect } from "react";
import TeacherNavbar from "./TeacherNavbar";
import { useLoaderData, useNavigate } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";
export default function Reportteacher() {
  const chartSetting = {
    width: 950,
    height: 400,
  };
  const dataload = useLoaderData();
  const navigate = useNavigate();
  useEffect(() => {
    document.getElementById("containerutama").style.maxHeight =
      document.getElementById("containerutama").offsetHeight + "px";
    document.getElementById("containerdalam").style.height = "90%";
  }, []);
  console.log(dataload);
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#5840ba",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "20px",
        }}
      >
        <TeacherNavbar></TeacherNavbar>
        <div
          id="containerutama"
          className="container d-flex justify-content-center align-items-center"
          style={{
            overflow: "scroll",
            flexGrow: "1",
            width: "100%",
            background: "white",
            marginTop: "20px",
            borderRadius: "20px",
            display: "flex",
          }}
        >
          <div
            id="containerdalam"
            style={{ width: "96%", height: "90px", background: "" }}
          >
            <button
              className="btn btn-danger font-white"
              style={{ width: "100px", marginLeft: "20px" }}
              onClick={() => {
                navigate("../");
              }}
            >
              Back
            </button>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "100%",
                height: "max-content",
                marginLeft: "20px",
                background: "",
                marginTop: "20px",
              }}
            >
              <div
                className="d-flex justify-content-center shadow"
                style={{
                  width: "300px",
                  height: "100px",
                  background: "white",
                  borderRadius: "12px",
                  borderLeft: "5px solid #4e73df",
                }}
              >
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Course
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-black">
                      {dataload.jumlahkursus}
                    </div>
                  </div>
                  <div style={{ width: "30px" }}></div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "gray" }}
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-currency-dollar"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-center shadow"
                style={{
                  marginLeft: "20px",
                  width: "300px",
                  height: "100px",
                  background: "white",
                  borderRadius: "12px",
                  borderLeft: "5px solid #1cc88a",
                }}
              >
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Earnings<br></br>This Month
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-black">
                      Rp {dataload.jumlahearning}
                    </div>
                  </div>
                  <div style={{ width: "30px" }}></div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "gray" }}
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-currency-dollar"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                      <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-center shadow"
                style={{
                  marginLeft: "20px",
                  width: "300px",
                  height: "100px",
                  background: "white",
                  borderRadius: "12px",
                  borderLeft: "5px solid #f6c23e",
                }}
              >
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Student
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-black">
                      {dataload.jumlahstudent}
                    </div>
                  </div>
                  <div style={{ width: "30px" }}></div>
                  <div className="col-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "gray" }}
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-currency-dollar"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                    </svg>
                  </div>
                </div>
              </div>
              s
            </div>
            <br></br>
            <div
              style={{ width: "100%", height: "max-content" }}
              className="d-flex justify-content-center align-items-center"
            >
              <BarChart
                dataset={dataload.penjualantahunini}
                yAxis={[{ scaleType: "band", dataKey: "month" }]}
                series={[{ dataKey: "jumlah", label: "Sales of the Year" }]}
                layout="horizontal"
                {...chartSetting}
              />
            </div>
            <div
              style={{ width: "100%", height: "max-content" }}
              className="d-flex justify-content-center align-items-center"
            >
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "June",
                      "July",
                      "Aug",
                      "Sept",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                  },
                ]}
                series={[
                  {
                    data: dataload.pendapatantahunini,
                    label: "This Year's Earnings",
                    color: "#4e79a7",
                  },
                ]}
                {...chartSetting}
              />
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "100%",
                height: "max-content",
                flexDirection: "column",
                paddingBottom: "20px",
              }}
            >
              <p
                className="text-left color-black text-dark"
                style={{ fontSize: "30px", marginLeft: "20px" }}
                align="center"
              >
                <b>Last 10 Transactions</b>
              </p>
              <table className="table" style={{ width: "950px" }}>
                <thead className="thead-dark">
                  <tr>
                    <th>No</th>
                    <th>Student Name</th>
                    <th>Course Name</th>
                    <th>Date</th>
                    <th>Paid Amount</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataload.listTransaksi.map((t, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{t.student_name}</td>
                        <td>{t.course_name}</td>
                        <td>{t.date}</td>
                        <td>{t.paid_amount}</td>
                        <td>{t.payment_status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
