import { useEffect } from "react";
import TeacherNavbar from "./TeacherNavbar";
import { TextField } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Editcourse() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    async function editkursus(data) {
        if (data.thumbimg.length != 0) {
            const formdata = new FormData();
            formdata.append("nama_kursus", data.nama_kursus);
            formdata.append("harga", data.harga);
            formdata.append("kategori", data.kategori);
            formdata.append("deskripsi", data.deskripsi);
            formdata.append("id",loaderdata._id.toString())
            formdata.append("thumbimg", data.thumbimg[0]);
            var hasil = await axios.post("http://localhost:3000/teacher/updatekursuswithimage",formdata,{
                headers: {
                    "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
                }
            })
            if(hasil.data == "success"){
                alert("Update Success")
                navigate("../")
            }
        } else {
            var datapost = {
                nama_kursus:data.nama_kursus,
                harga:data.harga,
                kategori:data.kategori,
                deskripsi:data.deskripsi,
                id:loaderdata._id.toString()
            }
            var hasil = await axios.post("http://localhost:3000/teacher/updatekursusnoimage",datapost,{
                headers: {
                    "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            if(hasil.data == "success"){
                alert("Update Success")
                navigate("../")
            }
        }
    }
    const loaderdata = useLoaderData();
    const buttonStyle = {
        width: '200px',
        height: '200px',
        padding: '10px 16px',
        borderRadius: '50%',
        fontSize: '12px',
        textAlign: 'center',
    };
    const lkategori = ["Keterampilan Bisnis", "Keterampilan Teknis", "Keterampilan Soft Skill", "Kepemimpinan dan Manajemen", "Bahasa dan Komunikasi", "Pengembangan Web", "Data Science", "Keamanan Cyber", "Desain Grafis", "Komputasi Awan", "Seni Rupa", "Musik dan Audio", "Penulisan Kreatif", "Film dan Video", "Desain dan Fashion", "Kebugaran Jasmani", "Nutrisi dan Diet", "Kesehatan Mental", "Perawatan Diri", "Belajar Bahasa Asing", "Investasi dan Keuangan Pribadi", "Masakan dan Kuliner", "Musik dan Alat Musik", "Olahraga dan Aktivitas Fisik", "Kewirausahaan", "Pertanian dan Perkebunan", "Lingkungan dan Keberlanjutan", "DIY dan Kerajinan Tangan"]
    useEffect(() => {
        document.getElementById("containerutama").style.maxHeight = document.getElementById("containerutama").offsetHeight + "px"
        document.getElementById("containerdalam").style.height = "90%";
    }, [])
    return (
        <>
            <div style={{ width: "100%", height: "100vh", background: "#5840ba", display: "flex", flexDirection: "column", paddingBottom: "20px" }}>
                <TeacherNavbar></TeacherNavbar>
                <div id="containerutama" className="container d-flex justify-content-center align-items-center" style={{ overflow: "scroll", flexGrow: "1", width: "100%", background: "white", marginTop: "20px", borderRadius: "20px", display: "flex" }}>
                    <div id="containerdalam" className="container d-flex justify-content-center align-items-left" style={{ flexDirection: "column", width: "96%", height: "90px", background: "" }}>
                        <button className="btn btn-danger font-white" style={{ width: "100px" }} onClick={() => {
                            navigate('../')
                        }}>Back</button>
                        <p className="text-left color-black text-dark" style={{ fontSize: "30px", marginLeft: "20px" }} align="center"><b>Edit Course</b></p>
                        <form onSubmit={handleSubmit(editkursus)}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Name"
                                sx={{ width: "100%", marginTop: "20px" }}
                                {...register("nama_kursus")}
                                defaultValue={loaderdata.nama_kursus}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Price"
                                type="number"
                                sx={{ width: "100%", marginTop: "20px" }}
                                {...register("harga")}
                                defaultValue={loaderdata.harga}
                            />
                            <select class="form-select" aria-label="Default select example" style={{ marginTop: "20px" }} {...register("kategori")}>
                                {
                                    lkategori.map((data) => {
                                        return (
                                            <option value={data} selected={data == loaderdata.kategori ? "true" : "false"}>{data}</option>
                                        )
                                    })
                                }
                            </select>
                            <p style={{ fontSize: "20px", marginTop: "15px", color: "black" }}>Thumbnail</p>
                            <input type="file" className="form-control" style={{ display: "inline", width: "100%", marginTop: "-10px" }} {...register("thumbimg")}></input>
                            <Textarea
                                required
                                color="neutral"
                                minRows={2}
                                placeholder="Description"
                                size="lg"
                                variant="outlined"
                                sx={{ width: "100%", marginTop: "20px" }}
                                {...register("deskripsi")}
                                defaultValue={loaderdata.deskripsi}
                            />
                            <button type="submit" className="btn btn-success" style={{ width: "100%", marginTop: "20px", height: "50px" }}>Save Course</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}