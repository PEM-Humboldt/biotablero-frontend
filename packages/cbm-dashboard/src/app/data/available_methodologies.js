const methodologies = [
  {
    title: 'VALIDACIÓN DE COBERTURAS',
    options: [
      {
        id: '01_validacion_coberturas',
        name: 'Disturbios',
      },
    ],
    enabled: true,
  },
  {
    title: 'PARCELA DE VEGETACIÓN',
    options: [
      {
        id: '02_parcela_vegetacion',
        name: 'Hábito de crecimiento',
      },
    ],
    enabled: true,
  },
  {
    title: 'PUNTOS DE CONTEO',
    enabled: false,
  },
  {
    title: 'CÁMARAS TRAMPA',
    enabled: false,
  },
  {
    title: 'FLORACIÓN, FRUCTIFICACIÓN E INTERACCIÓN',
    enabled: false,
  },
  {
    title: 'MEDICIÓN DE LLUVIA',
    options: [
      {
        id: '06_medicion_lluvia',
        name: 'Precipitación diaria',
      },
    ],
    enabled: true,
  },
  {
    title: 'MEDICIÓN DE CAUDAL',
    enabled: false,
  },
];

export default methodologies;
