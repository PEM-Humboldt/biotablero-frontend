const CurrentPAConnTexts = {};

CurrentPAConnTexts.info = `El índice de conectividad de áreas protegidas
<a href="https://www.sciencedirect.com/science/article/pii/S1470160X1630752X?via%3Dihub" target="_blank" rel="noopener noreferrer">
  (Saura et al 2017)
</a>
indica el porcentaje de áreas protegidas que se encuentran conectadas. Se considera que el sistema
de áreas protegidas está conectado si se encuentran a una distancia menor o igual a 10 km. Se
presenta el porcentaje de área protegida, área protegida conectada (verde), área protegida no
conectada (marrón), y área no protegida (gris) en la unidad consultada. Este indicador facilita la
definición de estrategias para la designación de áreas protegidas con base en una meta de
representación. Si el porcentaje de área protegida es menor que la meta, la estrategia debería ser
incrementar la representación de las áreas protegidas teniendo en cuenta que, si el área protegida
conectada es menor al valor de la meta, debería fomentarse la designación de áreas protegidas en
ubicaciones estratégicas para mejorar la conectividad.`;

CurrentPAConnTexts.meto = `El porcentaje de área protegida se calculó a partir de la superposición
entre la capa del
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
y el área consultada. De este porcentaje se extrajo el área protegida conectada teniendo en cuenta
sólo las áreas protegidas a una distancia igual o menor a 10 km calculados a partir del centroide
del área protegida. El área protegida no conectada se calculó como la diferencia entre el área
protegida y el área protegida no conectada. El área no protegida se calculó como la diferencia entre
el área protegida y el área de la unidad consultada.`;

CurrentPAConnTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<br />
<ol class="ul-padding-info-text">
  <li>
    Es posible que existan áreas protegidas que no se estén teniendo en cuenta en estos cálculos,
    ya que puede ocurrir que no todas las áreas de conservación a nivel regional y local se
    encuentren inscritas en el
    <a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
      Registro Único Nacional de Áreas Protegidas -RUNAP-
    </a>
    ; la incorporación en este registro depende del reporte de las autoridades regionales y locales.
  </li>
  <li>
    La capa del
    <a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
      RUNAP
    </a>
    utilizada para los cálculos fue consultada en marzo de 2022; modificaciones posteriores al
    <a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
      RUNAP
    </a>
    no se encuentran reflejadas.
  </li>
  <li>
    Aunque la declaración de nuevas áreas protegidas no contribuye siempre al mejoramiento de su
    conectividad, sí lo hace al cumplimiento de otros objetivos de conservación como la
    representación. Por esta razón, se recomienda que el área protegida y el área protegida
    conectada sean interpretadas en conjunto.
  </li>
  <li>
    Los indicadores presentados no dan cuenta del cumplimiento de otros objetivos de conservación
    como el manejo eficaz de las áreas protegidas ni su estado o presiones. Por esta razón, se
    recomienda que este indicador sea interpretado en conjunto con el de porcentaje de cobertura
    natural y transformada, y el Índice de Huella Espacial Humana (IHEH), incorporados en BioTablero.
  </li>
  <li>
    Los indicadores de conectividad presentados se basan únicamente en la distancia (10 km) de una
    especie de amplio rango de hogar (p.ej. el jaguar). Estos indicadores pueden variar si se toman
    en cuenta otros rangos de dispersión y otros elementos del paisaje que favorecen o dificultan el
    movimiento de las especies. Algunas estrategias complementarias de conservación a nivel local y
    regional, y otras figuras de conservación existentes como resguardos indígenas y otros
    territorios colectivos no fueron tenidas en cuenta en este análisis. Su inclusión podría
    aumentar el valor del área protegida conectada.
  </li>
  <li>
    Algunas estrategias complementarias de conservación a nivel local y regional, y otras figuras de
    conservación existentes como resguardos indígenas y otros territorios colectivos no fueron
    tenidas en cuenta en este análisis. Su inclusión podría aumentar el valor del área protegida
    conectada.
  </li>
</ol>
`;

CurrentPAConnTexts.quote = `El
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
se encuentra en cabeza de Parques Nacionales Naturales. Los indicadores de conectividad de áreas
protegidas fueron propuestos por Saura y colaboradores
(<a href="https://www.sciencedirect.com/science/article/pii/S1470160X1630752X?via%3Dihub" target="_blank" rel="noopener noreferrer">2017</a>).
`;

export { CurrentPAConnTexts };

const DPCConnTexts = {};

DPCConnTexts.info = `La importancia de las cinco áreas protegidas que más aportan a la
conectividad del área consultada se calcula a través del índice de cambio en la probabilidad de
conectividad (dPC) (
<a href="https://www.sciencedirect.com/science/article/abs/pii/S0169204607000709?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Saura et al 2007
</a>
). Entre más alto sea el dPC de un área protegida, significa que contribuye en mayor medida al
mantenimiento de la conectividad en el área consultada. Un área protegida de mayor tamaño y cercana
a otras áreas protegidas tendrá un mayor valor dPC. El índice dPC se categoriza en cinco clases: muy
bajo, bajo, medio , alto, y muy alto (ver leyenda en figura).
`;

DPCConnTexts.meto = `El aporte individual de las áreas protegidas a la conectividad se
calculó usando el índice de cambio en la probabilidad de conectividad (dPC)
(<a href="https://www.sciencedirect.com/science/article/abs/pii/S0169204607000709?via%3Dihub" target="_blank" rel="noopener noreferrer">Saura et al 2007</a>).
El dPC calcula el porcentaje de variación de la probabilidad de conectividad al remover
sistemáticamente un área protegida específica en el área de consulta. Un área protegida de gran
tamaño y más cercana a otra tendrá un mayor peso en la probabilidad de conectividad, y por lo tanto
su eliminación tendrá un mayor valor dPC. El índice dPC se categorizó en cinco clases (muy bajo,
bajo, medio, alto, y muy alto) de acuerdo a los percentiles 20, 40, 60, 80 y 100%, calculados a
partir de todos los valores de dPC de las áreas protegidas superpuestas con el área consultada.
`;

DPCConnTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<br />
<ol class="ul-padding-info-text">
  <li>
    Todas las consideraciones de los indicadores de conectividad de áreas protegidas.
  </li>
  <li>
    Todas las áreas protegidas cuya distribución se superpone con algún límite del área consultada
    fueron incluidas en el cálculo utilizando el área completa de su distribución, ya que se asume
    que el sistema de áreas protegidas no se restringe únicamente a límites administrativos.
  </li>
</ol>
`;

DPCConnTexts.quote = `El
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
se encuentra en cabeza de Parques Nacionales Naturales y puede descargarse desde
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  RUNAP en Cifras.
</a>
<br /><br />
El indicador de cambio en la probabilidad de conectividad fue propuesto por Saura y colaboradores
(<a href="https://www.sciencedirect.com/science/article/abs/pii/S0169204607000709?via%3Dihub" target="_blank" rel="noopener noreferrer">2007</a>).
`;

export { DPCConnTexts };

const TimelinePAConnTexts = {};

TimelinePAConnTexts.info = `La tendencia del porcentaje de área protegida (color aguamarina) y área
protegida conectada (verde) en el tiempo permite evaluar si la declaración de nuevas áreas
protegidas ha mantenido, disminuido, o mejorado la conectividad en el área consultada. Esta
información es relevante para identificar el progreso en el cumplimiento de metas de conservación y
del
<a href="https://sinap.minambiente.gov.co/" target="_blank" rel="noopener noreferrer">
  Plan de Acción 2020-2030 del Sistema Nacional de Áreas Protegidas - SINAP-
</a>
. Si las dos líneas mantienen una tendencia creciente, indican que a medida que crece la
representación de áreas protegidas crece también su conectividad. Entre más cercanas se encuentren
las dos líneas, indica que la declaración de nuevas áreas protegidas en el tiempo se ha dado en
lugares estratégicos que han favorecido la conectividad. Por el contrario, una mayor distancia entre
estas líneas indica que la declaración de áreas protegidas se ha realizado en lugares que favorecen
en menor medida la conectividad.`;

TimelinePAConnTexts.meto = `Se utilizó la información de fecha de actuación de la capa del
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
para extraer el año de creación de cada área protegida. En los casos en que la información estaba
ausente, ésta fue obtenida de la resolución de declaración del área protegida correspondiente. Se
seleccionaron las áreas protegidas declaradas en cada década y se calculó el porcentaje de área
protegida y área protegida conectada siguiendo el desarrollo metodológico de los indicadores de
conectividad de áreas protegidas.`;

TimelinePAConnTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<br />
<ol class="ul-padding-info-text">
  <li>
    Todas las consideraciones de los indicadores de conectividad de áreas protegidas.
  </li>
  <li>
    En los casos en que la información de fecha de actuación en la capa del
    <a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
      Registro Único Nacional de Áreas Protegidas -RUNAP-
    </a>
    estaba ausente, ésta tuvo que ser obtenida de la resolución de declaración del área protegida
    correspondiente.
  </li>
</ol>`;

TimelinePAConnTexts.quote = `El
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
se encuentra en cabeza de Parques Nacionales Naturales y puede descargarse desde
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  RUNAP en Cifras.
</a>
<br /><br />
Los indicadores de área protegida, protegida conectada y protegida no conectada fueron propuestos
por Saura y colaboradores
(<a href="https://www.sciencedirect.com/science/article/pii/S1470160X1630752X?via%3Dihub" target="_blank" rel="noopener noreferrer">2017</a>).
`;

export { TimelinePAConnTexts };

const CurrentSEPAConnTexts = {};

CurrentSEPAConnTexts.info = `Se presenta el porcentaje de área protegida, área protegida conectada
(color verde), área protegida no conectada (marrón), y área no protegida (gris) en los ecosistemas
de Páramo, Bosque Seco Tropical y Humedales para el área consultada. El
<a href="https://www.cbd.int/doc/c/0671/4456/ff4979877c8a9a910912689e/wg2020-03-03-es.pdf" target="_blank" rel="noopener noreferrer">
  Primer Borrador del Marco Mundial de Biodiversidad post 2020
</a>
(Meta 3) plantea la conservación del 30% de las de las zonas de particular importancia para la
diversidad biológica y sus contribuciones a las personas garantizando sistemas de áreas protegidas
bien conectados. Si el porcentaje de área protegida es menor que una meta particular en un
ecosistema, la estrategia debería ser incrementar la representación de las áreas protegidas teniendo
en cuenta que, si el área protegida conectada es menor al valor de la meta, debería fomentarse la
designación de áreas protegidas en ubicaciones estratégicas para mejorar la conectividad.
`;

CurrentSEPAConnTexts.meto = `El porcentaje de área protegida, área protegida conectada, área
protegida no conectada, y área no protegida siguieron el mismo desarrollo de los indicadores de
conectividad de áreas protegidas calculados en el área consultada, pero usando los límites de la
distribución de los ecosistemas de
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales
</a>
en el área consultada.
`;

CurrentSEPAConnTexts.cons = `<ol class="ul-padding-info-text">
  <li>
    Todas las consideraciones de los indicadores de conectividad de áreas protegidas.
  </li>
  <li>
    La distribución de los ecosistemas estratégicos fue construida a una escala 1:100.000, que
    resulta idónea para análisis regionales y nacionales.
  </li>
</ol>
`;

CurrentSEPAConnTexts.quote = `El
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
se encuentra en cabeza de Parques Nacionales Naturales y puede descargarse desde
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer">
  RUNAP en Cifras.
</a>
<br /><br />
Los indicadores de área protegida, protegida conectada y protegida no conectada fueron propuestos
por Saura y colaboradores
<a href="https://www.sciencedirect.com/science/article/pii/S1470160X1630752X?via%3Dihub" target="_blank" rel="noopener noreferrer">
  (2017).
</a>
<br /><br />
La distribución de los ecosistemas de
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales
</a>
fue construida por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt
-I. Humboldt- y pueden descargarse desde su
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Repositorio Geográfico
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  (Páramo,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales).
</a>
`;

export { CurrentSEPAConnTexts };
