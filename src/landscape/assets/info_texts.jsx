import React from 'react';

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


export const biomesText = (
  <React.Fragment>
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
  </React.Fragment>
);

export const bioticRegionsText = (
  <React.Fragment>
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
  </React.Fragment>
);
