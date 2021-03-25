import Papa from 'papaparse';
import regLluviaCsv from './registros_lluvia';
import disturbiosCsv from './disturbios';
import habCrecimientoCsv from './habito_crecimiento';

const graphData = {
  reg_diarios: regLluviaCsv,
  disturbios: disturbiosCsv,
  habito_crecimiento: habCrecimientoCsv,
};

const processRegLluvia = (rawData) => {
  const lines = {};
  rawData.forEach((row) => {
    if (!lines[row.vereda_name]) lines[row.vereda_name] = { x: [], y: [] };
    lines[row.vereda_name].x.push(row.fecha_id);
    lines[row.vereda_name].y.push(row.precipitacion);
  });
  return lines;
};

const processDisturbios = (rawData) => {
  const result = { values: [], labels: [] };
  rawData.forEach((row) => {
    result.values.push(row.disturbio_n);
    result.labels.push(row.disturbio_categ_lab);
  });
  return result;
};

const processHabCrecimiento = (rawData) => {
  const bars = {};
  rawData.forEach((row) => {
    if (!bars[row.habito_de_crecimiento_categ_lab]) {
      bars[row.habito_de_crecimiento_categ_lab] = { x: [], y: [] };
    }
    bars[row.habito_de_crecimiento_categ_lab].x.push(row.fecha_id);
    bars[row.habito_de_crecimiento_categ_lab].y.push(
      parseFloat(row.habito_de_crecimiento_prop.replace(/,/g, '.'))
    );
  });
  return bars;
};

const graphProcess = {
  reg_diarios: processRegLluvia,
  disturbios: processDisturbios,
  habito_crecimiento: processHabCrecimiento,
};

const loadCsv = (graphName) => {
  const csvFile = graphData[graphName];
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          return reject(errors.reduce((acc, cv) => acc + cv.message, ''));
        }
        return resolve(graphProcess[graphName](data));
      },
      error: reject,
    });
  });
};

export default loadCsv;
