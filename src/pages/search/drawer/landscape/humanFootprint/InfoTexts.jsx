const currentHFTexts = {};

currentHFTexts.info = `El Índice de Huella Espacial Humana -IHEH- cuantifica la magnitud de la
influencia acumulada de las actividades antrópicas sobre los paisajes y ecosistemas. Varía de 0 a
100 indicando en orden ascendente el grado de impacto humano. En la gráfica se muestra el porcetaje
de área bajo las categorías Natural (IHEH de 0 - 15, verde), Bajo (IHEH = 15 - 40, amarillo), Medio
(IHEH= 40 - 60, naranja) y Alto (IHEH > 60, rojo). Una mayor proporción del IHEH medio o alto en el
área de consulta representa una mayor presión de actividades antrópicas, mientras una mayor
proporción de IHEH natural o bajo representa áreas con condiciones naturales importantes de
conservar.
`;

currentHFTexts.meto = `El Índice de Huella Espacial Humana (IHEH) actual
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  (Correa-Ayram et al. 2020)
</a> se generó a una resolución de 300 m para el año 2018 cuantificando la intensidad de las
actividades antrópicas medida a través de: 1) tipo de uso, 2) densidad de población, 3) distancia a
ríos, 4) distancia a asentamientos, 5) índice de fragmentación y 6) índice de biomasa relativo al
potencial natural. El IHEH en el área consultada se calcula a partir de su valor promedio.
`;

currentHFTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en cuenta:
<ul class="ul-padding-info-text">
  <li>
    La falta de información detallada de actividades económicas, establecimiento de estructuras
    humanas como antenas, zonas de basuras, minería, suelo para agricultura, datos de caza, entre
    otros, pueden subestimar los valores del índice en regiones como la Orinoquía, Pacífico y
    Amazonas.
  </li>
  <li>
    Actualmente el Índice de Huella Espacial Humana (IHEH) se enfoca en ecosistemas terrestres, el
    componente sobre ecosistemas dulceacuícolas debe ser fortalecido.
  </li>
  <li>
    El IHEH se construyó con información a 2018, es una muestra aproximada de este año y no da
    cuenta del estado actual de la intensidad de las actividades antrópicas.
  </li>
  <li>
    El IHEH fue construido a una resolución de 300 m, que resulta idónea para análisis regionales y
    nacionales.
  </li>
</ul>
`;

currentHFTexts.quote = `El Índice de Huella Espacial Humana (IHEH) fue construido por
<a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a>
y colaboradores (
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  2020
</a>
) y puede descargarse desde el
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer">
  Repositorio Geográfico del Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-
</a>
.
`;

export { currentHFTexts };

const persistenceHFTexts = {};

persistenceHFTexts.info = `La persistencia del Índice de Huella Espacial Humana (IHEH) identifica
las áreas donde el IHEH se ha mantenido en categoría estable alta (rojo), estable natural (verde),
o dinámica (donde ha sufrido transiciones entre distintas categorías) (ocre). Los valores de
persistencia del IHEH pueden guiar las estrategias de conservación de manera diferencial.
Estrategias de preservación serían ideales sobre lugares con categoría estable natural ya que
representan un bajo impacto humano a través del tiempo. La restauración es viable sobre áreas con
IHEH dinámica, mientras que estrategias de uso sostenible son preferibles sobre regiones en
categoría estable alta debido a que tradicionalmente han tenido una intensidad de transformación
mayor.
`;

persistenceHFTexts.meto = `La persistencia del Índice de Huella Espacial Humana (IHEH) se calculó
para los años 1970, 1990, 2000, 2015 y 2018. Aquellas áreas que con valores en categoría alta del
IHEH (> 60) durante el periodo de análisis fueron categorizadas como persistencia estable alta,
mientras que aquellas con valores en categoría natural (0 - 15) se consideraron con persistencia
estable natural. Las áreas que sufrieron transiciones entre otras categorías del IHEH se
consideraron como de persistencia dinámica.`;

persistenceHFTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<ul class="ul-padding-info-text">
  <li>
    Todas las consideraciones del Índice de Huella Espacial Humana (IHEH) actual.
  </li>
</ul>
`;

persistenceHFTexts.quote = `El Índice de Huella Espacial Humana (IHEH) fue construido por
<a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a>
y colaboradores (
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  2020
</a>
) y puede descargarse desde el
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer">
  Repositorio Geográfico del Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-
</a>
.
`;

export { persistenceHFTexts };

const timelineHFTexts = {};

timelineHFTexts.info = `El Índice de Huella Espacial Humana (IHEH) histórico caracteriza la dinámica
de la huella humana a través de los ecosistemas estratégicos (curvas violeta, azul o verde)
comparándolos con el valor promedio del IHEH del área de consulta (línea negra). Si alguna de las
curvas de los ecosistemas se encuentra por encima de la línea negra, se puede interpretar que este
ecosistema presenta más presiones antrópicas que otros ecosistemas dentro de la misma área de
consulta, así como una mayor demanda de los servicios ecosistémicos. Sobre estos ecosistemas se
deberían generar estrategias de uso sostenible para continuar el aprovechamiento de los beneficios
derivados de su uso.`;

timelineHFTexts.meto = `Se calculó el valor promedio del Índice de Huella Espacial Humana (IHEH)
para 1970, 1990, 2000, 2015 y 2018 dentro del área consultada y la distribución de los ecosistemas
de
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a> y<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales.
</a>
`;

timelineHFTexts.cons = `Al interpretar las cifras e indicadores presentados se debe tener en
cuenta:
<ul class="ul-padding-info-text">
  <li>
    Todas las consideraciones del Índice de Huella Espacial Humana (IHEH) actual.
  </li>
</ul>
`;

timelineHFTexts.quote = `El Índice de Huella Espacial Humana (IHEH) fue construido por
<a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a>
y colaboradores (
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  2020
</a>
). La distribución de los ecosistemas de
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo
</a>
,
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales
</a>
fue construida por el Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I.
Humboldt-. El IHEH para cada año y las capas de los ecosistemas estratégicos pueden descargarse
desde el
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer">
  Repositorio Geográfico del Instituto de Investigación de Recursos Biológicos Alexander von Humboldt -I. Humboldt-
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  (IHEH,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/c9a5d546-33b5-41d6-a60e-57cfae1cff82" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Páramo,
</a>
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/6ccd867c-5114-489f-9266-3e5cf657a375" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Bosque Seco Tropical
</a>
y
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/d68f4329-0385-47a2-8319-8b56c772b4c0" target="_blank" rel="noopener noreferrer" style={{ color: '#51b4c1' }}>
  Humedales).
</a>
`;

export { timelineHFTexts };
