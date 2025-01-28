import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import TeacherNavbar from "../TeacherNavbar";
import { TextField } from "@mui/material";
import { Textarea } from "@mui/joy";
import { useForm } from "react-hook-form";
import axios from "axios";
export default function Addtask() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const urlapi = "http://34.101.102.183:3000/teacher/"
    const dataload = useLoaderData();
    console.log(dataload)
    async function submitform(data) {
        if (dataload[0] == "add") {
            var datasend = {
                idkursus: dataload[1],
                nama: data.nama,
                deskripsi: data.deskripsi
            }
            var hasil = await axios.post(urlapi + "addtask", datasend, {
                headers: {
                    "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            if (hasil.data == "sukses") {
                alert('Success')
                navigate("../")
            } else {
                alert("Gagal");
            }
        } else {
            var datasend = {
                idtask : dataload[2],
                idkursus: dataload[1],
                nama: data.nama,
                deskripsi: data.deskripsi
            }
            var hasil = await axios.post(urlapi+"edittask",datasend,{
                headers:{
                    "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            if(hasil.data == "sukses"){
                alert('Success')
                navigate(0)
            }else{
                alert("Gagal");
            }
        }
    }
    useEffect(() => {
        document.getElementById("containerutama").style.maxHeight = document.getElementById("containerutama").offsetHeight + "px"
        document.getElementById("containerdalam").style.height = "90%";
    }, [])
    return (
        <>
            <div style={{ width: "100%", height: "100vh", background: "#5840ba", display: "flex", flexDirection: "column", paddingBottom: "20px" }}>
                <TeacherNavbar></TeacherNavbar>
                <div id="containerutama" className="container d-flex justify-content-center align-items-center" style={{ overflow: "scroll", flexGrow: "1", width: "100%", background: "white", marginTop: "20px", borderRadius: "20px", display: "flex" }}>
                    <div id="containerdalam" className="container" style={{ flexDirection: "column", width: "96%", height: "90px", background: "" }}>
                        <button className="btn btn-danger font-white" style={{ width: "100px" }} onClick={() => {
                            navigate('../')
                        }}>Back</button>
                        <form onSubmit={handleSubmit(submitform)}>
                            {dataload[0] == "add" && (<>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    sx={{ width: "100%", marginTop: "20px" }}
                                    {...register("nama")}
                                />
                                <Textarea
                                    color="neutral"
                                    disabled={false}
                                    minRows={2}
                                    placeholder="Description"
                                    size="lg"
                                    variant="outlined"
                                    sx={{ width: "100%", marginTop: "20px" }}
                                    {...register("deskripsi")}
                                />
                                <button type="submit" className="btn btn-success" style={{ width: "100%", marginTop: "20px", height: "50px" }}>Save</button>
                            </>)}
                            {dataload[0] == "edit" && (<>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    sx={{ width: "100%", marginTop: "20px" }}
                                    {...register("nama")}
                                    defaultValue={dataload[3].name}
                                />
                                <Textarea
                                    color="neutral"
                                    disabled={false}
                                    minRows={2}
                                    placeholder="Description"
                                    size="lg"
                                    variant="outlined"
                                    sx={{ width: "100%", marginTop: "20px" }}
                                    {...register("deskripsi")}
                                    defaultValue={dataload[3].desc}
                                />
                                <button type="submit" className="btn btn-success" style={{ width: "100%", marginTop: "20px", height: "50px" }}>Save</button>
                            </>)}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}