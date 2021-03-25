import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';

import MethodologyBoard from './app/MethodologyBoard';
import methodologiesList from './app/data/available_methodologies';

import './main.css';

const App = () => {
  const [methodologyOption, setMethodologyOption] = useState({});

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
          {methodologiesList.map((meth, idx) => (
            <Accordion key={meth.title} disabled={!meth.enabled}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="accTitle">
                  <b>{idx + 1}</b> {`· ${meth.title}`}
                </Typography>
              </AccordionSummary>
              {meth.options &&
                meth.options.map((opt) => (
                  <AccordionDetails key={opt.id}>
                    <div
                      className={`innerMet clickDiv ${
                        methodologyOption.id === opt.id ? 'selected' : ''
                      }`}
                      onClick={() => setMethodologyOption(opt)}
                      onKeyDown={() => setMethodologyOption(opt)}
                      role="button"
                      tabIndex={0}
                    >
                      {`- ${opt.name}`}
                    </div>
                  </AccordionDetails>
                ))}
            </Accordion>
          ))}
        </div>
      </div>
      <MethodologyBoard methodology={methodologyOption} />
    </div>
  );
};

export default App;
