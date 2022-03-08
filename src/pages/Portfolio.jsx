import React from 'react';
import Item from './portfolio/Item';

const Portfolio = () => (
  <div className="wrapperPort">
    <div className="splitPort">
      <div className="colPort1">
        <h1 className="portTitle">
          Portafolios
        </h1>
        <div className="portText1">
          <p>
            Los portafolios son un conjunto de áreas priorizadas para la conservación
            que se generan a partir de un método sistemático en el que se buscan
            soluciones costo efectivas para la conservación y gestión de la biodiversidad,
            seleccionando áreas donde se maximiza la conservación a un mínimo costo.
            En los últimos años, teniendo en cuenta los contextos políticos y el
            interés tanto de metas globales como acuerdos multilaterales, políticas
            nacionales y regionales por invertir mayores esfuerzos en acciones de conservación.
          </p>
          <p>
            Los investigadores del Instituto Humboldt en alianza con
            diversas instituciones nacionales e internacionales, han utilizado distintas
            representaciones de la biodiversidad, así como diversos condicionantes para
            su conservación con el fin de priorizar estas áreas. A continuación podemos
            encontrar los avances en estos esfuerzos, metodologías y resultados de
            investigación con sus respectivos enlaces para ampliar y consultar la
            información de cada proyecto.
          </p>
        </div>
      </div>
      <div className="colPort2">
        <div className="rowPort1">
          <Item
            title="NATURE MAP · WCMC"
            year="2021"
            description={`Se muestran las áreas prioritarias para la conservación
            conjunta de especies, ecosistemas, comunidades bióticas, y áreas vulnerables
            a la deforestación, inundación, cambio climático, suministro de agua,
            erosión y salinización de suelos.`}
            link="http://portafolios.humboldt.org.co"
          />
        </div>
        <div className="rowPort2">
          <Item
            title="ELSA · PNUD"
            year="2020"
            description={`Combinando información espacial priorizada a partir de documentos
            de política pública, se identificaron las Áreas Esenciales para el Soporte de
            la Vida en Colombia -ELSA- y las acciones para implementarlas usando la planificación
            sistemática de la conservación -protección, gestión, restauración-.`}
            link="http://reporte.humboldt.org.co/biodiversidad/2020/cap4/401/"
          />
        </div>
        <div className="rowPort3">
          <Item
            title="WEPLAN FORESTS"
            year="2021"
            description={`Plataforma de soporte a la toma de decisiones con diferentes
            escenarios de priorización de áreas de restauración en el país. Los
            escenarios están basados en la minimización de costos y la maximización
            de reducción de riesgo de extinción de especies y mitigación de cambio climático.`}
            link="http://weplan-colombia.s3-website-us-east-1.amazonaws.com/"
          />
        </div>
      </div>
    </div>
  </div>
);

export default Portfolio;
