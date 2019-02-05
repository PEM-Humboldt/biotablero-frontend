/** eslint verified */

const filtersData = [
  {
    groupLabel: 'Filtros',
    groupDetailClass: 'filters',
    options: [
      {
        id: 'Metas',
        label: 'Metas',
        detailClass: 'metas',
        options: [
          {
            type: 'button',
            label: 'Aichi 5',
            dataToolTip: 'Meta Aichi 5 · Pérdida, degradación y fragmentación - Para 2020 se habrá reducido por lo menos a la mitad y, donde resulte factible, se habrá reducido hasta un valor cercano a cero el ritmo de pérdida de todos los hábitats naturales, incluidos los bosques, y se habrá reducido de manera significativa la degradación y fragmentación.',
          },
          {
            type: 'button',
            label: 'Aichi 11',
            dataToolTip: 'Meta Aichi 11 · Áreas protegidas - Para 2020, al menos el 17 por ciento de las zonas terrestres y de aguas continentales y el 10 por ciento de las zonas marinas y costeras, especialmente aquellas de particular importancia para la diversidad biológica y los servicios de los ecosistemas, se conservan por medio de sistemas de áreas protegidas administrados de manera eficaz y equitativa, ecológicamente representativos y bien conectados y otras medidas de conservación eficaces basadas en áreas, y están integradas en los paisajes terrestres y marinos más amplios.',
          },
          {
            type: 'button',
            label: 'Aichi 12',
            dataToolTip: 'Meta Aichi 12 · Especies amenazadas - Para 2020, se habrá evitado la extinción de especies en peligro identificadas y su estado de conservación se habrá mejorado y sostenido, especialmente para las especies en mayor declive.',
          },
          {
            type: 'button',
            label: 'Aichi 14',
            dataToolTip: 'Meta Aichi 14 · Ecosistemas estratégicos - Para 2020, se han restaurado y salvaguardado los ecosistemas que proporcionan servicios esenciales, incluidos servicios relacionados con el agua, y que contribuyen a la salud, los medios de vida y el bienestar, tomando en cuenta las necesidades de las mujeres, las comunidades indígenas y locales y los pobres y vulnerables.',
          },
          {
            type: 'button',
            label: 'Aichi 19',
            dataToolTip: 'Meta Aichi 19 · Conocimiento - Para 2020, se habrá avanzado en los conocimientos, la base científica y las tecnologías referidas a la diversidad biológica, sus valores y funcionamiento, su estado y tendencias y las consecuencias de su pérdida, y tales conocimientos y tecnologías serán ampliamente compartidos, transferidos y aplicados.',
          },
          {
            type: 'button',
            label: 'ODS 2.5',
            dataToolTip: 'Meta ODS 2.5 · Diversidad genética parientes silvestres - Para 2020 mantener la diversidad genética de las semillas, plantas cultivadas, animales de granja y domesticados y de las especies silvestres relacionadas, a través de la correcta gestión de bancos diversificados de semillas y plantas a nivel nacional, regional e internacional, y asegurar el acceso y la distribución justa y equitativa de los beneficios derivados de la utilización de los recursos genéticos y los conocimientos tradicionales asociados según lo acordado internacionalmente.',
          },
          {
            type: 'button',
            label: 'ODS 15.1',
            dataToolTip: 'Meta ODS 15.1 · Ecosistemas estratégicos - En 2020 asegurar la conservación, restauración y uso sostenible de los ecosistemas de agua dulce terrestres e interiores y de sus servicios, en particular los bosques, los humedales, las montañas y las tierras secas, en conformidad con las obligaciones en virtud de los acuerdos internacionales.',
          },
          {
            type: 'button',
            label: 'ODS 15.4',
            dataToolTip: 'Meta ODS 15.4 · Ecosistemas de montaña - En 2030 asegurar la preservación de los ecosistemas de montaña, incluyendo su biodiversidad, para mejorar su capacidad para proporcionar beneficios que son esenciales para el desarrollo sostenible.',
          },
          {
            type: 'button',
            label: 'ODS 15.5',
            dataToolTip: 'Meta ODS 15.5 · Degradación, pérdida y especies amenazadas - Tomar medidas urgentes y significativas para reducir la degradación del hábitat natural, detener la pérdida de biodiversidad, y en 2020 de proteger y evitar la extinción de especies amenazadas.',
          },
          {
            type: 'button',
            label: 'Mínimo de Biodiversidad',
            dataToolTip: 'Estos son los indicadores seleccionados por la mesa de Biodiversidad, liderada por el MADS y con participación de los Institutos de Investigación del SINA y el ANLA durante el 2016, como aquellos indicadores mínimos que deben ser generados periódicamente por el sector ambiental.',
          },
          {
            type: 'button',
            label: 'Plan Estadístico Nacional',
            dataToolTip: 'Estos indicadores corresponden a operaciones estadísticas propuesta en actual Plan Estadístico Nacional 2017-20122 coordinado por el DANE y que constituye el principal instrumento de política que busca garantizar que el país cuente con una oferta estadística suficiente y robusta para entender su realidad económica, sociodemográfica y ambiental.',
          },
        ],
      },
      {
        id: 'perb',
        label: 'PERB',
        detailClass: 'perb',
        options: [
          {
            type: 'button',
            label: 'presion',
            dataToolTip: 'PERB - Presión',
          },
          {
            type: 'button',
            label: 'estado',
            dataToolTip: 'PERB - Estado',
          },
          {
            type: 'button',
            label: 'respuesta',
            dataToolTip: 'PERB - Respuesta',
          },
          {
            type: 'button',
            label: 'beneficio',
            dataToolTip: 'PERB - Beneficio',
          },
        ],
      },
      {
        id: 'ecospp',
        label: 'Ecosistemas y especies',
        detailClass: 'ecospp',
        options: [
          {
            type: 'button',
            label: 'Ecosistemas Cobertura',
            dataToolTip: 'Ecosistemas y especies - Ecosistemas Cobertura',
          },
          {
            type: 'button',
            label: 'Ecosistemas Áreas Protegídas',
            dataToolTip: 'Ecosistemas y especies - Ecosistemas Áreas Protegídas',
          },
          {
            type: 'button',
            label: 'Ecosistemas humedales',
            dataToolTip: 'Ecosistemas y especies - Ecosistemas humedales',
          },
          {
            type: 'button',
            label: 'Especies',
            dataToolTip: 'Ecosistemas y especies - Especies',
          },
          {
            type: 'button',
            label: 'Especies amenazadas',
            dataToolTip: 'Ecosistemas y especies - Especies amenazadas',
          },
          {
            type: 'button',
            label: 'Especies invasoras',
            dataToolTip: 'Ecosistemas y especies - Especies invasoras',
          },
        ],
      },
    ],
  },
];

// const thumbnailsData = ['Hola'];
const thumbnailsData = [
  {
    id: 'aichi5',
    label: 'Aichi 5',
    dataToolTip: 'Meta Aichi 5 · Pérdida, degradación y fragmentación - Para 2020 se habrá reducido por lo menos a la mitad y, donde resulte factible, se habrá reducido hasta un valor cercano a cero el ritmo de pérdida de todos los hábitats naturales, incluidos los bosques, y se habrá reducido de manera significativa la degradación y fragmentación.',
    disabled: false,
    thumbnails: [
      {
        title: 'Porcentaje de cobertura boscosa',
        description: 'Forest area as a percentage of total land area (proposed indictor for SDG target 15.1)',
        period: '1990 - 2014',
        filters: ['aichi5', 'estado', 'ecospp-cobertura'],
      },
      {
        title: 'Porcentaje de cobertura natural',
        description: 'Natural habitat extent (land area minus urban and agriculture)',
        period: '2005 - 2012',
        filters: ['aichi5', 'estado', 'ecospp-cobertura'],
      },
      {
        title: '',
        description: '',
        period: '',
        filters: [''],
      },
    ],
  },
];

export { filtersData, thumbnailsData };
