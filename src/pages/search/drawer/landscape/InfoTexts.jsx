import React from 'react';

export const CurrentSEPAConnText = `Se calculó el porcentaje del área de la unidad de consulta en áreas protegidas, el porcentaje de área no protegida, el porcentaje de áreas protegidas conectado, y el porcentaje de áreas protegidas no conectado por cada ecosistema estratégico. Esta mirada permite priorizar las estrategias descritas anteriormente sobre áreas protegidas y ecosistemas que requieren mayor atención. Así, si el porcentaje protegido es menor sobre algún ecosistema particular, la estrategia debe ser un incremento general en la cobertura de las áreas protegidas para este ecosistema. Si el valor protegido no conectado es predominante sobre el área protegida, la estrategia debe ser la designación de áreas protegidas en ubicaciones que mejoren su conectividad. Finalmente, si el valor protegido conectado es predominante sobre el ecosistema e igual o mayor a una meta deseada, la cobertura y la conectividad para el sistema de áreas protegidas en este ecosistema se ha cumplido.
`;

export const TimelinePAConnText = `Se calcularon los índices protegido y protegido conectado cada 20 años, utilizando las áreas protegidas creadas desde antes de 1940 hasta la actualidad. La evaluación temporal del área protegida y de la conectividad de las áreas protegidas en el área de consulta permite evidenciar el progreso en el cumplimiento de las metas Aichi y del Plan de Acción 2020-2030 del SINAP. A través de la evaluación de estos indicadores en el tiempo, se puede identificar si la declaración de nuevas áreas protegidas ha mantenido, disminuido, o mejorado la conectividad en el área de consulta. Entre mayor sea la similitud de las dos líneas, indica que la declaración de nuevas áreas protegidas ha favorecido la conectividad del área de consulta. Por el contrario, entre más distantes se encuentren estas líneas, indica que la declaración de áreas protegidas se ha realizado en lugares que no favorecen la conectividad, lo que debe mejorarse con el fin de tener un sistema eficiente y bien conectado. Adicionalmente, en el caso en el que las nuevas áreas protegidas no contribuyeron a la conectividad, se puede identificar la ventana temporal en la que este evento ocurrió, y a través del RUNAP, identificar sobre qué áreas protegidas se deben trabajar estrategias para mejorar su conectividad.
`;

export const CurrentPAConnText = `La conectividad, al ser una prioridad para la conservación a nivel global, debe ser un indicador medible y monitoreado, por lo que presentamos en BioTablero el índice protegido conectado, el cual calcula el porcentaje de áreas protegidas que están conectadas basado en una distancia umbral (10km). Se reporta en esta sección el porcentaje del área de la unidad de consulta en áreas protegidas y área no protegida. El primero  se divide en el índice protegido conectado (proporción de áreas protegidas que están bien conectadas) y el índice protegido no conectado (proporción de áreas que se encuentran desconectadas).
<br /><br />
Con este indicador se pueden definir estrategias a seguir para el manejo y designación de áreas protegidas de acuerdo a una meta deseada. Si el porcentaje protegido es bajo , la estrategia debe ser un incremento general en la cobertura de las áreas protegidas. Si el índice protegido no conectado es menor o igual al valor de esta meta, debería fomentarse la designación de áreas protegidas en ubicaciones estratégicas para mejorar la conectividad. Finalmente, si el valor de índice protegido conectado es igual o mayor a esta meta, la cobertura y la conectividad deseada para el sistema de áreas protegidas se ha cumplido.
<br /><br />
Adicionalmente, se calculó el índice de cambio en la probabilidad de conectividad (dPC), que clasifica las áreas protegidas por su contribución a la conectividad . Pueden observarse en la gráfica las cinco áreas protegidas que más aportan a la conectividad del área de consulta,  y en el mapa todas con su valor dPC. El índice dPC mide el porcentaje de disminución de la probabilidad de conectividad causado por una eventual eliminación de cada área protegida en el área de consulta. Se calcula con base en la probabilidad de dispersión de una especie entre dos áreas protegidas la cual disminuye en función a la distancia, y el área de cada una. La probabilidad de dispersión se asumió como del 50% para todas las áreas protegidas hasta una distancia umbral de 10km (para una distancia mayor se asume que no existe conexión). De esta manera, un área protegida de mayor tamaño y más cercana a otra tendrá un mayor peso en la probabilidad de conectividad, y por lo tanto su eventual eliminación tendrá un mayor valor dPC.
<br /><br />
El índice dPC se categorizó en cinco clases (muy bajo, bajo, medio, alto, y muy alto) de acuerdo a los percentiles 20, 40, 60, 80 y 100% de todas las áreas protegidas, en todas las unidades de consulta. Entre mayor sea el índice dPC más debe ponderarse su mantenimiento y protección. Por el contrario, un  índice dPC bajo, indica que esta área protegida requiere de medidas para mejorar su contribución a la conectividad. Debe analizarse cada caso particular, pero puede estar relacionado al aumento de su tamaño, o a la declaración de áreas protegidas más cercanas.
<br /><br />
Al interpretarse este indicador se debe tener en cuenta que: <br />
<ol class="ul-padding-info-text">
<li>
Las áreas aquí utilizadas fueron descargadas en el año 2019, así que es posible que existan áreas de conservación que no se estén incluyendo en estos cálculos.
</li>
<li>
Un porcentaje mayor de áreas protegidas conectadas no garantiza que se estén cumpliendo otros objetivos de conservación como representatividad o manejo eficaz de las áreas protegidas, y tampoco da cuenta del estado de éstas en su interior. Por esta razón, se recomienda que este indicador sea leído en conjunto con el de porcentaje de cobertura natural y el Índice de Huella Espacial Humana (IHEH), también incorporados en BioTablero.
</li>
<li>
Los indicadores de conectividad presentados se basan únicamente en la capacidad de dispersión de una especie de amplio rango de hogar (p.ej. el jaguar). Así, estos indicadores pueden variar si se toman en cuenta otras distancias de dispersión, o sí además de la distancia se tienen en cuenta otras barreras que favorecen o dificultan el movimiento de las especies, tales como la permeabilidad de la matriz del paisaje. Se recomienda analizarlo en conjunto con la huella humana y la proporción de cobertura transformada, que en mayores valores disminuirían  los índices de conectividad y dPC.
</li>
</ol>
`;

export const SCIHFText = `La  integridad ecológica se define como “la capacidad del sistema para mantener la estructura y las funciones del ecosistema utilizando procesos y elementos característicos de su ecorregión”. También se considera una respuesta a la historia de disturbios y presiones del ecosistema, así como de la diversidad de especies, hábitats y procesos ecológicos.
<br /><br />
Recientemente, se desarrolló el Índice de Condición Estructural (ICE), que tiene el objetivo de cuantificar el estado del dosel, cobertura, e historia de impactos de los bosques húmedos del mundo, y que contribuye a que las naciones puedan medir el avance en conservación referentes a las metas Aichi 5, 14 y 15, y el Objetivo de Desarrollo Sostenible 15, importante avance para el monitoreo del estado y calidad del bosque húmedo tropical en el tiempo.
<br /><br />
El ICE se construyó a partir de i) la cobertura de dosel del año 2010, ii) la altura del dosel para el año 2012, y iii) la pérdida de bosque en el periodo 2000-2017. Originalmente es categorizado en 18 clases, siendo 1 baja condición y 18 alta condición; sin embargo, para efectos del índice presentado en BioTablero, estas clases se reclasifican en dos categorías “Condición Baja a Moderada” (clases originales 1-13) y “Condición Alta” (clases originales 14-18). Así, los bosques con condición estructural alta representan una cobertura boscosa mayor al 75%, con una altura mayor a 15m, y que además no han tenido disturbios durante el periodo 2000-2017.
<br /><br />
Al sobreponer ICE con la persistencia del Índice de Huella Espacial Humana (IHEH) disponible en BioTablero se genera el Índice de Integridad Estructural Forestal (IIEF), que guía la identificación de estrategias para la planeación de la conservación al integrar las presiones humanas que pueden afectar la condición estructural de los bosques. Este se muestra en seis categorías correspondientes a las combinaciones entre las clases del ICE (Bajo moderado  y Alto) y la persistencia del IHEH (estable natural, dinámica yestable alta). Cada categoría muestra una gráfica adicional con la proporción de áreas protegidas en la categoría correspondiente, y plantea estrategias de conservación. Por ejemplo, en zonas de alta condición estructural, baja huella humana, y sobre áreas protegidas, se recomiendan incentivos comunitarios y la gestión activa para mantener la protección de los bosques, mientras en zonas fuera del sistema de áreas protegidas se recomienda la gestión de acuerdos de conservación para expandir su protección. En zonas con condición estructural baja a moderada y baja huella humana, se recomienda restaurar la estructura de los bosques mediante estrategias de restauración, agroforestería, y control de pastoreo y quema de fuegos, mientras en zonas con condición estructural alta y huella humana dinámica o alta, se puede restaurar la estructura con iniciativas de educación y ciencia ciudadana.
<br /><br />
Al interpretar los resultados de este indicador se debe tener en cuenta que: <br />
<ol class="ul-padding-info-text">
 <li>
La resolución del indicador es de 300m. Escalas regionales y nacionales, no es recomendable para identificar patrones a nivel local.
 </li>
 <li>
La información es del periodo  2000 a 2018.
</li>
 <li>
El producto usado para definir la extensión de bosques es de carácter global, no representa al 100% la extensión de los bosques en algunos lugares del planeta. Debe mirarse en conjunto con otros indicadores como el de pérdida de bosques, que presenta una distribución ajustada de éstos de acuerdo al producto de extensión de bosques nacional presentado por el <a href="http://seinekan.ideam.gov.co/SMBYC/ApolloPro.aspx" target="_blank" rel="noopener noreferrer">
IDEAM
</a> y sus <a href="http://smbyc.ideam.gov.co/MonitoreoBC-WEB/reportes/paginaReportesBosqueNatural.jsp" target="_blank" rel="noopener noreferrer">
sus capas y cifras
</a>
</li>
<li>
Se recomienda leer este indicador en conjunto con otros indicadores como el de proporción de pérdida de bosques, conectividad de áreas protegidas, y verificaciones en campo que soporten las decisiones ambientales.
</li>
</ol>
`;

export const cFInfo = `El Factor de Compensación (FC) determina un valor multiplicador de un área para casos de compensación por pérdida de biodiversidad, su valor va de 4 a 10, y depende de la representatividad en el Sistema Nacional de áreas protegidas, la rareza o endemismos a nivel de especies, la remanencia de ecosistemas naturales, y las tasas de transformación. Entré más alto el valor, mayor la cantidad de hectareas a compensar. Las unidades espaciales para las cuales se calcula el FC corresponden a la intersección entre Biomas y Regiones Bióticas (Biomas-IAvH) delimitadas en el Mapa de ecosistemas continentales, costeros y marinos de Colombia a escala 1:100.000.
<br /><br />
La gráfica muestra la cantidad de hectáreas por valor de compensación en el área consultada. Cada color representa un rango de valor de compensación y corresponde a los colores desplegados en el mapa. Si la gráfica del área consultada presenta una alta proporción con factores mayores o iguales a 6 se interpreta como un área en donde será costoso compensar la pérdida de biodiversidad ocasionadas por las intervenciones realizadas.
<br /><br />
Las cifras se calcularon con base en el mapa de Factores de Compensación que acompaña el “Manual de Compensaciones del Componente Biótico” adoptado mediante Resolución 256 de 2018.`;

export const currentHFText = `El Índice de Huella Espacial Humana (IHEH) cuantifica la magnitud de la influencia acumulada de las actividades antrópicas sobre los paisajes y ecosistemas; éste tiene un valor de 0 a 100 indicando en orden ascendente el grado de impacto humano. EL IHEH se clasifica en Natural (IHEH de 0 - 15), Bajo (IHEH = 15 - 40), Medio (IHEH= 40 - 60) y Alto (IHEH > 60). El IHEH se generó para Colombia a una resolución de 300 m y se calcula a partir de la intensidad del uso medida por: 1) tipo de uso, 2) densidad de población, 3) distancia a ríos, 4) distancia a asentamientos, 5) índice de fragmentación e 6) índice de biomasa relativo al potencial natural. Adicionalmente considera el tiempo de intervención medido en años.
<br /><br />
El valor de la Huella Humana en el área de consulta se calcula a partir del valor promedio del IHEH. La gráfica muestra la proporción de área bajo las categorías Natural, Baja, Media y Alta del IHEH. Cada color representa una categoría y corresponde a los colores desplegados en el mapa.
<br /><br />
Una mayor proporción del IHEH media o alta representa áreas influenciadas en mayor medida por las actividades antrópicas, mientras que áreas con una mayor proporción de IHEH natural o baja mantienen condiciones de naturalidad importantes de conservar.
<br /><br />
El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en:
Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>
<br /><br />
El mapa con el IHEH a una resolución de 300 metros se encuentra disponible en
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer">
  Geonetwork IAvH.
</a>
<br /><br />
Al momento de interpretar los valores del IHEH se debe tener en cuenta que:
<ul class="ul-padding-info-text">
  <li>
    La falta de información detallada de actividades económicas, establecimiento de estructuras humanas como antenas, zonas de basuras, minería, suelo para agricultura, datos de caza, entre otros, pueden subestimar los valores del índice es regiones como la Orinoquía, Pacífico y Amazonas.
  </li>
  <li>
    El IHEH ahora se enfoca en ecosistemas terrestres, el componente sobre ecosistemas dulceacuícolas debe ser fortalecido.
  </li>
</ul>
`;

export const persistenceHFText = `El IHEH se calculó para los años 1970, 1990, 2000, 2015 y 2018. Se identifican los sitios en los que para todos los años el IHEH ha persistido en categoría alta (color rojo en gráfica y mapa) o natural (estable natural, color azul en gráfica y mapa), y donde ha sido dinámico, con categorías alta, media y baja (color ocre en gráfica y mapa).
<br /><br />
Los valores de persistencia del IHEH pueden guiar las estrategias de conservación de manera diferencial sobre el territorio. Estrategias con enfoque de preservación sobre lugares con categoría estable natural, ya que representan un bajo impacto humano a través del tiempo; de restauración sobre áreas con IHEH dinámica; o estrategias de uso sostenible sobre regiones en categoría estable alta, las cuales tradicionalmente han tenido una intensidad de transformación.
<br /><br />
La gráfica muestra la proporción de área bajo las categorías Estable Alta, Dinámica y Estable Natural. Cada color representa una categoría y corresponde a los colores desplegados en el mapa.
<br /><br />
El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en:
Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>
`;

export const timelineHFText = `Con base en los valores promedio del IHEH para 1970, 1990, 2000, 2015 y 2018 se caracterizó la dinámica de la Huella Humana en los ecosistemas estratégicos y se compara con el valor del área consultada. Si la gráfica presenta las curvas para alguno de los ecosistemas estratégicos (líneas amarilla, azul o verde) por encima de la línea negra, se interpreta que para el área seleccionada la magnitud de la influencia acumulada de las actividades antrópicas ha sido mayor en un determinado ecosistema estratégico en comparación con otros ecosistemas presentes en el área consultada. Esto quiere decir que sobre los ecosistemas estratégicos se presentan más presiones que sobre otros ecosistemas en el área, lo que se puede interpretar como una mayor demanda de los servicios ecosistémicos que prestan y sobre los cuales se deben generar estrategias de uso sostenible si se quiere seguir aprovechando los beneficios derivados de su uso.
<br /><br />
El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en:
Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>
`;

export const BiomesText = (
  <>
    Un bioma es una región que presenta condiciones similares en cuanto a sus características
    climáticas, edáficas y vegetación zonal. La gráfica muestra las hectáreas por cada tipo
    de bioma presente en el área consultada. Entre más biomas diferentes se presenten en el
    área consultada, se puede inferir que potencialmente tendrá una diversidad biológica mayor.
    Sin embargo, se debe tener en cuenta que para cuantificar la biodiversidad de un área son
    necesarias otras medidas asociadas a su composición, estructura y función.
    <br />
    <br />
    Las cifras se calcularon con base en la delimitación por biomas del
    <a
      href="http://www.ideam.gov.co/web/ecosistemas/mapa-ecosistemas-continentales-costeros-marinos"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#51b4c1' }}
    >
      {' Mapa de Ecosistemas Continentales, Costeros y Marinos de Colombia (MEC)'}
    </a>
    , Versión 2.1, escala 1:100.000 (IDEAM et al. 2017).
  </>
);

export const BioticRegionsText = (
  <>
    Una región biótica es una unidad geográfica que presenta una composición de especies similar
    y que difiere de la composición de especies encontrada en otra unidad geográfica. Las unidades
    bióticas fueron generadas por el Instituto Humboldt a partir de mapas de distribución de
    especies, validación por expertos, y un ajuste con base en regionalizaciones biogeográficas
    de Colombia de referencia: regiones naturales del IGAC (2002) y las unidades biogeográficas
    de PNN (2015). El número de unidades bióticas por área consultada puede servir como un estimado
    de la diversidad beta existente, entendida como la cantidad de unidades diferentes en cuanto a
    composición de especies. Entre mayor sea el número de regiones bióticas mayor la diversidad
    biológica del área consultada.
    <br />
    <br />
    La gráfica muestra las hectáreas por cada tipo de región biótica presente en el área consultada.
    <br />
    <br />
    Al interpretar estas cifras se debe tener en cuenta que los mapas de distribución de especies
    utilizados representan un subconjunto de especies, pero a medida que incrementa el conocimiento
    sobre la biodiversidad, la delimitación y por ende el número de regiones bióticas puede cambiar.
    <br />
    <br />
    Las cifras se calcularon con base en IAVH 2016. Componente biótico del Mapa Nacional de
    Ecosistemas Terrestres, Marinos y Costeros de Colombia a escala 1:100.000. Capa disponible en
    <a
      href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/a1afc35c-db98-4110-8093-98e599d1571e"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#51b4c1' }}
    >
      {' Geonetwork IAvH.'}
    </a>
  </>
);
