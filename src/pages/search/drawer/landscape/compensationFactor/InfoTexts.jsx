const cfTexts = {};

cfTexts.info = `El Factor de Compensación (FC) determina un valor multiplicador (de 4 a 10) de un
área para casos de compensación por pérdida de biodiversidad, y depende de la representatividad en
el Sistema Nacional de áreas protegidas, la rareza o endemismos a nivel de especies, la remanencia
de ecosistemas naturales, y las tasas de transformación. Entré más alto el valor, mayor la cantidad
de hectáreas a compensar. La gráfica muestra la cantidad de hectáreas por valor de compensación en
el área consultada. Cada color representa un rango de valor de compensación. Una alta proporción con
factores mayores o iguales a 6 implica un área en donde será costoso compensar.
`;

cfTexts.meto = `Las unidades espaciales para las cuales se calcula el factor de compensación
corresponden a la superposición entre biomas y
<a href="http://repository.humboldt.org.co/handle/20.500.11761/9607" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  regiones bióticas
</a>
(Biomas-I. Humboldt) delimitadas en el
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de ecosistemas continentales, costeros y marinos de Colombia
</a>
. De acuerdo con el
<a href="https://www.minambiente.gov.co/documento-entidad/manual-de-compensaciones-del-componente-biotico/" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Manual de compensaciones del componente biótico
</a>
, el valor del factor de compensación resulta de la sumatoria de cuatro criterios de compensación:
representatividad, rareza, remanencia y tasa de transformación.
`;

cfTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en cuenta:
<ul class="ul-padding-info-text">
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de ecosistemas continentales, costeros y marinos de Colombia
    </a>
    fue construido a una escala 1:100.000, que resulta idónea para análisis regionales y nacionales.
  </li>
  <li>
    La información de factores de compensación por unidad de consulta fue construida únicamente para
    jurisdicciones ambientales y no está disponible para otros tipos de unidades de consulta.
  </li>
</ul>
`;

cfTexts.quote = `El
<a href="https://www.minambiente.gov.co/documento-entidad/manual-de-compensaciones-del-componente-biotico/" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Manual de compensaciones del componente biótico
</a>
fue construido por el Ministerio de Ambiente y Desarrollo Sostenible y puede descargarse desde el
<a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-.
</a>
`;

export { cfTexts };

const BiomesText = {};

BiomesText.info = `Un bioma es una región que presenta condiciones similares en cuanto a sus
características climáticas, edáficas y vegetación zonal. La gráfica muestra las hectáreas por cada
tipo de bioma presente en el área consultada. Entre más biomas diferentes se presenten en el área
consultada, se puede inferir que potencialmente tendrá una diversidad biológica mayor.`;

BiomesText.meto = `Las cifras se calcularon con base en la delimitación por biomas del
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de ecosistemas continentales, costeros y marinos de Colombia
</a>
. El
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de ecosistemas continentales, costeros y marinos de Colombia
</a>
puede ser descargado desde el
<a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-.
</a>
`;

BiomesText.cons = `Al interpretar las cifras e indicadores presentados se debe tener en cuenta:
<ul class="ul-padding-info-text">
  <li>
    Para cuantificar la biodiversidad de un área son necesarias otras medidas asociadas a su
    composición, estructura y función, por lo que se recomienda interpretar este indicador en
    conjunto con los indicadores de porcentaje de cobertura natural, porcentaje de cobertura natural
    en ecosistemas estratégicos y riqueza de especies.
  </li>
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de ecosistemas continentales, costeros y marinos de Colombia
    </a>
    fue construido a una escala 1:100.000, que resulta idónea para análisis regionales y nacionales.
  </li>
  <li>
    La información de biomas por unidad de consulta fue construida únicamente para jurisdicciones
    ambientales y no está disponible para otros tipos de unidades de consulta.
  </li>
</ul>
`;

BiomesText.quote = `Los biomas se encuentran incorporados dentro del
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de ecosistemas continentales, costeros y marinos de Colombia
</a>
, construido por el Instituto de Hidrología, Meteorología y Estudios Ambientales -IDEAM-, Instituto
de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-, Instituto Amazónico de
Investigaciones Científicas -SINCHI-, Instituto de Investigaciones Marinas y Costeras -INVEMAR-,
Instituto de Investigaciones Ambientales del Pacifico -IIAP-, Parques Nacionales Naturales,
Instituto Geográfico Agustín CODAZZI -IGAC-, y el Ministerio de Ambiente y Desarrollo Sostenible y
puede descargarse desde el
<a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-.
</a>
`;

export { BiomesText };

const BioticRegionsText = {};

BioticRegionsText.info = `Una región biótica es una unidad geográfica que presenta una composición
de especies similar y que difiere de la composición de especies encontrada en otra unidad
geográfica. El número de unidades bióticas por área consultada puede servir como un estimado de la
diversidad beta existente, entendida como la cantidad de unidades diferentes en cuanto a composición
de especies. Entre mayor sea el número de regiones bióticas mayor la diversidad biológica del área
consultada. La gráfica muestra las hectáreas por cada tipo de región biótica presente en el área
consultada.
`;

BioticRegionsText.meto = `Las
<a href="http://repository.humboldt.org.co/handle/20.500.11761/9607" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  regiones bióticas
</a>
fueron generadas a partir de los mapas de distribución de especies disponibles en
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  BioModelos
</a>
, validación por expertos, y un ajuste con base en regionalizaciones biogeográficas de Colombia de
referencia.`;

BioticRegionsText.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<ul class="ul-padding-info-text">
  <li>
    Los mapas de distribución de especies utilizados representan un subconjunto de especies, pero a
    medida que incrementa el conocimiento sobre la biodiversidad, la delimitación y por ende el
    número de regiones bióticas puede cambiar.
  </li>
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de ecosistemas continentales, costeros y marinos de Colombia
    </a>
    fue construido a una escala 1:100.000, que resulta idónea para análisis regionales y nacionales.
  </li>
  <li>
    La información de regiones bióticas por unidad de consulta fue construida únicamente para
    jurisdicciones ambientales y no está disponible para otros tipos de unidades de consulta.
  </li>
</ul>
`;

BioticRegionsText.quote = `Las
<a href="http://repository.humboldt.org.co/handle/20.500.11761/9607" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  regiones bióticas
</a>
fueron construidas por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt
-I. Humboldt- e incorporadas al
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search#/metadata/0684d637-5b6a-40e8-80f4-bdf915b3e3da" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de ecosistemas continentales, costeros y marinos de Colombia
</a>
que puede descargarse desde el
<a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-.
</a>
`;

export { BioticRegionsText };
