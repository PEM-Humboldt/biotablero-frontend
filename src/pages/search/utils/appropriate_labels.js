module.exports = {
  SELabel: (val) => {
    switch (val) {
      case "paramo":
        return "Páramo";
      case "dryForest":
        return "Bosque Seco Tropical";
      case "wetland":
        return "Humedal";
      default:
        return val;
    }
  },
};
