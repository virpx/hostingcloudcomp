import { useEffect } from "react";
import TeacherNavbar from "./TeacherNavbar";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function Forumteacher() {
    const navigate = useNavigate();
    const dataload = useLoaderData()
    console.log(dataload)
    useEffect(() => {
        document.getElementById("containerutama").style.maxHeight = document.getElementById("containerutama").offsetHeight + "px"
        document.getElementById("containerdalam").style.height = "90%";
    }, [])
    return (
        <>
            <div style={{ width: "100%", height: "100vh", background: "#5840ba", display: "flex", flexDirection: "column", paddingBottom: "20px" }}>
                <TeacherNavbar></TeacherNavbar>
                <div id="containerutama" className="container d-flex justify-content-center align-items-center" style={{ overflow: "scroll", flexGrow: "1", width: "100%", background: "white", marginTop: "20px", borderRadius: "20px", display: "flex" }}>
                    <div id="containerdalam" style={{ width: "96%", height: "90px", background: "" }}>
                        <button className="btn btn-danger font-white" style={{ width: "100px", marginLeft: "20px" }} onClick={() => {
                            navigate("../")
                        }}>Back</button>
                        <p className="text-left color-black text-dark" style={{ fontSize: "30px", marginLeft: "20px" }} align='center'><b>Select Channel</b></p>
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Course Name</th>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataload.map((data, counter) => {
                                        return (
                                            <tr>
                                                <td>{counter + 1}</td>
                                                <td>{data[0]}</td>
                                                <td>{data[1].question}</td>
                                                <td>{
                                                    data[2] == null ? "-":data[2]
                                                }</td>
                                                <td className="link-primary link-opacity-100" onClick={() => {
                                                    navigate(data[1]._id)
                                                }}>
                                                    <a style={{ cursor: "pointer" }}>Open</a>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
                                                    </svg>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}