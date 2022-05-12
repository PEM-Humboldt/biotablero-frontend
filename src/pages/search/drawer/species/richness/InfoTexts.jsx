const NOSInferredTexts = {};

NOSInferredTexts.info = 'La riqueza mide el número de especies que se encuentran en un área de consulta, identificando zonas con alta (color azul en el mapa) o baja concentración (color crema en el mapa). Los valores de riqueza de especies se presentan de manera relativa con puntos de comparación para el área consultada. Cada una de las gráficas representan la riqueza de distintos tipos de especies clave (total, amenazadas, invasoras y endémicas) y se encuentra dividida en dos secciones: 1) la riqueza de especies en las unidades de consulta (p.ej. departamentos - color amarillo), y su 2) proporción respecto a su región natural correspondiente (p.ej. región Andes, Caribe, Pacífico, Orinoquia o Amazonas - color naranja). Adicionalmente, se muestra con un punto sobre la barra el valor de riqueza de la unidad de consulta (p.ej. Antioquia), y el valor mínimo y máximo de las demás unidades de consulta del mismo tipo (p.ej. departamentos).';

NOSInferredTexts.meto = `El número de especies total inferido fue calculado a partir de la suma de 5808
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer">BioModelos</a>,
en donde se identifican las condiciones climáticamente idóneas donde las especies pueden potencialmente habitar a una resolución de 1km<sup>2</sup>
(<a href="https://onlinelibrary.wiley.com/doi/full/10.1111/j.0906-7590.2008.5203.x" target="_blank" rel="noopener noreferrer">Phillips & Dudik 2008</a>,
<a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0214522" target="_blank" rel="noopener noreferrer">Velásquez-Tibatá et al. 2019</a>).
Para el número de especies amenazadas se sumaron los
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer">BioModelos</a>
de las especies categorizadas en peligro crítico de extinción (CR), en peligro de extinción (EN) y vulnerable (VU) según la
<a href="https://www.iucnredlist.org/" target="_blank" rel="noopener noreferrer">Unión Internacional para la Conservación de la Naturaleza -UICN-</a>
Para las especies invasoras se construyeron 23 BioModelos de especies de plantas (Salgado-Negret et al. Sometido) usando registros de presencias y variables bioclimáticas para obtener mapas de su distribución potencial
(<a href="https://onlinelibrary.wiley.com/doi/full/10.1111/j.0906-7590.2008.5203.x" target="_blank" rel="noopener noreferrer">Phillips & Dudik 2008</a>).
Las especies invasoras modeladas fueron priorizadas por su alto potencial de invasión en el país
(<a href="http://www.humboldt.org.co/es/estado-de-los-recursos-naturales/item/1059-plantas-exoticas-invasion-en-colombia" target="_blank" rel="noopener noreferrer">(Cárdenas-López et al. 2010)</a>).
Las especies endémicas se identificaron considerando los listados nacionales de especies publicados a través del
<a href="https://biodiversidad.co/" target="_blank" rel="noopener noreferrer">SiB Colombia</a>,
y se espacializaron con los mapas disponibles en el portal de la
<a href="https://www.iucnredlist.org/" target="_blank" rel="noopener noreferrer">UICN</a>
(<a href="http://reporte.humboldt.org.co/biodiversidad/2018/cap2/203/" target="_blank" rel="noopener noreferrer">González et al. 2018</a>)`;

NOSInferredTexts.cons = `<ul class="ul-padding-info-text">
  <li>
    La riqueza puede ser utilizada como un indicador del estado de la biodiversidad del área consultada siempre y cuando se acompañe de información sobre la identidad y estado de las especies presentes. Un valor alto de riqueza, no necesariamente indica un buen estado de conservación. Se recomienda leer este indicador en conjunto con los demás indicadores de las secciones Ecosistemas y Paisajes en BioTablero para identificar un panorama más amplio sobre el estado de la biodiversidad del área de consulta.
  </li>
  <li>
    El número de especies inferido resulta de la distribución potencial de las especies, y se relaciona con su presencia probable en respuesta a las condiciones climáticas. Otras variables como el hábitat o las interacciones bióticas determinan la presencia actual de las especies pero no estas no fueron incluídas. Las cifras presentadas deben tomarse como valores potenciales y no absolutos.
  </li>
  <li>
    Los 5808 modelos representan sólo una muestra de las especies existentes en el país, por lo que los valores presentados no reflejan el número real de especies sobre el territorio; estos valores pueden estar sobre o subestimados.
  </li>
</ul>`;

NOSInferredTexts.quote = `Los
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer">BioModelos</a>
(<a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0214522" target="_blank" rel="noopener noreferrer">Velásquez-Tibatá et al. 2019</a>)
utilizados para la cuantificación del número de especies inferido fueron construidos por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt- y pueden ser descargados a través de
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer">BioModelos</a>.
<br /><br />
Las rutinas empleadas para la construcción de los
<a href="http://biomodelos.humboldt.org.co/" target="_blank" rel="noopener noreferrer">BioModelos</a>
se encuentran disponibles en el
<a href="https://github.com/PEM-Humboldt/biomodelos-sdm" target="_blank" rel="noopener noreferrer">repositorio del Programa de Evaluación y Monitoreo de la Biodiversidad del Instituto Humboldt</a>.
<br /><br />
Para mayor información puede comunicarse por correo electrónico a
<a href="mailto:biomodelos@humboldt.org.co">biomodelos@humboldt.org.co</a>.`;

export { NOSInferredTexts };

const NOSObservedTexts = {};

NOSObservedTexts.info = 'La riqueza mide el número de especies que se encuentran en un área de consulta. Los valores de riqueza de especies se presentan de manera relativa con puntos de comparación para el área consultada. Cada una de las gráficas representan la riqueza de distintos tipos de especies clave (total, amenazadas, invasoras y endémicas) y se encuentra dividida en dos secciones: 1) la riqueza de especies en las unidades de consulta (p.ej. departamentos - color amarillo), y su 2) proporción respecto a su región natural correspondiente (p.ej. región Andes, Caribe, Pacífico, Orinoquia o Amazonas - color naranja). Adicionalmente, se muestra con un punto sobre la barra el valor de riqueza de la unidad de consulta (p.ej. Antioquia), y el valor mínimo y máximo de las demás unidades de consulta del mismo tipo (p.ej. departamentos).';

NOSObservedTexts.meto = `El número de especies observado fue calculado a partir de 11,730,023 registros georeferenciados obtenidos de la base de datos
"<a href="https://www.gbif.org/es/country/CO/summary" target="_blank" rel="noopener noreferrer">the Global Biodiversity Information Facility -GBIF-</a>".
Las especies amenazadas se definieron como aquellas categorizadas en peligro crítico de extinción (CR), en peligro de extinción (EN) y vulnerable (VU) según la
<a href="https://www.minambiente.gov.co/wp-content/uploads/2021/10/resolucion-1912-de-2017.pdf" target="_blank" rel="noopener noreferrer">resolución 1912 de 2017</a>
del Ministerio de Ambiente y Desarrollo Sostenible. Las especies exóticas se identificaron mediante distintas fuentes de información, como
<a href="https://www.cabi.org/isc/" target="_blank" rel="noopener noreferrer">Invasive Species Compendium (ISC)</a>,
<a href="http://www.iucngisd.org/gisd/" target="_blank" rel="noopener noreferrer">Global Invasive Species Database (GISD)</a>,
<a href="https://www.oas.org/en/sedi/dsd/iabin/" target="_blank" rel="noopener noreferrer">Inter-American Biodiversity Information Network (IABIN)</a>,
además de diversos artículos científicos. Las especies endémicas se validaron a nivel de país usando distintas fuentes como
<a href="https://amphibiaweb.org/" target="_blank" rel="noopener noreferrer">AmphibiaWeb</a>,
<a href="http://catalogoplantasdecolombia.unal.edu.co/es/" target="_blank" rel="noopener noreferrer">Bernal et al., 2015</a>,
<a href="https://www.redalyc.org/articulo.oa?id=49120960001%253E%2520ISSN%25200124-5376" target="_blank" rel="noopener noreferrer">Maldonado-Ocampo et al, 2008</a>,
<a href="https://www.redalyc.org/pdf/457/45729294008.pdf" target="_blank" rel="noopener noreferrer">Solari et al., 2013</a>,
<a href="https://www.museum.lsu.edu/~Remsen/SACCCountryLists.htm" target="_blank" rel="noopener noreferrer">Species lists of birds for South American countries and territories</a>,
<a href="http://www.reptile-database.org/" target="_blank" rel="noopener noreferrer">The Reptile Database</a>,
<a href="https://ipt.biodiversidad.co/sib/resource?r=catalogo_plantas_liquenes" target="_blank" rel="noopener noreferrer">Lista del Catálogo de Plantas y Líquenes de Colombia</a>,
<a href="https://ipt.biodiversidad.co/sib/resource?r=mamiferos_col" target="_blank" rel="noopener noreferrer">Lista de referencias de Mamíferos de Colombia</a>,
<a href="https://ipt.biodiversidad.co/sib/resource?r=ictiofauna_colombiana_dulceacuicola" target="_blank" rel="noopener noreferrer">Lista de especies de agua dulce de Colombia</a>,
<a href="http://doi.org/10.15472/qhsz0p" target="_blank" rel="noopener noreferrer">Lista de referencia de especies de aves de Colombia</a>.`;

NOSObservedTexts.cons = `<ul class="ul-padding-info-text">
  <li>
    La riqueza puede ser utilizada como un indicador del estado de la biodiversidad del área consultada siempre y cuando se acompañe de información sobre la identidad y estado de las especies presentes. Un valor alto de riqueza, no necesariamente indica un buen estado de conservación. Se recomienda leer este indicador en conjunto con los demás indicadores de las secciones Ecosistemas y Paisajes en BioTablero para identificar un panorama más amplio sobre el estado de la biodiversidad del área de consulta.
  </li>
  <li>
    Los registros utilizados no cuentan con un proceso de depuración y pueden incluir errores de identificación taxonómica y de georeferenciación, por lo que los valores presentados no reflejan el número real de especies sobre el territorio, estos valores pueden estar sobre o subestimados.
  </li>
  <li>
    Los registros tienen un sesgo geográfico relacionado principalmente con la accesibilidad a los sitios de muestreo. En este sentido se recomienda leer este indicador en   conjunto con el Análisis de Vacíos en Biodiversidad Continental para Colombia (AVBCC) disponible en BioTablero, con el fin de evaluar la representatividad de los registros en el área de consulta.
  </li>
</ul>`;

NOSObservedTexts.quote = `El proceso de obtención de los registros y la cuantificación de la riqueza de especies está a cargo de la
<a href="http://humboldt.org.co/es/servicios/servicios-y-recursos/infraestructura-institucional-de-datos" target="_blank" rel="noopener noreferrer">Infraestructura Institucional de Datos (I2D)</a>
del Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-. Las rutinas para estos cálculos pueden consultarse en su
<a href="https://github.com/I2DHumboldt" target="_blank" rel="noopener noreferrer">repositorio de código abierto</a>
<br /><br />
http://humboldt.org.co/es/servicios/servicios-y-recursos/infraestructura-institucional-de-datos
<a href="mailto:i2d@humboldt.org.co">i2d@humboldt.org.co</a>.`;

export { NOSObservedTexts };

export const NumberOfSpeciesTextHelper = 'Haga click en un icono para visualizar un tipo de riqueza o ambas. En inferido puede hacer clic en cada barra para visualizar el mapa de riqueza correspondiente';

const SpeciesRecordsGapsTexts = {};

SpeciesRecordsGapsTexts.info = 'El Análisis de Vacíos en Biodiversidad Continental para Colombia (AVBCC) identifica la representatividad de la información sobre biodiversidad asociada al número de registros biológicos en un área de consulta. El resultado es un mapa con valores entre 0% (color azul) y 100% (color rojo), donde 0 indica áreas sin vacíos de información (bien representada) y 100 indica áreas con los mayores vacíos de información sobre biodiversidad. En estas últimas áreas se sugieren mayores esfuerzos de muestreos para mejorar el conocimiento de la biodiversidad. En la figura se representa el valor del AVBCC como un punto, y además se presentan otros seis valores útiles para su comparación: 1) el valor mínimo y 2) máximo del AVBCC en el área de consulta (p.ej. Antioquia), 3) el valor mínimo y 4) máximo del AVBCC en las demás áreas de consulta del mismo tipo de la misma región (p.ej. departamentos de la región Andes), 5) el valor mínimo y 6) máximo del AVBCC en la región biótica correspondiente al área de consulta (p.ej. región Andes).';

SpeciesRecordsGapsTexts.meto = `Los registros empleados para el cálculo del AVBCC se encuentran disponibles para Colombia en bases de datos como el
<a href="https://sibcolombia.net/" target="_blank" rel="noopener noreferrer">SiB Colombia</a>
y
"<a href="https://www.gbif.org/es/country/CO/summary" target="_blank" rel="noopener noreferrer">the Global Biodiversity Information Facility -GBIF-</a>"
- El índice integrado AVBCC se obtiene de promediar tres componentes: 1) concentración de los datos en el espacio geográfico (densidad de registros); 2) representatividad ambiental, siguiendo la metodología propuesta por
<a href="https://doi.org/10.1111/ddi.13137" target="_blank" rel="noopener noreferrer">Aguiar et al. (2020)</a>,
la cual modela los registros de especies sobre variables bioclimáticas para identificar las regiones no estudiadas que son ambientalmente diferentes; y 3) complementariedad de la riqueza de especies, la cual calcula la presencia de especies según la densidad de registros en celdas de 1km<sup>2</sup>,
y con base en estimaciones no paramétricas de
<a href="https://doi.org/10.2307/2530802" target="_blank" rel="noopener noreferrer">Jackknife</a>
de primer orden, se estima la riqueza esperada en cada celda, siendo el valor de complementariedad, la diferencia entre el valor estimado y el esperado. La ruta metodológica hace parte de la propuesta de
<a href="https://doi.org/10.7809/b-e.00057" target="_blank" rel="noopener noreferrer">García Márquez et al. (2012)</a>
para la estimación de un índice espacial de los registros de especies, y cuenta con algunos ajustes para el país.`;

SpeciesRecordsGapsTexts.quote = `El mapa de vacíos se encuentra disponible en el
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/f21ec6a3-d8ac-4d1b-aacf-c4030f60a924" target="_blank" rel="noopener noreferrer">Repositorio Geográfico</a>
del Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-.
<br /><br />
Las rutinas que se emplearon para el cálculo del AVBCC se encuentran disponibles en el
<a href="https://github.com/PEM-Humboldt/gsi_analysis" target="_blank" rel="noopener noreferrer">repositorio del Programa de Evaluación y Monitoreo del Instituto Humboldt</a>.<br /><br />
El trabajo para la generación del AVBCC es liderado por
<a href="mailto:ccruz@humbodt.org.co">Cristian Cruz Rodríguez</a>
y colaboradores en el I. Humboldt.`;

SpeciesRecordsGapsTexts.cons = `<ul class="ul-padding-info-text">
  <li>
    Los registros obtenidos para el presente análisis fueron descargados en enero de 2021 y se les aplicaron rutinas de verificación geográfica y taxonómica que pueden ser consultadas en los siguientes enlaces:
    <a href="https://github.com/LBAB-Humboldt/workFlow/blob/master/verifTax'.R" target="_blank" rel="noopener noreferrer">Verificación Geográfica</a>,
    <a href="https://github.com/LBAB-Humboldt/workFlow/blob/master/verifGeo'.R" target="_blank" rel="noopener noreferrer">Verificación Taxonómica</a>.
  </li>
  <li>
    La información obtenida en el presente análisis no cuantifica el nivel de sesgo de la información obtenida, dado que el número de registros presente en un sector puede estar influenciado por su cercanía a vías, ríos u otras unidades político-administrativas.
  </li>
</ul>`;

export { SpeciesRecordsGapsTexts };
