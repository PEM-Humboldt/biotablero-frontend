const SCIHFTexts = {};

SCIHFTexts.info = `La integridad ecológica se refiere a la capacidad de un ecosistema para mantener su estructura, composición y funciones tomando como referencia su variabilidad histórica o natural
<a href="https://doi.org/10.1641/0006-3568(2003)053[0851:AWCWWS]2.0.CO;2" target="_blank" rel="noopener noreferrer">
  (Parrish et al. 2003).
</a>
La integridad se puede medir combinando información de la condición ecológica de los ecosistemas y las presiones a las que están expuestas. Las mediciones de integridad ecológica complementan los indicadores basados en área ya que evalúan el estado y calidad del ecosistema teniendo en cuenta otros parámetros adicionales a la cobertura o extensión, contribuyendo a medir el avance en conservación referentes a las metas Aichi 5, 14 y 15, y el Objetivo de Desarrollo Sostenible 15.`;

SCIHFTexts.meto = `El índice de Condición Estructural Forestal (ICE), mide la condición estructural de los bosques, y al combinarlo con información de presión humana genera el Índice de Integridad Estructural Forestal
<a href="https://doi.org/10.1038/s41597-019-0214-3" target="_blank" rel="noopener noreferrer">
  (Hansen et al. 2019, 2020).
</a>
El ICE se construyó a una escala de 30m cuantificando: i) el porcentaje de bosque al año 2010, ii) la altura del dosel para el año 2012, y iii) la pérdida de bosque en el periodo 2000-2017. El ICE se presenta en dos categorías: “Condición Baja a Moderada”  y “Condición Alta”. La condición alta representa áreas con más del 75% de cobertura de bosque, dosel de más de 15m de altura, y no presentan disturbios detectables durante el periodo 2000-2017
<a href="https://www.google.com/url?q=https://doi.org/10.1038/s41559-020-1274-7&sa=D&source=editors&ust=1621619748606000&usg=AOvVaw1L0dfh_7RCeOhXBH3To-U3" target="_blank" rel="noopener noreferrer">
  (Hansen et al 2020).
</a>
<br /><br />
Las categorías para medir la integridad estructural de los forestal para Colombia se construyó a una resolución de 300m, combinando el ICE y la persistencia del Índice de Huella Espacial Humana (IHEH) (Correa-Aymar 2020) 2020) (disponible en BioTablero). Esta aproximación integra el legado histórico de presiones humanas sobre los ecosistemas boscosos. La persistencia describe la dinámica del IHEH entre 1970 y 2018 en tres categorías: estable natural, dinámica y estable alta. La combinación de ICE (Bajo moderado y Alto) y persistencia IHEH (estable natural, dinámica y estable alta) genera seis categorías para medir la integridad. Para cada categoría se muestran las hectáreas en el área consultada, se visualizan en el mapa, y se presenta una barra con la proporción de áreas protegidas.
<br /><br />
Cada una de las seis categorías se puede asociar con acciones de manejo y conservación de la siguiente manera: <br />
<ol class="ul-padding-info-text">
  <li>
    ICE alto y persistencia estable natural: En áreas protegidas establecer incentivos comunitarios y gestión activa para mantener la protección de los bosques, y en áreas fuera de áreas protegidas gestionar acuerdos de conservación para expandir su protección.
  </li>
  <li>
    ICE alto y persistencia estable alta o dinámica: se debe trabajar para disminuir de manera urgente las presiones que puede estar afectando los bosques y gestionar acuerdos de conservación para garantizar y/o expandir su protección.
  </li>
  <li>
    ICE bajo y persistencia estable natural: se recomienda restaurar la estructura de los bosques mediante estrategias de restauración, agroforestería, control de pastoreo y quema de fuegos según necesidades particulares del territorio.
  </li>
  <li>
    ICE baja y persistencia dinámica o alta: se debe trabajar para disminuir de manera urgente las presiones que puede estar afectando los bosques e implementar iniciativas de restauración mediante educación y ciencia ciudadana.
  </li>
</ol>`;

SCIHFTexts.quote = `<p>
  El trabajo para la generación del ICE y del IIEF en Colombia es liderado por
  <a href="mailto:drodriguez@humboldt.org.co" target="_blank" rel="noopener noreferrer">
    Susana Rodríguez Buriticá
  </a>
  y colaboradores en el Instituto Humboldt.
  <br /><br />
</p>`;

SCIHFTexts.cons = `Al interpretar los resultados de este indicador se debe tener en cuenta que:
<ol class="ul-padding-info-text">
  <li>
    La resolución de las categorías que miden la integridad es de 300m por lo que es apropiado a escalas regionales y nacionales, para identificar patrones a nivel local se requiere información adicional.
  </li>
  <li>
    La información está calculada para el periodo 2000 a 2018, cambios posteriores a este periodo no están reflejados.
  </li>
  <li>
    El producto usado para definir la extensión de bosques es de carácter global y puede tener imprecisiones en algunos lugares. Por esta razón es recomendable mirar esta información en conjunto con otros indicadores de pérdida de bosques que presentan una distribución ajustada de éstos, como por ejemplo la extensión de bosques nacional presentado por el
    <a href="http://seinekan.ideam.gov.co/SMBYC/ApolloPro.aspx" target="_blank" rel="noopener noreferrer">
      IDEAM
    </a>
    y sus
    <a href="http://smbyc.ideam.gov.co/MonitoreoBC-WEB/reportes/paginaReportesBosqueNatural.jsp" target="_blank" rel="noopener noreferrer">
      datos y cifras.
    </a>
  </li>
  <li>
    Se recomienda leer este indicador en conjunto con otros indicadores como el de proporción de pérdida de bosques, conectividad de áreas protegidas, y verificaciones en campo que soporten las decisiones ambientales.
  </li>
</ol>`;

export { SCIHFTexts };

const LPTexts = {};

export { LPTexts };
