import React from 'react';

export const sectionInfo = `En esta sección se presenta en hectáreas el tipo de cobertura, áreas protegidas y ecosistemas estratégicos para el área consultada. Los porcentajes presentados son respecto al total del área consultada, con excepción de aquellos presentados para coberturas y áreas protegidas, construidos en relación a cada ecosistema estratégico.
<br /><br />
Al interpretar estas cifras e indicadores se debe tener en cuenta que valores inferiores al 1% no son representados en las gráficas y que cualquier cálculo realizado a través de software SIG es una estimación del valor real y dependerá de los parámetros del sistema de proyección utilizado. El sistema de proyección utilizado para el cálculo de áreas en BioTablero es el Sistema MAGNA-SIRGAS con origen en Bogotá y adoptado para el país por el Instituto Geográfico Agustín Codazzi - IGAC.`;

export const CoverageText = (
  <>
    La medición del porcentaje de coberturas natural, secundaria y transformada da cuenta del grado
    de conservación o de transformación de los ecosistemas y es utilizado para medir el avance en el
    cumplimiento de metas de conservación globales. Entre mayor sea el porcentaje de cobertura
    natural se puede inferir un mejor estado de los ecosistemas presentes. Entre mayor sea el
    porcentaje de cobertura transformada se puede inferir una mayor pérdida de ecosistemas
    naturales. El porcentaje de cobertura secundaria pude dar cuenta de los procesos de
    regeneración, activos o pasivos, y las dinámicas de los cultivos en el área consultada.
    <br />
    <br />
    Las cifras de cobertura se obtuvieron de:
    <ul className="ul-padding">
      <li>
        IDEAM. Mapa de Cobertura de la tierra periodo 2010 - 2012. (2012), categorizado por
        coberturas natural, secundaria y transformada de acuerdo con: IDEAM. Leyenda Nacional de
        Coberturas de la Tierra. Metodología CORINE Land Cover Adaptada para Colombia. Escala
        1:100.000. (2010).
      </li>
    </ul>
    <br />
    Al interpretar las cifras e indicadores presentados con información de coberturas se deben tener
    en cuenta lo siguiente:
    <ul className="ul-padding">
      <li>
        El Mapa de Cobertura de la tierra periodo 2010 - 2012 se construyó a partir de una
        colección de imágenes satelitales durante este periodo de tiempo, por lo que representa la
        cobertura de este periodo y no de un año particular. Esto significa que no da cuenta del
        estado actual de transformación en este ecosistema, sino de una muestra aproximada al año
        2012.
      </li>
      <li>
        De acuerdo con la metodología Corine Land Cover, la unidad mínima de mapeo corresponde a
        25ha, por lo que áreas de cobertura menores a esta extensión no se encuentran representadas
        en este mapa.
      </li>
    </ul>
  </>
);

export const PAText = (
  <>
    El indicador: “Porcentaje de área representada en áreas protegidas” es utilizado para medir el
    nivel de implementación de las políticas o las acciones para prevenir o reducir la pérdida de
    biodiversidad (Sparks, 2011). Dependiendo del tipo de área protegida se puede desagregar la
    respuesta por autoridades nacionales, regionales y sociedad civil. Pese a que este indicador se
    ha utilizado también para inferir la condición de los ecosistemas, éste debería complementarse
    con indicadores que den cuenta del estado de los atributos del ecosistema: estructura,
    composición y función, o del nivel de presiones presentes en el ecosistema. En BioTablero
    presentamos como indicador de estado el porcentaje de cobertura natural como atributo de la
    estructura, y el Índice Espacial de Huella Humana como un índice de presión. Se recomiendo
    hacer la lectura de los tres indicadores para tener una mejor idea del estado de los ecosistemas
    naturales en el área consultada.
    <br />
    <br />
    Las cifras de porcentaje de área protegidas se obtuvieron a partir de la información espacial
    del
    <a href="https://runap.parquesnacionales.gov.co" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      {' Registro Único Nacional de Áreas Protegidas de Colombia- RUNAP.'}
    </a>
    <br />
    <br />
    Al interpretar las cifras e indicadores presentados con información de porcentaje de áreas
    protegidas se debe tener en cuenta:
    <ul className="ul-padding">
      <li>
        Es probable que no todas las áreas de conservación a nivel regional y local se encuentren
        inscritas en el RUNAP; la incorporación en este registro depende del reporte de las
        autoridades regionales y locales. Así, es posible que existan áreas de conservación que no
        se estén tomando en estos cálculos.
      </li>
      <li>
        La información espacial del RUNAP utilizada para los cálculos presentados fue consultada en
        enero de 2019, modificaciones posteriores al RUNAP no se encuentran reflejadas.
      </li>
      <li>
        Para evitar la sobreestimación del porcentaje de áreas protegidas, las superposiciones
        espaciales entre distintas figuras de conservación presentes en la información espacial del
        RUNAP fueron incluidas en el cálculo una sola vez.
      </li>
    </ul>
  </>
);

export const SEText = (
  <>
    Los Ecosistemas Estratégicos son aquellos destacados por su importancia biológica, por las
    contribuciones que generan a las personas, o por su nivel de vulnerabilidad en el país.
    Se presenta en hectáreas la cantidad de Páramos, Bosque Seco Tropical y Humedales para el
    área consultada, y para cada tipo de ecosistema dentro del mismo límite, se presenta el
    porcentaje de coberturas natural, secundaria y transformada, y su representación en áreas
    protegidas.
    <br />
    <br />
    Si para un ecosistema estratégico se tiene un porcentaje menor al 17% representado en áreas
    protegidas, puede inferirse que para la unidad consultada hacen falta esfuerzos para la
    conservación de ese ecosistema. El 17% es la cifra mínima recomendada de representatividad
    de las áreas protegidas en ecosistemas terrestres y aguas continentales de acuerdo a las metas
    Aichi del Convenio sobre la Diversidad Biológica. Sin embargo, se plantea incrementar este
    porcentaje a 30% de acuerdo a las nuevas metas del Marco Global de Biodiversidad post 2020.
    <br />
    <br />
    Las cifras de ecosistemas estratégicos se obtuvieron de:
    <ul className="ul-padding">
      <li>
        IAvH. Actualización de los límites cartográficos de los Complejos de Páramos de Colombia,
        escala 1:100.000. Proyecto: Actualización del Atlas de Páramos de Colombia. (2012).
      </li>
      <li>
        IAvH. Bosques secos tropicales de Colombia, escala 1:100.000. (2014).
      </li>
      <li>
        IAvH. Mapa Identificación de humedales de Colombia, escala 1:100.000 (2015).
      </li>
    </ul>
    <br />
    Al interpretar las cifras e indicadores presentados con información de coberturas se deben tener
    en cuenta lo siguiente:
    <ul className="ul-padding">
      <li>
        El límite cartográfico de los ecosistemas estratégicos representa su distribución potencial,
        y no actual, y están construido a una escala 1:100.000, lo que permite análisis regionales y
        nacionales.
      </li>
    </ul>
  </>
);
