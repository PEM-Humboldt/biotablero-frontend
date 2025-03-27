import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Tooltip from "@mui/material/Tooltip";
import { Grid, Container, Button } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import iconoinfo from "../../images/icono-info.svg";
import iconomas from "../../images/icono-mas.svg";
import Consultasgeograficas from "../../images/consulta-geografica-logo.svg";
import Indicadores from "../../images/indicadores-biodiversidad-icono.svg";
import Portafolio from "../../images/portafolio-icono.svg";
import Comunitario from "../../images/monitoreo-comunitario-icono.svg";
import { Link } from "react-router-dom";

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="prev-arrow" onClick={onClick}>
            <KeyboardArrowLeft fontSize="large" />
        </div>
    );
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <div className="next-arrow" onClick={onClick}>
            <KeyboardArrowRight fontSize="large" />
        </div>
    );
}

function Carrousel({ setActiveTab, setShowQueEs }) {
    const [activeModule, setActiveModule] = useState(null);
    const [showContainer, setShowContainer] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    const modules = [
        { id: 1, title: "Consultas Geográficas", image: Consultasgeograficas, link: "/Consultas" },
        { id: 2, title: "Indicadores de Biodiversidad", image: Indicadores, link: "/Indicadores" },
        { id: 3, title: "Portafolios", image: Portafolio, link: "/Portafolios" },
        { id: 4, title: "Monitoreo Comunitario", image: Comunitario, link: "/Monitoreo" },
    ];

    const [animateContainer, setAnimateContainer] = useState(false);

    const handleClick = (id) => {
        if (activeModule === id) {
            setAnimateContainer(false);
            setTimeout(() => {
                setShowContainer(false);
                setActiveModule(null);
                setActiveTab(0);
                setShowQueEs(true);
            }, 300);
        } else {
            setActiveModule(id);
            setShowContainer(true);
            setActiveTab(id);
            setShowQueEs(false);

            setTimeout(() => setAnimateContainer(true), 300);
        }
    };

    return (
        <div id="CarrouselBio" className="slider-container imagen-fondo">
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <p>EXPLORA NUESTROS MÓDULOS</p>
                </Grid>
                <Slider {...settings}>
                    {modules.map((module) => (
                        <div key={module.id} className="ModuloPrincipal" style={{ height: "auto", padding: 12 }}>
                            <div className={`moduactivo ${activeModule === module.id ? "active" : ""}`}>
                                <Tooltip title="Haz clic para explorar" arrow>
                                    <img className="Modulos" src={module.image} alt={module.title} style={{ width: "65%", height: "auto", cursor: "pointer" }} onClick={() => handleClick(module.id)} />
                                </Tooltip>

                                {showContainer && activeModule === module.id && (
                                    <Grid container spacing={2} alignItems="center" className={`contenedor ${animateContainer ? "activo" : ""}`} gap={1}>
                                        <Grid item xs={12} sm={7} md={6} lg={7} sx={{ textAlign: { xs: "center", sm: "left" } }}>
                                            <span>{module.title}</span>
                                        </Grid>
                                        <Grid className="btncricle" item xs={3} sm={2} md={2} lg={2}>
                                            <Tooltip title="Más información" arrow>
                                                <Button
                                                    onClick={() => handleClick(module.id)}
                                                    style={{
                                                        backgroundColor: "#e84a5f",
                                                        border: "2px solid #fff",
                                                        padding: "12px",
                                                    }}
                                                >
                                                    <img src={iconoinfo} alt="Información" />
                                                </Button>
                                            </Tooltip>
                                        </Grid>

                                        <Grid className="btncricle" item xs={3} sm={2} md={2} lg={2}>
                                            <Tooltip title="Ir al módulo" arrow>
                                                <Link to={module.link} style={{ textDecoration: "none" }}>
                                                    <Button>
                                                        <img src={iconomas} alt="Ir al módulo" />
                                                    </Button>
                                                </Link>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                )}
                            </div>
                        </div>
                    ))}
                </Slider>
            </Container>
        </div>
    );
}

export default Carrousel;
