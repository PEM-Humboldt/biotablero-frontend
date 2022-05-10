const currentHFTexts = {};

currentHFTexts.info = `El valor de la Huella Humana en el área de consulta se calcula a partir del valor promedio del IHEH. La gráfica muestra la proporción de área bajo las categorías Natural, Baja, Media y Alta del IHEH. Cada color representa una categoría y corresponde a los colores desplegados en el mapa.
<br /><br />
Una mayor proporción del IHEH media o alta representa áreas influenciadas en mayor medida por las actividades antrópicas, mientras que áreas con una mayor proporción de IHEH natural o baja mantienen condiciones de naturalidad importantes de conservar.`;

currentHFTexts.quote = `El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en: Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>
<br /><br />
El mapa con el IHEH a una resolución de 300 metros se encuentra disponible en
<a href="http://geonetwork.humboldt.org.co/geonetwork/srv/spa/catalog.search#/metadata/e29b399c-24ee-4c16-b19c-be2eb1ce0aae" target="_blank" rel="noopener noreferrer">
  Geonetwork IAvH.
</a>`;

currentHFTexts.meto = 'El Índice de Huella Espacial Humana (IHEH) cuantifica la magnitud de la influencia acumulada de las actividades antrópicas sobre los paisajes y ecosistemas; éste tiene un valor de 0 a 100 indicando en orden ascendente el grado de impacto humano. EL IHEH se clasifica en Natural (IHEH de 0 - 15), Bajo (IHEH = 15 - 40), Medio (IHEH= 40 - 60) y Alto (IHEH > 60). El IHEH se generó para Colombia a una resolución de 300 m y se calcula a partir de la intensidad del uso medida por: 1) tipo de uso, 2) densidad de población, 3) distancia a ríos, 4) distancia a asentamientos, 5) índice de fragmentación e 6) índice de biomasa relativo al potencial natural. Adicionalmente considera el tiempo de intervención medido en años';

currentHFTexts.cons = `Al momento de interpretar los valores del IHEH se debe tener en cuenta que:
<ul class="ul-padding-info-text">
  <li>
    La falta de información detallada de actividades económicas, establecimiento de estructuras humanas como antenas, zonas de basuras, minería, suelo para agricultura, datos de caza, entre otros, pueden subestimar los valores del índice es regiones como la Orinoquía, Pacífico y Amazonas.
  </li>
  <li>
    El IHEH ahora se enfoca en ecosistemas terrestres, el componente sobre ecosistemas dulceacuícolas debe ser fortalecido.
  </li>
</ul>`;

export { currentHFTexts };

const persistenceHFTexts = {};

persistenceHFTexts.info = `Los valores de persistencia del IHEH pueden guiar las estrategias de conservación de manera diferencial sobre el territorio. Estrategias con enfoque de preservación sobre lugares con categoría estable natural, ya que representan un bajo impacto humano a través del tiempo; de restauración sobre áreas con IHEH dinámica; o estrategias de uso sostenible sobre regiones en categoría estable alta, las cuales tradicionalmente han tenido una intensidad de transformación.
<br /><br />
La gráfica muestra la proporción de área bajo las categorías Estable Alta (color rojo en gráfica y mapa), Dinámica (color ocre) y Estable Natural (color verde). Cada color representa una categoría y corresponde a los colores desplegados en el mapa.`;

persistenceHFTexts.quote = `El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en: Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>`;

persistenceHFTexts.meto = 'El IHEH se calculó para los años 1970, 1990, 2000, 2015 y 2018. Se identifican los sitios en los que para todos los años el IHEH ha persistido en categoría alta o estable natural, y donde ha sido dinámico, con categorías alta, media y baja.';

export { persistenceHFTexts };

export const timelineHFText = `Con base en los valores promedio del IHEH para 1970, 1990, 2000, 2015 y 2018 se caracterizó la dinámica de la Huella Humana en los ecosistemas estratégicos y se compara con el valor del área consultada. Si la gráfica presenta las curvas para alguno de los ecosistemas estratégicos (líneas amarilla, azul o verde) por encima de la línea negra, se interpreta que para el área seleccionada la magnitud de la influencia acumulada de las actividades antrópicas ha sido mayor en un determinado ecosistema estratégico en comparación con otros ecosistemas presentes en el área consultada. Esto quiere decir que sobre los ecosistemas estratégicos se presentan más presiones que sobre otros ecosistemas en el área, lo que se puede interpretar como una mayor demanda de los servicios ecosistémicos que prestan y sobre los cuales se deben generar estrategias de uso sostenible si se quiere seguir aprovechando los beneficios derivados de su uso.
<br /><br />
El trabajo del IHEH es liderado por <a href="mailto:ccorrea@humboldt.org.co" target="_blank">Camilo Correa-Ayram</a> y colaboradores en el Instituto Humboldt. Mayor información puede ser obtenida en:
Ayram, C. et al. Spatiotemporal evaluation of the human footprint in Colombia: Four decades of anthropic impact in highly biodiverse ecosystems. Ecol. Indic. 117, 106630 (2020).
<a href="https://www.sciencedirect.com/science/article/abs/pii/S1470160X20305677?via%3Dihub" target="_blank" rel="noopener noreferrer">
  Ver articulo.
</a>
`;
