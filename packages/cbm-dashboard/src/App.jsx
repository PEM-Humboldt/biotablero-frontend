import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import React, { useState } from 'react';

import M01 from './M01';
import M02 from './M02';
import M06 from './M06';

const App = () => {
  const [metodology, setMetodology] = useState('');

  return (
    <div className="wrapper wrapperCbmd">
      <div className="leftcol card">
        <h3>
          Resultados del monitoreo comunitario de
          <b>Variables Esenciales de Biodiversidad (VEB)</b>
          en Montes de María. Consiste en un conjunto de gráficos que resumen la información
          recolectada en campo por tres asociaciones comunitarias de la zona, a partir de siete
          metodologías de monitoreo planteadas según sus metas para el territorio.
        </h3>
        <h4>Seleccione la metodología de monitoreo: </h4>
        <div className="accordionCss">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="accTitle">
                <b>01</b> · VALIDACIÓN DE COBERTURAS
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div className="innerMet">- Disturbios</div>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className="accTitle">
                <b>02</b> · PARCELA DE VEGETACIÓN
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div className="innerMet">- Hábito de crecimiento</div>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion disabled>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className="accTitle">
                <b>03</b> · PUNTOS DE CONTEO
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion disabled>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className="accTitle">
                <b>04</b> · CÁMARAS TRAMPA
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion disabled>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className="accTitle">
                <b>05</b> · FLORACIÓN, FRUCTIFICACIÓN E INTERACCIÓN
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="accTitle">
                <b>06</b> · MEDICIÓN DE LLUVIA
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <div className="innerMet">- Precipitación diaria</div>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion disabled>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography className="accTitle">
                <b>07</b> · MEDICIÓN DE CAUDAL
              </Typography>
            </AccordionSummary>
          </Accordion>
        </div>
        <label htmlFor="sel_metodologia">
          <select
            id="sel_metodologia"
            onChange={(event) => setMetodology(event.target.value)}
            aria-label="metodologia"
          >
            <option disabled selected>
              -- Seleccione una opción --
            </option>
            <option value="01_validacion_coberturas">M01 - Validación de coberturas</option>
            <option value="02_parcela_vegetacion">M02 - Parcela de vegetación</option>
            <option value="06_medicion_lluvia">M06 - Medición de lluvia</option>
          </select>
        </label>
      </div>
      <div className="Montabs1 cardTab cTactive">GENERAL</div>
      <div className="Montabs2 cardTab">AMUSI</div>
      <div className="Montabs3 cardTab">ASICAC</div>
      <div className="Montabs4 cardTab">ASOBRASILAR</div>
      <div className="Graph card">
        {metodology === '01_validacion_coberturas' && <M01 />}
        {metodology === '02_parcela_vegetacion' && <M02 />}
        {metodology === '06_medicion_lluvia' && <M06 />}
      </div>
      <div className="graphInfo card">
        <h2>Disturbios</h2>
        <h3>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
          quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
          consequat.
        </h3>
        <h2>
          Periodicidad <ThumbUpAltIcon />
        </h2>
        <ThumbDownAltIcon />
      </div>
    </div>
  );
};

export default App;
