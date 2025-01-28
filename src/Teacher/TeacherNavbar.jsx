import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import authHeader from "../services/auth-header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
export default function TeacherNavbar() {
  const navigate = useNavigate();
  const auth = async () => {
    var header = authHeader();
    if (header != null) {
      const storedTime = localStorage.getItem("storedTime");
      const expirationTimeInSeconds = 3600;
      if (
        storedTime &&
        (Date.now() - parseInt(storedTime)) / 1000 < expirationTimeInSeconds
      ) {
        if (
          (
            await axios.get("http://localhost:3000/teacher/ceklogin", {
              headers: {
                "x-auth-token": header["x-access-token"],
              },
            })
          ).data == "invalid"
        ) {
          navigate("../");
        }
      } else {
        alert("Session has expired or does not exist. Please Login again.");
        localStorage.clear();
        navigate("../");
      }
    } else {
      navigate("../");
    }
  };

  useEffect(() => {
    auth();
  }, []);
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#1A2138" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: "50px",
            }}
          >
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: "auto",
                ml: "auto",
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/teacher");
              }}
            >
              <div style={{ color: "#F57C00" }}>INNOSPHERE</div>LEARN
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
