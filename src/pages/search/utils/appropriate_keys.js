module.exports = {
  SEKey: (val) => {
    switch (val) {
      case 'Páramo':
        return 'paramo';
      case 'Bosque Seco Tropical':
        return 'dryForest';
      case 'Humedal':
        return 'wetland';
      default:
        return val;
    }
  },
};
