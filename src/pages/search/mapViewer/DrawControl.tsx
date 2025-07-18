import { useContext } from "react";

import "leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import matchColor from "pages/search/utils/matchColor";

const DrawControl = () => {
  const context = useContext(SearchContext);
  const { onEditControlMounted } = context as SearchContextValues;
  return (
    <FeatureGroup>
      <EditControl
        onMounted={onEditControlMounted}
        draw={{
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: "#e84a5f",
              message:
                "<strong>No se permite polígonos con intersecciones<strong>",
            },
            shapeOptions: {
              color: matchColor("polygon")(),
              opacity: 0.8,
              clickable: true,
            },
          },
        }}
        position="topleft"
      />
    </FeatureGroup>
  );
};

export default DrawControl;
