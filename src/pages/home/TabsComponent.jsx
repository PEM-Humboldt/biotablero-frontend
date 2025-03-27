import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Container } from "@mui/material";
import QueEs from "./Quees";
import Cenefa from "./Cenefa";

const categories = [
    {
        title: "CIFRAS E INDICADORES SOBRE BIODIVERSIDAD",
        content: <QueEs />,
    },
    {
        title: "Consultas Geográficas",
        subcategories: [
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>1</b> ¿Qué es?
                    </Typography>
                ),
                content:
                    "<p>Las consultas geográficas permiten <strong>visualizar información existente para unos límites geográficos predeterminados</strong>.Técnicamente, es una sobreposición de información geográfica, en donde dada una entrada definida por el usuario, por ejemplo un departamento, una cuenca hidrográfica o una jurisdicción ambiental, se presenta una síntesis de cifras e indicadores para las siguientes temáticas: <strong>ecología del paisaje, especies y ecosistemas</strong>.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>2</b> ¿Por qué?
                    </Typography>
                ),

                content:
                    "<p>En Colombia se ha avanzado en la generación de información geográfica sobre temáticas ambientales, económicas y sociales, y en el desarrollo de mecanismos y plataformas para compartirla. El acceso abierto a datos geográficos es una tendencia global. Quien busca información geográfica sobre biodiversidad y ecosistemas puede encontrarla en varias fuentes, en portales nacionales como el SiB Colombia, el SIAC, y en los diferentes portales de datos de los institutos de Investigación o en portales globales como Biodiversity Dashboard o Global Forest Watch, entre otros. El módulo de consultas geográficas en BioTablero es necesario porque <strong>permite al usuario tener una lectura rápida de la información más relevante</strong> para su área de interés bajo tres temáticas de biodiversidad: paisajes, especies y ecosistemas, simplificando la búsqueda y selección de información pertinente.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>3</b> ¿Quién produce?
                    </Typography>
                ),
                content:
                    "<p>La información que se dispone en BioTablero es generada por múltiples fuentes nacionales e internacionales que disponen sus datos de manera abierta. Sin embargo no toda la información existente está disponible en el BioTablero. Investigadores del Instituto Humboldt seleccionan la <strong>información de mayor pertinencia para el entendimiento general del estado de la biodiversidad</strong> y en conjunto con el grupo de trabajo de BioTablero se procesa para entregar al usuario una visualización gráfica que representa las cifras y patrones más relevantes en su área de interés.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>4</b> ¿Qué encuentras?
                    </Typography>
                ),
                content: `<p>En las consultas geográficas encuentras <strong>mapas</strong>, <strong>cifras</strong> y <strong>gráficas</strong> que dan cuenta del estado de la biodiversidad en un área geográfica particular bajo tres temáticas:</p>
                <ol>
                <lI><strong>Ecosistemas</strong>: Cambio de cobertura en ecosistemas estratégicos, representatividad de ecosistemas en áreas protegidas.</li>
                <lI><strong>Paisaje</strong>: Acá encuentras información relacionada con ecosistemas equivalentes y factores de compensación, métricas de fragmentación y conectividad.</li>
                <lI><strong>Especies</strong>: Acá encuentras cifras sobre número de especies (inferidas y observadas) y vacíos de información para todas las especies, especies amenazadas, endémicas e invasoras.</li>
                     </ol>`,
            },
        ],
    },
    {
        title: "Indicadores de Biodiversidad",
        subcategories: [
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>1</b> ¿Qué es?
                    </Typography>
                ),
                content:
                    "<p>Los indicadores de biodiversidad son <strong>medidas</strong> que nos hablan sobre <strong>aspectos particulares de la biodiversidad,</strong> algunos la cuantifican, otros se refieren a su condición, otros dimensionan las presiones que la afectan. Una característica importante de los indicadores es <strong>que se encuentren relacionados con un contexto particular</strong> en el que puedan ser utilizados para apoyar la toma de decisiones ambientales. Por ejemplo, la cifra sobre riqueza de especies (número de especies presentes en un lugar y tiempo determinado) no es un indicador si no se encuentra asociado con una <strong>“historia” y un objetivo particular,</strong> es así como la riqueza de especies se convierte en un indicador cuando nuestro objetivo es, por ejemplo, representar en las Áreas Protegidas al menos el 80% de las especies conocidas presentes en Colombia y utilizamos la riqueza como una medida que se repite a través del tiempo para cuantificar el avance hacia el objetivo planteado.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>2</b> ¿Por qué?
                    </Typography>
                ),
                content:
                    "<p>Los indicadores son una herramienta que <strong>provee información robusta</strong> sobre el estado actual de la biodiversidad y sus tendencias. Al ser información medible, cuantificable y periódica los indicadores <strong>permiten evaluar cómo está nuestra biodiversidad y cómo se ve o verá afectada</strong> bajo diferentes escenarios de manejo o gestión. Los indicadores proveen evidencia científica y contextualizada para entender los cambios en la biodiversidad y sus posibles consecuencias para el bienestar humano, <strong>convirtiéndose en herramientas poderosas para tomar decisiones ambientales informadas.</strong></p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>3</b> ¿Quién produce?
                    </Typography>
                ),
                content:
                    "<p>Los principales productores de este tipo de información son la <strong>comunidad científica</strong> vinculada tanto a Institutos de Investigación como a Instituciones Académicas. Una <strong>batería mínima de Indicadores de Biodiversidad</strong> a nivel nacional es acordada por el SINA bajo el liderazgo del Ministerio de Medio Ambiente y Desarrollo Sostenible, y otros indicadores de biodiversidad se encuentran en el <strong>Plan Estadístico Nacional</strong> liderado por el DANE. </p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>4</b> ¿Qué encuentras?
                    </Typography>
                ),
                content: `<p>Este sitio contiene gráficos de <strong>resumen de la información recolectada por las asociaciones</strong> para las siete metodologías propuestas en el libro <a class="linkText" target="_blank" rel="noreferrer" href="http://repository.humboldt.org.co/handle/20.500.11761/35586">Monitoreo comunitario de la biodiversidad en Montes de María</a>. Los datos son subidos a la web por los monitores encargados por medio de <a class="linkText" target="_blank" rel="noreferrer" href="https://www.kobotoolbox.org/">KoBoToolbox</a> a partir de los formatos diligenciados en físico. Además, se puede encontrar un <strong>indicador del estado del monitoreo</strong> según los compromisos anuales, la metodología y la asociación.</p>`,
            },
        ],
    },
    {
        title: "Portafolios",
        subcategories: [
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>1</b> ¿Qué es?
                    </Typography>
                ),
                content:
                    "<p>Los portafolios son un conjunto de <strong>áreas priorizadas</strong> para la conservación que se generan a partir de un método sistemático en el que se buscan soluciones costo efectivas para la conservación y gestión de la biodiversidad, seleccionando áreas donde se <strong>maximiza la conservación a un mínimo costo.</strong><br><br> Las estrategias de conservación para las cuales se desarrollan portafolios incluyen <strong>preservación, restauración y uso sostenible de la biodiversidad</strong>.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>2</b> ¿Por qué?
                    </Typography>
                ),
                content:
                    "<p>Los portafolios guían la gestión de la biodiversidad, indicando las áreas de mayor valor para la conservación con las <strong>soluciones más costo efectivas sobre qué y dónde conservar.</strong><br>La implementación de todo un portafolio en corto tiempo es poco probable, ya que nuevos contextos surgen y la información disponible para establecer prioridades de conservación se <strong>actualiza constantemente</strong>, lo que demanda un <strong>proceso de generación de portafolios dinámico y cíclico en el tiempo.</strong></p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>3</b> ¿Quién produce?
                    </Typography>
                ),
                content:
                    "<p>Los portafolios de conservación han sido desarrollados con base en <strong>objetivos planteados en acuerdos multilaterales, políticas nacionales y regionales.</strong> Los investigadores del Instituto Humboldt en alianza con diversas instituciones nacionales e internacionales, han utilizado distintas representaciones de la biodiversidad, así como diversos condicionantes para su conservación con el fin de priorizar estas áreas.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>4</b> ¿Qué encuentras?
                    </Typography>
                ),
                content:
                    "<p>En este módulo encuentras los <strong>diferentes portafolios a escala nacional</strong> generados desde el Instituto Humboldt. Cada portafolio se basa en distintos objetivos y características de conservación que responden a <strong>contextos de análisis particulares,</strong> por esto no hay un solo portafolio posible, pues la <strong>selección de las áreas depende de los objetivos de conservación</strong>.</p>",
            },
        ],
    },
    {
        title: "Monitoreo Comunitario",
        subcategories: [
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>1</b> ¿Qué es?
                    </Typography>
                ),
                content:
                    "<p>Esta herramienta surge como una iniciativa para compartir los resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB) en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro “Monitoreo comunitario de la biodiversidad en Montes de María”</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>2</b> ¿Por qué?
                    </Typography>
                ),
                content:
                    "<p>Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el <strong>análisis de los datos,</strong> se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de <strong>gráficos que sintetizan</strong> lo que van obteniendo con el tiempo. </p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>3</b> ¿Quién produce?
                    </Typography>
                ),
                content:
                    "<p>Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. <strong>La Asociación de Mujeres Unidas de San Isidro (AMUSI)</strong> compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. <strong>La Asociación Integral de Campesinos de Cañito (ASICAC)</strong>, conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. <strong>La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR)</strong>, compuesta por 25 asociados.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>4</b> ¿Qué encuentras?
                    </Typography>
                ),
                content:
                    '<p>Este sitio contiene gráficos de <strong>resumen de la información recolectada por las asociaciones</strong> para las siete metodologías propuestas en el libro "<a class="linkText" target="_blank" rel="noreferrer" href="http://repository.humboldt.org.co/handle/20.500.11761/35586">Monitoreo comunitario de la biodiversidad en Montes de María</a>". Los datos son subidos a la web por los monitores encargados por medio de <a class="linkText" target="_blank" rel="noreferrer" href="https://www.kobotoolbox.org/">KoBoToolbox</a> a partir de los formatos diligenciados en físico. Además, se puede encontrar un <strong>indicador del estado del monitoreo</strong> según los compromisos anuales, la metodología y la asociación.</p>',
            },
        ],
    },
    {
        title: "Compensaciones Ambientales",
        subcategories: [
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>1</b> ¿Qué es?
                    </Typography>
                ),
                content:
                    "</p>Esta herramienta surge como una iniciativa para compartir los resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB) en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro “Monitoreo comunitario de la biodiversidad en Montes de María”</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>2</b> ¿Por qué?
                    </Typography>
                ),
                content:
                    "<p>Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el análisis de los datos, se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de gráficos que sintetizan lo que van obteniendo con el tiempo.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>3</b> ¿Quién produce?
                    </Typography>
                ),
                content:
                    "<p>Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. La Asociación de Mujeres Unidas de San Isidro (AMUSI) compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. La Asociación Integral de Campesinos de Cañito (ASICAC), conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR), compuesta por 25 asociados.</p>",
            },
            {
                title: (
                    <Typography variant="body2" component="span">
                        <b>4</b> ¿Qué encuentras?
                    </Typography>
                ),
                content:
                    "<p>Este sitio contiene gráficos de resumen de la información recolectada por las asociaciones para las siete metodologías propuestas en el libro Monitoreo comunitario de la biodiversidad en Montes de María” Los datos son subidos a la web por los monitores encargados por medio de KoBoToolbox a partir de los formatos diligenciados en físico. Además, se puede encontrar un indicador del estado del monitoreo según los compromisos anuales, la metodología y la asociación.</p>",
            },
        ],
    },
    /*
    {
        title: "Alertas Tempranas",
        subcategories: [
            {
                title: "¿Qué es?",
                content:
                    "Esta herramienta surge como una iniciativa para compartir los resultados del monitoreo comunitario de Variables Esenciales de Biodiversidad (VEB) en Montes de María. Consiste en un conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus metas para el territorio. Está basado en la ruta de monitoreo presentada en el libro “Monitoreo comunitario de la biodiversidad en Montes de María”",
            },
            {
                title: "¿Por qué?",
                content:
                    "Dado que uno de los pasos más difíciles de implementar en las estrategias de monitoreo comunitario es el análisis de los datos, se espera que esta herramienta ponga a disposición de las comunidades los resultados de la recolección de información que realizan ellos en campo, por medio de gráficos que sintetizan lo que van obteniendo con el tiempo.",
            },
            {
                title: "¿Quién produce?",
                content:
                    "Tres asociaciones comunitarias de agricultores, mujeres y hombres, víctimas del conflicto armado del departamento de Bolívar. La Asociación de Mujeres Unidas de San Isidro (AMUSI) compuesta por más de 30 familias del corregimiento San Isidro en el municipio El Carmen de Bolívar. La Asociación Integral de Campesinos de Cañito (ASICAC), conformada por más de 40 familias de la vereda Cañito, en el municipio de San Juan Nepomuceno. La Asociación de Productores Agropecuarios de la vereda Brasilar (ASOBRASILAR), compuesta por 25 asociados.",
            },
            {
                title: "¿Qué encuentras?",
                content:
                    "Este sitio contiene gráficos de resumen de la información recolectada por las asociaciones para las siete metodologías propuestas en el libro Monitoreo comunitario de la biodiversidad en Montes de María” Los datos son subidos a la web por los monitores encargados por medio de KoBoToolbox a partir de los formatos diligenciados en físico. Además, se puede encontrar un indicador del estado del monitoreo según los compromisos anuales, la metodología y la asociación.",
            },
        ],
    },*/
];

function Tabsmodulos({ activeTab, setActiveTab }) {
    const [subTab, setSubTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSubTab(0);
    };

    const handleSubTabChange = (event, newValue) => {
        setSubTab(newValue);
    };

    const alignClass = activeTab === 0 ? "cenefa-centrada" : "cenefa-izquierda";

    return (
        <div id="Tabs">
            <Container maxWidth="lg" sx={{ py: 0, px: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", height: "auto" }}>
                    <Cenefa
                        title={activeTab !== 0 ? categories[activeTab].title : ""}
                        alignClass={alignClass}
                        sx={{
                            display: { xs: activeTab !== 0 ? "block" : "none", sm: "none" },
                        }}
                    />
                    <Box id="Tab" sx={{ display: "flex", justifyContent: activeTab === 0 ? "center" : "flex-start", width: "100%" }}>
                        {activeTab === 0 ? (
                            <Box sx={{ mt: 0 }}>
                                <Typography component="h1" variant="h4" className={activeTab === 0 ? "titulo-centrado" : ""} sx={{ mb: 0, color: "white" }}>
                                    {categories[activeTab].title}
                                </Typography>
                                {categories[0].content}
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={subTab}
                                    onChange={handleSubTabChange}
                                    sx={{marginTop:  { xs: "77px", sm: "23px"},
                                        width: { xs: "100%", sm: 290 },
                                        alignSelf: "center",
                                    }}
                                >
                                    {categories[activeTab].subcategories.map((sub, index) => (
                                        <Tab key={index} label={sub.title} />
                                    ))}
                                </Tabs>

                                <Box className="Espaciado" sx={{ flex: 1 }}>
                                    <Typography
                                        component="h1"
                                        variant="h4"
                                        sx={{
                                            mb: 0,
                                            color: "white",
                                            textAlign: activeTab === 0 ? "center" : "left",
                                        }}
                                    >
                                        {categories[activeTab].title}
                                    </Typography>
                                    <Typography component="div" dangerouslySetInnerHTML={{ __html: categories[activeTab].subcategories[subTab].content }} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default Tabsmodulos;