export const sectionInfo = `En esta sección se presenta en hectáreas el tipo de cobertura, áreas protegidas y ecosistemas estratégicos para el área consultada. Los porcentajes presentados son respecto al total del área consultada, con excepción de aquellos presentados para coberturas y áreas protegidas, construidos en relación a cada ecosistema estratégico.
<br /><br />
Al interpretar estas cifras e indicadores se debe tener en cuenta que valores inferiores al 1% no son representados en las gráficas y que cualquier cálculo realizado a través de software SIG es una estimación del valor real y dependerá de los parámetros del sistema de proyección utilizado. El sistema de proyección utilizado para el cálculo de áreas en BioTablero es el Sistema MAGNA-SIRGAS con origen en Bogotá y adoptado para el país por el Instituto Geográfico Agustín Codazzi - IGAC.`;

export const CoverageText = `La medición del porcentaje de cobertura natural (color azul), 
secundaria (amarillo) y transformada (terracota) en el área consultada muestra el grado de 
conservación o transformación de los ecosistemas, y permite medir el avance en el cumplimiento de 
metas de conservación. Un mayor porcentaje de cobertura natural significa un mejor estado de los 
ecosistemas, mientras un mayor porcentaje de cobertura transformada da a entender una mayor pérdida 
de ecosistemas naturales. El porcentaje de cobertura secundaria puede mostrar procesos de 
regeneración asistidos o naturales, y dar una referencia de la dinámica de rotación de los 
cultivos en el área consultada.
`;

export const coverageMeto = `Las cifras de cobertura se obtuvieron de la recategorización del
<a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search;jsessionid=97B6F80606F3D7E735B92FA7456F174E#/metadata/285c4d0a-6924-42c6-b4d4-6aef2c1aceb5" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Mapa de Cobertura de la Tierra 2018
</a>
. Siguiendo la 
<a href="http://documentacion.ideam.gov.co/cgi-bin/koha/opac-detail.pl?biblionumber=10707" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Leyenda Nacional de Coberturas de la Tierra
</a>
, las coberturas naturales agrupan las categorías bosque denso, abierto, fragmentado, de galería y
ripario,  herbazal, arbustal, zonas arenosas naturales, afloramientos rocosos, zonas glaciares y
nivales, áreas húmedas continentales y costeras, ríos, lagunas, lagos y ciénagas naturales, y
canales y lagunas costeras. Las coberturas transformadas agrupan las categorías territorios
artificializados y agrícolas, plantaciones forestales, tierras desnudas y degradadas, zonas
quemadas, cuerpos de agua artificiales y estanques para acuicultura marina. Las coberturas
secundarias corresponden a la categoría vegetación secundaria o en transición.
`;

export const coverageCons = `Al interpretar las cifras e indicadores presentados con información de coberturas se deben tener
en cuenta lo siguiente:
<ul class="ul-padding-info-text">
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search;jsessionid=97B6F80606F3D7E735B92FA7456F174E#/metadata/285c4d0a-6924-42c6-b4d4-6aef2c1aceb5" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de Cobertura de la Tierra 2018
    </a>
    se construyó a partir de imágenes satelitales del año 2018, es una muestra aproximada de este 
    año y no da cuenta del estado actual de los ecosistemas.
  </li>
  <li>
    De acuerdo con la metodología Corine Land Cover la unidad mínima de mapeo corresponde a 25 ha, 
    áreas de cobertura menores no se encuentran representadas.
  </li>
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search;jsessionid=97B6F80606F3D7E735B92FA7456F174E#/metadata/285c4d0a-6924-42c6-b4d4-6aef2c1aceb5" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de Cobertura de la Tierra 2018
    </a>
    fue convertido a formato raster a una resolución
    aproximada de 30 m y re proyectado al sistema de coordenadas
    <a href="https://epsg.io/4326" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      EPSG 4326
    </a>
    . Las cifras presentadas deben tomarse como valores aproximados y no absolutos.
  </li>
</ul>
`;

export const coverageQuote = `Las cifras de cobertura se obtuvieron de:
<ul class="ul-padding-info-text">
  <li>
    El 
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search;jsessionid=97B6F80606F3D7E735B92FA7456F174E#/metadata/285c4d0a-6924-42c6-b4d4-6aef2c1aceb5" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de Cobertura de la Tierra 2018
    </a>
    fue construido por el Instituto de Hidrología, Meteorología y Estudios Ambientales - IDEAM, 
    el Instituto Amazónico de Investigaciones Científicas - SINCHI, y Parques Nacionales Naturales 
    de Colombia - PNN y puede descargarse desde el
    <a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-
    </a>
    .
  </li>
  <li>
    La
    <a href="http://documentacion.ideam.gov.co/cgi-bin/koha/opac-detail.pl?biblionumber=10707" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Leyenda Nacional de Coberturas de la Tierra
    </a>
    fue construida por el Instituto de Hidrología, Meteorología y Estudios Ambientales - IDEAM.
  </li>
</ul>
`;

export const PAText = `Este indicador es utilizado para medir el nivel de implementación de las
políticas o las acciones para prevenir o reducir la pérdida de biodiversidad (
<a href="https://www.cambridge.org/core/journals/oryx/article/linked-indicator-sets-for-addressing-biodiversity-loss/1D2B4D07C757AD7D2BBB8E70B81E6E17" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Sparks, 2011
</a>
). El indicador se desagrega por los tipos de áreas protegidas incorporadas en el
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
para evaluar su implementación a nivel nacional, regional o de la sociedad civil.
`;

export const PAMeto = `El porcentaje de área representada en áreas protegidas se calculó a partir de
la superposición entre la capa del
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
y el área consultada.
`;

export const PACons = `Al interpretar las cifras e indicadores presentados con información de 
oberturas se debe tener en cuenta:
<ul class="ul-padding-info-text">
  <li>
    Este indicador debe complementarse con otros que den cuenta del estado -p. ej. el porcentaje de
    cobertura natural- o las presiones sobre éstos -p. ej. Índice Espacial de Huella Humana o el
    porcentaje de cobertura transformada-, para tener una mejor idea del estado de los ecosistemas
    en el área consultada.
  </li>
  <li>
    Es posible que existan áreas protegidas que no se estén teniendo en cuenta en estos cálculos, ya
     que puede ocurrir que no todas las áreas de conservación a nivel regional y local se encuentren
    inscritas en el Registro Único Nacional de Áreas Protegidas -RUNAP-; la incorporación en este
    registro depende del reporte de las autoridades regionales y locales.
  </li>
  <li>
    La capa del RUNAP utilizada para los cálculos fue consultada en marzo de 2022; modificaciones 
    posteriores al RUNAP no se encuentran reflejadas.
  </li>
  <li>
    Para evitar la sobreestimación del porcentaje de áreas protegidas, las superposiciones
    espaciales entre distintos tipos de áreas protegidas del RUNAP fueron incluidas en el cálculo
    una sola vez.
  </li>
</ul>
`;

export const PAQuote = `El
<a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Registro Único Nacional de Áreas Protegidas -RUNAP-
</a>
se encuentra en cabeza de Parques Nacionales Naturales y puede descargarse desde
<a href="https://mapas.parquesnacionales.gov.co/services/pnn/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pnn:runap2&maxFeatures=10000&outputFormat=SHAPE-ZIP" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  RUNAP en Cifras
</a>
.
`;

export const SEText = `Se presenta el área de Páramo, Bosque Seco Tropical y Humedales para el área
consultada, y para cada ecosistema su porcentaje de cobertura natural, secundaria y transformada, y
su representación en áreas protegidas. El
<a href="https://www.cbd.int/doc/c/0671/4456/ff4979877c8a9a910912689e/wg2020-03-03-es.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Primer Borrador del Marco Mundial de Biodiversidad post 2020
</a>
(Meta 3) plantea la conservación del 30 % de las zonas de particular importancia para la diversidad
biológica y sus contribuciones a las personas. Estos ecosistemas estratégicos favorecen la oferta de
 bienes y servicios ambientales esenciales para el desarrollo sostenible del país.
`;

export const SEMeto = `El tipo de cobertura y representación de áreas protegidas siguieron el mismo
desarrollo de los indicadores porcentaje de cobertura natural, secundaria y transformada, y
porcentaje de área representada en áreas protegidas para la distribución de los ecosistemas de
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo
</a>
,
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales
</a>
.
`;

export const SECons = `Al interpretar las cifras e indicadores presentados se debe tener en cuenta:
en cuenta lo siguiente:
<ul class="ul-padding-info-text">
  <li>
    Las mismas consideraciones de los indicadores porcentaje de cobertura natural, secundaria y
    transformada, y porcentaje de área representada en áreas protegidas.
  </li>
  <li>
    La distribución de los ecosistemas estratégicos fue construida a una escala 1:100.000, que resulta
    idónea para análisis regionales y nacionales.
  </li>
</ul>
`;

export const SEQuote = `<ul class="ul-padding-info-text">
  <li>
    El
    <a href="http://geoservicios.ideam.gov.co/geonetwork/srv/spa/catalog.search;jsessionid=97B6F80606F3D7E735B92FA7456F174E#/metadata/285c4d0a-6924-42c6-b4d4-6aef2c1aceb5" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Mapa de Cobertura de la Tierra 2018
    </a>
    fue construido por el Instituto de Hidrología, Meteorología y Estudios Ambientales - IDEAM, el 
    Instituto Amazónico de Investigaciones Científicas - SINCHI, y Parques Nacionales Naturales de 
    Colombia - PNN y puede descargarse desde el
    <a href="http://www.siac.gov.co/catalogo-de-mapas" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Catálogo de Mapas del Sistema de Información Ambiental de Colombia -SIAC-
    </a>
    .
  </li>
  <li>
    La
    <a href="http://documentacion.ideam.gov.co/cgi-bin/koha/opac-detail.pl?biblionumber=10707" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Leyenda Nacional de Coberturas de la Tierra
    </a>
    fue construida por el Instituto de Hidrología, Meteorología y Estudios Ambientales - IDEAM.
  </li>
  <li>
    El
    <a href="https://runap.parquesnacionales.gov.co/cifras" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Registro Único Nacional de Áreas Protegidas -RUNAP-
    </a>
    se encuentra en cabeza de Parques Nacionales Naturales y puede descargarse desde
    <a href="https://mapas.parquesnacionales.gov.co/services/pnn/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pnn:runap2&maxFeatures=10000&outputFormat=SHAPE-ZIP" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      RUNAP en Cifras
    </a>
    .
  </li>
  <li>
    La distribución de los ecosistemas de
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Páramo
    </a>
    ,
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Bosque Seco Tropical
    </a>
    y
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Humedales
    </a>
    fue construida por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt
    -I. Humboldt- y pueden descargarse desde su
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Repositorio Geográfico
    </a>
    (
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Páramo
    </a>
    ,
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Bosque Seco Tropical
    </a>
    y
    <a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
      Humedales
    </a>
    ).
  </li>
</ul>
`;
