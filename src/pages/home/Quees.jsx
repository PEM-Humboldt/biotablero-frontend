import React from "react";
import { Container, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Quees from "../../images/biotablero-icono.svg";
import aquinvaDirgido from "../../images/a-quien-va-dirigido.svg";
import quienLohace from "../../images/quien-lo-hace.svg";
import nuestroObjetivo from "../../images/cual-es-nuestro-objetivo.svg";

const QueEs = () => {
    return (
        <div className="Contenedorquees">
            <Container
                maxWidth="lg"
                sx={{
                    padding: {
                        xs: 0,
                        sm: 2,
                        md: 0,
                        lg: 0,
                    },
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6} lg={6} className="scale-up-center">
                        <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box className="icon-container">
                                        <Grid className="Icono">
                                            {" "}
                                            <img src={Quees} alt="¿Qué es BioTablero?" className="icon-img" />
                                        </Grid>
                                    </Box>
                                    <Typography variant="h6" component="h2" fontWeight="bold">
                                        ¿Qué es BioTablero?
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    BioTablero reúne herramientas web para consultar cifras e indicadores y facilitar la toma de decisiones sobre biodiversidad, llevando a autoridades ambientales y empresas privadas síntesis de la
                                    información existente, actualizada y confiable en un contexto regional y nacional.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} className="scale-up-center">
                        <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Grid className="Icono">
                                        {" "}
                                        <img src={aquinvaDirgido} alt=" ¿A quién va dirigido?" />
                                    </Grid>
                                    <Typography variant="h6" component="h2" fontWeight="bold">
                                        ¿A quién va dirigido?
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    Usuarios que requieren información actualizada, oportuna y confiable sobre el estado de la biodiversidad, con el fin de utilizarla en la toma de decisiones estratégicas para la gestión ambiental y el
                                    diseño de políticas eficaces que favorezcan su conservación.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className="scale-up-center">
                        <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Grid className="Icono">
                                        {" "}
                                        <img src={quienLohace} alt="¿Quién lo hace?" />
                                    </Grid>
                                    <Typography variant="h6" component="h2" fontWeight="bold">
                                        ¿Quién lo hace?
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    Socios académicos nacionales e internacionales, junto a gestores públicos y privados, guían la interpretación y uso de información para el manejo de la biodiversidad en Colombia. Investigadores procesan y
                                    entregan visualizaciones gráficas de cifras y patrones clave.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6} className="scale-up-center">
                        <Card sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Grid className="Icono">
                                        {" "}
                                        <img src={nuestroObjetivo} alt="¿Cuál es nuestro objetivo?" />
                                    </Grid>
                                    <Typography variant="h6" component="h2" fontWeight="bold">
                                        ¿Cuál es nuestro objetivo?
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    Integrar información detallada y actualizada sobre la biodiversidad colombiana, con el fin de facilitar la toma de decisiones en conservación, planificación y manejo ambiental a todos los niveles de
                                    organización, promoviendo políticas más efectivas.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default QueEs;
