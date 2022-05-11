const CurrentSEPAConnTexts = {};

CurrentSEPAConnTexts.info = `Los Ecosistemas Estratégicos son aquellos destacados por su importancia biológica, por las contribuciones que generan a las personas, o por su nivel de vulnerabilidad en el país. Se presenta en hectáreas la cantidad de Páramos, Bosque Seco Tropical y Humedales para el área consultada, y para cada tipo de ecosistema dentro de la unidad de consulta se presenta: el índice ProtConn
<a href="https://doi.org/10.1016/j.ecolind.2016.12.047" target="_blank" rel="noopener noreferrer">
  (Saura et al 2017),
</a>
el porcentaje de áreas protegidas no conectado (ProtUnconn), el porcentaje de área no protegida (UnProt) y el porcentaje en áreas protegidas (Prot).
<br /><br />
Si para un ecosistema estratégico se calcula un porcentaje menor al 17% representado en áreas protegidas, puede inferirse que para la unidad consultada hacen falta esfuerzos para la conservación de ese ecosistema. El 17% es la cifra mínima recomendada de representatividad de las áreas protegidas en ecosistemas terrestres y aguas continentales de acuerdo a las metas Aichi del Convenio sobre la Diversidad Biológica. Sin embargo, se plantea incrementar este porcentaje a 30% de acuerdo a las nuevas metas del Marco Global de Biodiversidad post 2020. Si el porcentaje protegido sobre algún ecosistema particular es menor a las metas mencionadas anteriormente, la estrategia debe ser un incremento general en la cobertura de las áreas protegidas para este ecosistema, teniendo en cuenta que: si el valor protegido no conectado es predominante sobre el área protegida, la estrategia debe ser la designación de áreas protegidas en ubicaciones que mejoren su conectividad. Finalmente, si el valor del índice Protegido Conectado sobre el ecosistema es igual o mayor a una meta deseada, la cobertura y la conectividad para el sistema de áreas protegidas en este ecosistema se ha cumplido.`;

CurrentSEPAConnTexts.quote = `Las cifras de ecosistemas estratégicos se obtuvieron de:
<br />
<ol class="ul-padding-info-text">
  <li>
    IAvH.
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer">
      Actualización de los límites cartográficos de los Complejos de Páramos de Colombia,
    </a>
    escala 1:100.000. Proyecto: Actualización del Atlas de Páramos de Colombia. (2012).
  </li>
  <li>
    IAvH.
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/eca845f9-dea1-4e86-b562-27338b79ef29" target="_blank" rel="noopener noreferrer">
      Bosques secos tropicales de Colombia,
    </a>
    escala 1:100.000. (2014).
  </li>
  <li>
    IAvH.
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer">
      Mapa Identificación de humedales de Colombia,
    </a>
    escala 1:100.000 (2015).
  </li>
</ol>
<p>Al interpretar las cifras e indicadores presentados se deben tener en cuenta lo siguiente: </p>
<ol class="ul-padding-info-text">
  <li>
    El límite cartográfico de los ecosistemas estratégicos representa su distribución potencial, y no actual, y están construidos a una escala 1:100.000, lo que permite análisis regionales y nacionales.
  </li>
  <li>
    No todas las áreas de conservación a nivel regional y local están inscritas en el
    <a href="https://runap.parquesnacionales.gov.co/" target="_blank" rel="noopener noreferrer">
      RUNAP
    </a>
    la incorporación en este registro depende del reporte de las autoridades regionales. La información espacial del RUNAP utilizada para los cálculos presentados fue consultada en enero de 2019, modificaciones posteriores al RUNAP no se encuentran reflejadas.
  </li>
  <li>
    Un porcentaje mayor de áreas protegidas conectadas no garantiza que se estén cumpliendo otros objetivos de conservación como representatividad o manejo eficaz de las áreas protegidas, y tampoco da cuenta del estado de éstas en su interior. Por esta razón, se recomienda que este indicador sea leído en conjunto con el de porcentaje de cobertura natural y el Índice de Huella Espacial Humana (IHEH), también incorporados en BioTablero.
  </li>
</ol>`;

export { CurrentSEPAConnTexts };

const TimelinePAConnTexts = {};

TimelinePAConnTexts.info = `La medición temporal del tamaño de las áreas protegidas y su conectividad en el área de consulta permite evaluar si la declaración de nuevas áreas protegidas ha mantenido, disminuido, o mejorado la conectividad en el área de consulta. Esta información es relevante para identificar el progreso en el cumplimiento de las metas de conservación y del Plan de Acción 2020-2030 del SINAP. Utilizando las áreas protegidas creadas desde antes de 1940 hasta la actualidad, se calcula el porcentaje del área consultada que cuenta con áreas protegidas (Prot) y el índice Protegido Conectado (ProtConn)
<a href="https://doi.org/10.1016/j.ecolind.2016.12.047" target="_blank" rel="noopener noreferrer">
  (Saura et al 2017)
</a>
cada 20 años. La gráfica presenta la tendencia en el tiempo de los valores de Prot y ProtConn. Si las dos líneas mantienen una tendencia creciente, indican que a medida que crece la cobertura de APs crece también su conectividad. Adicionalmente, entre más cercanas se encuentren las dos líneas, indica que la declaración de nuevas APs en el tiempo se ha dado en lugares estratégicos que han favorecido la conectividad del área de consulta. Por el contrario, una mayor distancia entre estas líneas indica que la declaración de áreas protegidas se ha realizado en lugares que favorecen en menor medida la conectividad. En el caso en el que las nuevas áreas protegidas no contribuyeron a la conectividad, se puede identificar la ventana temporal en la que este evento ocurrió, y a través del RUNAP, identificar sobre qué áreas protegidas se deben trabajar estrategias para mejorar su conectividad con nuevas declaratorias o estrategias complementarias que mejoren el impacto negativo que la matriz antrópica ejerce sobre estas APs.`;

TimelinePAConnTexts.cons = `Al interpretar las cifras e indicadores presentados se deben tener en cuenta lo siguiente:
<br />
<ol class="ul-padding-info-text">
  <li>
    No todas las áreas de conservación a nivel regional y local están inscritas en el
    <a href="https://runap.parquesnacionales.gov.co/" target="_blank" rel="noopener noreferrer">
      RUNAP
    </a>
    la incorporación en este registro depende del reporte de las autoridades regionales. La información espacial del RUNAP utilizada para los cálculos presentados fue consultada en enero de 2019, modificaciones posteriores al RUNAP no se encuentran reflejadas.
  </li>
  <li>
    Pese a que nuevas áreas protegidas no contribuyan a la conectividad, puede ser que estas estén contribuyendo al cumplimiento de otros objetivos de conservación como la representatividad. Por esta razón, se recomienda que este indicador sea leído en conjunto con un indicador que dé cuenta de la representatividad de las áreas protegidas.
  </li>
  <li>
    Algunas estrategias complementarias de conservación a nivel local y regional, y otras figuras de conservación existentes como resguardos indígenas y otros territorios colectivos no fueron tenidas en cuenta en este análisis. Su inclusión, podría aumentar el valor del índice protegido conectado, ya que su presencia puede favorecer la conectividad entre áreas protegidas.
  </li>
</ol>`;

export { TimelinePAConnTexts };

const CurrentPAConnTexts = {};
CurrentPAConnTexts.info = `La conectividad es una medida de cómo los elementos del paisaje facilitan o dificultan el flujo de los procesos naturales que sostienen la vida en la Tierra
<a href="https://www.cms.int/sites/default/files/document/cms_cop12_res.12.26_connectivity_e.pdf" target="_blank" rel="noopener noreferrer">
  (CMS, 2020),
</a>
permitiendo que especies y funciones ecológicas se mantengan en el tiempo. Los sistemas de áreas protegidas (APs) mejorarán su efectividad si se encuentran bien conectados; así la conectividad es una prioridad para la conservación a nivel global.`;

CurrentPAConnTexts.meto = `El <b>índice Protegido Conectado</b> (ProtConn)
<a href="https://doi.org/10.1016/j.ecolind.2016.12.047" target="_blank" rel="noopener noreferrer">
  (Saura et al 2017),
</a>
es un indicador de la conectividad de los sistemas de APs, y calcula el porcentaje del área consultada cubierta por APs  bien conectadas, considerando en este caso que están conectadas si se encuentran a una distancia media de dispersión menor o igual de 10 km. Entre mayor sea el porcentaje del índice Protegido Conectado, mayor será el área de la unidad de consulta cubierta por APs bien conectadas. Este índice también permite conocer el porcentaje del área de consulta que tiene áreas <b>protegidas y no conectadas</b> (ProtUnconn). La barra muestra el total del área consultada, en color verde se indica el porcentaje de área cubierto por áreas protegidas conectadas, y en color café el porcentaje de áreas protegidas no conectadas. Finalmente se presenta el porcentaje del área consultada que cuenta con áreas protegidas (Prot).
<br /><br />
Este indicador facilita la definición de estrategias para la designación de APs en el área consultada con base en una meta de cobertura. Si el porcentaje protegido es menor que la meta de cobertura, la estrategia debería ser incrementar la cobertura de las áreas protegidas teniendo en cuenta que: si el índice Protegido No Conectado es menor al valor de la meta de APs bien conectas, debería fomentarse su designación en ubicaciones estratégicas para mejorar la conectividad. Finalmente, si el valor de índice Protegido Conectado es igual o mayor a esta meta, la cobertura y la conectividad deseada para el sistema de áreas protegidas se ha cumplido.
<br /><br />`;

CurrentPAConnTexts.cons = `Al interpretar las cifras e indicadores presentados se deben tener en cuenta lo siguiente: <br />
<ol class="ul-padding-info-text">
  <li>
    No todas las áreas de conservación a nivel regional y local están inscritas en el
    <a href="https://runap.parquesnacionales.gov.co/" target="_blank" rel="noopener noreferrer">
      RUNAP
    </a>
    la incorporación en este registro depende del reporte de las autoridades regionales. La información espacial del RUNAP utilizada para los cálculos presentados fue consultada en enero de 2019, modificaciones posteriores al RUNAP no se encuentran reflejadas.
  </li>
  <li>
    Un porcentaje mayor de áreas protegidas conectadas no garantiza que se estén cumpliendo otros objetivos de conservación como representatividad o manejo eficaz de las áreas protegidas, y tampoco da cuenta del estado de éstas en su interior. Por esta razón, se recomienda que este indicador sea leído en conjunto con el de porcentaje de cobertura natural y el Índice de Huella Espacial Humana (IHEH), también incorporados en BioTablero.
  </li>
  <li>
    Los indicadores de conectividad presentados se basan únicamente en la distancia media de dispersión (10 km) de una especie de amplio rango de hogar (p.ej. el jaguar). Estos indicadores pueden variar si se toman en cuenta otros rangos de dispersión  y  otros elementos del paisaje que favorecen o dificultan el movimiento de las especies. Se recomienda analizar en conjunto con la huella humana y la proporción de cobertura transformada, las cuales podrían aportar el efecto del impacto humano sobre la conectividad.
  </li>
</ol>`;

export { CurrentPAConnTexts };

const DPCConnTexts = {};

DPCConnTexts.info = 'info';
DPCConnTexts.meto = `Adicionalmente, se calcula el <b>aporte individual de las áreas protegidas</b> a la conectividad usando el índice de cambio en la probabilidad de conectividad (dPC)
<a href="https://doi.org/10.1016/j.landurbplan.2007.03.005" target="_blank" rel="noopener noreferrer">
  (Saura et al 2007).
</a>
El dPC, mide el porcentaje de variación de la probabilidad de conectividad al remover sistemáticamente un área protegida específica en el área de consulta. Un área protegida de gran tamaño y más cercana a otra tendrá un mayor peso en la probabilidad de conectividad, y por lo tanto su eliminación tendrá un mayor valor dPC. El índice dPC se categorizó en cinco clases (muy bajo, bajo, medio, alto, y muy alto) de acuerdo a los percentiles 20, 40, 60, 80 y 100%. La gráfica muestra las cinco áreas protegidas que más aportan a la conectividad del área de consulta y en el mapa puede consultar todas las áreas protegidas con su correspondiente valor dPC.
<br /><br />
Un valor alto en el Índice dPC, significa que dicha área protegida presenta una alta contribución al mantenimiento de la conectividad del sistema de AP. En este caso las áreas protegidas más grandes y bien ubicadas corresponderán a las más importantes y su mantenimiento y protección es crucial para la conectividad. Por el contrario, un valor bajo del índice dPC, indica que esta área protegida no contribuye tanto a la conectividad en función de su tamaño y ubicación dentro del área consultada. Estas áreas protegidas requieren de medidas para mejorar su contribución a la conectividad, como el aumento de su tamaño o a la declaración de áreas protegidas más cercanas.`;

export { DPCConnTexts };
