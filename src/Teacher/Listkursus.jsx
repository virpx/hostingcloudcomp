import { useEffect, useState } from "react";
import TeacherNavbar from "./TeacherNavbar";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function Listkursus() {
    const urlapi = "http://localhost:3000/teacher/"
    const navigate = useNavigate();
    const [loadingpage, setloadingpage] = useState("belum");
    const [dataload, setdataload] = useState();
    const loaddata = async () => {
        var axiosdata = await axios.get(urlapi+"courselist", {
            headers: {
                "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token
            }
        })
        setdataload(axiosdata.data);
        setloadingpage("sudah")
        settingheight();
    }
    async function matikankursus(id){
        const hasil = await axios.get(urlapi+"aktifmatikankursus/"+id,{
            headers: {
                "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
            }
        })
        if(hasil.data == "success"){
            navigate(0)
        }else{
            alert("Gagal update Kursus")
        }
    }
    async function deletekursus(id){
        const hasil = await axios.get(urlapi+"deletekursus/"+id,{
            headers: {
                "x-auth-token": (JSON.parse(localStorage.getItem("user"))).token,
            }
        })
        if(hasil.data == "success"){
            alert("Sukses menghapus kursus")
            navigate(0)
        }else{
            alert("Gagal Menghapus Kursus")
        }
    }
    function settingheight() {
        try {
            document.getElementById("containerdalam").style.height = "90%";
        } catch (e) {
            setTimeout(function () { settingheight() }, 100)
        }
    }
    useEffect(() => {
        document.getElementById("containerutama").style.maxHeight = document.getElementById("containerutama").offsetHeight + "px"
        loaddata()
    }, [])
    return (
        <>
            <div style={{ width: "100%", height: "100vh", background: "#5840ba", display: "flex", flexDirection: "column", paddingBottom: "20px" }}>
                <TeacherNavbar></TeacherNavbar>
                <div id="containerutama" className="container d-flex justify-content-center align-items-center" style={{ overflow: "scroll", flexGrow: "1", width: "100%", background: "white", marginTop: "20px", borderRadius: "20px", display: "flex" }}>
                    {loadingpage == "belum" && <div style={{ width: "100%", height: "100%" }} className="d-flex justify-content-center align-items-center"><CircularProgress /></div>}
                    {loadingpage == "sudah" && (
                        <>
                            <div id="containerdalam" style={{ width: "max-content", height: "90px", background: "" }}>
                                <button className="btn btn-danger font-white" style={{ width: "100px", marginLeft: "20px" }} onClick={() => {
                                    navigate("../")
                                }}>Back</button>
                                <p className="text-left color-black text-dark" style={{ fontSize: "30px", marginLeft: "20px" }} align='center'><b>Course List</b></p>
                                <Button variant="contained" startIcon={<AddIcon />} sx={{ width: "100%", marginLeft: "20px" }} onClick={() => {
                                    navigate("add")
                                }}>
                                    Add New Course
                                </Button>
                                <div style={{ width: "1115px", height: "max-content", background: "", display: "flex", flexWrap: "wrap" }}>
                                    {
                                        dataload.map((data) => {
                                            return (
                                                <>
                                                    <Card sx={{ maxWidth: 345, marginLeft: "20px", marginTop: "20px" }}>
                                                        <CardMedia
                                                            sx={{ height: 140 }}
                                                            image={data[1].thumb_path}
                                                        />
                                                        <CardContent>
                                                            <Typography gutterBottom variant="h5" component="div">
                                                                {data[1].nama_kursus}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {data[1].deskripsi}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button size="small" onClick={() => {
                                                                navigate("edit/" + data[1]._id.toString())
                                                            }}>Edit</Button>
                                                            <Button size="small" onClick={()=>{
                                                                if(data[0] == 0){
                                                                    matikankursus(data[1]._id.toString());
                                                                }else{
                                                                    deletekursus(data[1]._id.toString());
                                                                }
                                                            }}>{
                                                                data[0] == 0?data[1].active == 1 ?"Deactive":"Active":"Delete"
                                                            }</Button>
                                                            <Button size="small" onClick={() => {
                                                                navigate("center/" + data[1]._id.toString())
                                                            }}>Course Center</Button>
                                                        </CardActions>
                                                    </Card>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{ width: "100%", height: "50px" }}></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}