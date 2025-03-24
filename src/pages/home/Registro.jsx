import React, { useState } from "react";
import { Tabs, Tab, TextField, Button, Box, Paper } from "@mui/material";
import fotoSesion from "../../images/foto-sesion.jpg";
import fotoRegistro from "../../images/foto-registro.jpg";

function FormularioRegistro() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const imagenes = [fotoSesion, fotoRegistro];

    return (
        <Paper className="Modalregistro" elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Tabs value={tabIndex} onChange={handleChange} sx={{ width: "100%" }}>
                <Tab
                    label="Iniciar Sesión"
                    sx={{
                        flexGrow: 1,
                        width: "50%",
                        backgroundColor: tabIndex === 0 ? "#fff" : "var(--grisocuro)",
                        color: tabIndex === 0 ? "#fff" : "#fff",
                        "&.Mui-selected": { backgroundColor: "var(--negro)", color: "#ddd" },
                    }}
                />
                <Tab
                    label="Registrarse"
                    sx={{
                        flexGrow: 1,
                        width: "50%",
                        backgroundColor: tabIndex === 1 ? "#fff" : "var(--grisocuro)",
                        color: tabIndex === 1 ? "#fff" : "#fff",
                        "&.Mui-selected": { backgroundColor: "var(--negro)", color: "#ddd" },
                    }}
                />
            </Tabs>

            <img src={imagenes[tabIndex]} alt={tabIndex === 0 ? "Login" : "Registro"} style={{ width: "100%" }} />

            {tabIndex === 0 ? (
                <Box className="Inciosesion" component="form" sx={{ px: 2, pb: 5 }}>
                    <TextField fullWidth label="Correo Electrónico" margin="normal" />
                    <TextField fullWidth label="Contraseña" type="password" margin="normal" />
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                        Iniciar Sesión
                    </Button>
                </Box>
            ) : (
                <Box className="Registro" component="form" sx={{ px: 2, pb: 5 }}>
                    <TextField fullWidth label="Nombre" margin="normal" />
                    <TextField fullWidth label="Correo Electrónico" margin="normal" />
                    <TextField fullWidth label="Contraseña" type="password" margin="normal" />
                    <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                        Registrarse
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

export default FormularioRegistro;
