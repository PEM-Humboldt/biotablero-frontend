const cfTexts = {};

cfTexts.info = 'La gráfica muestra la cantidad de hectáreas por valor de compensación en el área consultada. Cada color representa un rango de valor de compensación y corresponde a los colores desplegados en el mapa. Si la gráfica del área consultada presenta una alta proporción con factores mayores o iguales a 6 se interpreta como un área en donde será costoso compensar la pérdida de biodiversidad ocasionadas por las intervenciones realizadas.';

cfTexts.meta = 'El Factor de Compensación (FC) determina un valor multiplicador de un área para casos de compensación por pérdida de biodiversidad, su valor va de 4 a 10, y depende de la representatividad en el Sistema Nacional de áreas protegidas, la rareza o endemismos a nivel de especies, la remanencia de ecosistemas naturales, y las tasas de transformación. Entré más alto el valor, mayor la cantidad de hectareas a compensar. Las unidades espaciales para las cuales se calcula el FC corresponden a la intersección entre Biomas y Regiones Bióticas (Biomas-IAvH) delimitadas en el Mapa de ecosistemas continentales, costeros y marinos de Colombia a escala 1:100.000.';

cfTexts.quote = 'Las cifras se calcularon con base en el mapa de Factores de Compensación que acompaña el “Manual de Compensaciones del Componente Biótico” adoptado mediante Resolución 256 de 2018.';
cfTexts.cons = '';

export { cfTexts };

const BiomesText = {};

BiomesText.info = 'Un bioma es una región que presenta condiciones similares en cuanto a sus características climáticas, edáficas y vegetación zonal. La gráfica muestra las hectáreas por cada tipo de bioma presente en el área consultada. Entre más biomas diferentes se presenten en el área consultada, se puede inferir que potencialmente tendrá una diversidad biológica mayor. Sin embargo, se debe tener en cuenta que para cuantificar la biodiversidad de un área son necesarias otras medidas asociadas a su composición, estructura y función.';

BiomesText.quote = `Las cifras se calcularon con base en la delimitación por biomas del
<a
  href="http://www.ideam.gov.co/web/ecosistemas/mapa-ecosistemas-continentales-costeros-marinos"
  target="_blank"
  rel="noopener noreferrer"
  style={{ color: '#51b4c1' }}
>
  Mapa de Ecosistemas Continentales, Costeros y Marinos de Colombia (MEC)
</a>
, Versión 2.1, escala 1:100.000 (IDEAM et al. 2017).`;

export { BiomesText };

const BioticRegionsText = {};

BioticRegionsText.info = `Una región biótica es una unidad geográfica que presenta una composición de especies similar y que difiere de la composición de especies encontrada en otra unidad geográfica. Las unidades bióticas fueron generadas por el Instituto Humboldt a partir de mapas de distribución de especies, validación por expertos, y un ajuste con base en regionalizaciones biogeográficas de Colombia de referencia: regiones naturales del IGAC (2002) y las unidades biogeográficas de PNN (2015). El número de unidades bióticas por área consultada puede servir como un estimado de la diversidad beta existente, entendida como la cantidad de unidades diferentes en cuanto a composición de especies. Entre mayor sea el número de regiones bióticas mayor la diversidad biológica del área consultada.
<br /><br />
La gráfica muestra las hectáreas por cada tipo de región biótica presente en el área consultada.
<br /><br />
Al interpretar estas cifras se debe tener en cuenta que los mapas de distribución de especies utilizados representan un subconjunto de especies, pero a medida que incrementa el conocimiento sobre la biodiversidad, la delimitación y por ende el número de regiones bióticas puede cambiar.`;

BioticRegionsText.quote = `Las cifras se calcularon con base en IAVH 2016. Componente biótico del Mapa Nacional de
Ecosistemas Terrestres, Marinos y Costeros de Colombia a escala 1:100.000. Capa disponible en
<a
  href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/a1afc35c-db98-4110-8093-98e599d1571e"
  target="_blank"
  rel="noopener noreferrer"
  style={{ color: '#51b4c1' }}
>
  {' Geonetwork IAvH.'}
</a>`;

export { BioticRegionsText };
