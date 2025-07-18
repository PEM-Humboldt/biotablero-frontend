  /**
   * Transform timeline data to fit in the csv download structure
   * @param {array} data data to be transformed
   *
   * @returns {array} data transformed
   */
  const processDataCsv = (data) => {
    if (!data) return [];
    const transformedData = [];
    data.forEach((obj) => {
      obj.data.forEach((values) => {
        transformedData.push({
          key: obj.key,
          x: values.x,
          y: values.y,
        });
      });
    });
    return transformedData;
  };

export default processDataCsv;
