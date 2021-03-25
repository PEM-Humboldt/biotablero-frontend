import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';

import MethodologyBoard from './app/MethodologyBoard';

import './main.css';

const App = () => {
  const [methodology, setMethodology] = useState('');

  return (
    <div className="wrapper wrapperCbmd">
      <div className="leftcol card">
        <h3>
          Resultados del monitoreo comunitario de
          <b> Variables Esenciales de Biodiversidad (VEB)</b> en Montes de María. Consiste en un
          conjunto de gráficos que resumen la información recolectada en campo por tres asociaciones
          comunitarias de la zona, a partir de siete metodologías de monitoreo planteadas según sus
          metas para el territorio.
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
              <div
                className="innerMet clickDiv"
                onClick={() => setMethodology('01_validacion_coberturas')}
                onKeyDown={() => setMethodology('01_validacion_coberturas')}
                role="button"
                tabIndex={0}
              >
                - Disturbios
              </div>
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
              <div
                className="innerMet"
                onClick={() => setMethodology('02_parcela_vegetacion')}
                onKeyDown={() => setMethodology('02_parcela_vegetacion')}
                role="button"
                tabIndex={0}
              >
                - Hábito de crecimiento
              </div>
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
              <div
                className="innerMet"
                onClick={() => setMethodology('06_medicion_lluvia')}
                onKeyDown={() => setMethodology('06_medicion_lluvia')}
                role="button"
                tabIndex={0}
              >
                - Precipitación diaria
              </div>
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
      </div>
      <MethodologyBoard methodology={methodology} />
    </div>
  );
};

export default App;
