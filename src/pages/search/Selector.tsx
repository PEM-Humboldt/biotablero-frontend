import { useContext, useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

import Accordion from "pages/search/Accordion";
import isFlagEnabled from "utils/isFlagEnabled";
import {
  ErrorMessage,
  LoadingMessage,
} from "pages/search/selector/selectorMessages";
import SearchAPI from "pages/search/utils/searchAPI";
import { AreaType } from "pages/search/types/dashboard";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import DrawPolygon from "pages/search/selector/DrawPolygon";
import SearchAreas from "pages/search/selector/SearchAreas";

interface Props {
  setShowDrawControl(show: boolean): void;
}

const Selector: React.FC<Props> = ({ setShowDrawControl }) => {
  const [drawPolygonFlag, setDrawPolygonFlag] = useState(true);
  const [areaTypes, setAreaTypes] = useState<Array<AreaType>>([]);
  const [areasError, setAreasError] = useState(false);
  const [polygonError, setPolygonError] = useState(false);
  const [isLoadingAreaTypes, setIsLoadingAreaTypes] = useState(true);


  const context = useContext(SearchContext);
  const {
    searchType,
    setSearchType,
    setAreaHa,
    setAreaId,
    setAreaType,
    setAreaLayer,
  } = context as SearchContextValues;

  useEffect(() => {
    isFlagEnabled("drawPolygon").then((value) => setDrawPolygonFlag(value));
    SearchAPI.requestAreaTypes()
      .then((result) => setAreaTypes(result))
      .catch(() => setAreasError(true))
      .finally(() => setIsLoadingAreaTypes(false));

    SearchAPI.requestTestBackend().catch(() => {
      setPolygonError(true);
      setShowDrawControl(false);
    });
  }, []);

  const sections = [
    {
      label: {
        id: "panel1-Geocerca",
        name: "Área de consulta",
        collapsed: !(searchType === "definedArea"),
      },
      component: areasError
        ? () => <ErrorMessage />
      : isLoadingAreaTypes
      ? () => <LoadingMessage />
      : areaTypes.length < 1
      ? () => <ErrorMessage empty={true} />
      : SearchAreas,
  componentProps: {
    areasList: areaTypes,
      },
    },
    {
      label: {
        id: "draw-polygon",
        name: "Dibujar polígono",
        icon: EditIcon,
        disabled: !drawPolygonFlag,
        collapsed: !(searchType === "drawPolygon"),
      },
      // TODO: Considerar move DrawPolygon aquí mismo o mover SearchAreas a otro archivo
      component: polygonError ? ErrorMessage : DrawPolygon,
    },
    {
      label: {
        id: "panel3",
        name: "Subir polígono",
        disabled: true,
      },
    },
  ];

  const onChange = (lvl: string, expTab: string) => {
    if (expTab === "panel1-Geocerca") {
      setSearchType("definedArea");
    } else if (expTab === "draw-polygon") {
      setSearchType("drawPolygon");
      setShowDrawControl(true);
    } else {
      setSearchType(null);
    }
    setAreaHa();
    setAreaId();
    setAreaType();
    setAreaLayer();
  };

  return (
    <div className="selector">
      <div className="description">
        <p>
          En esta sección podrás encontrar información sobre{" "}
          <b> ecosistemas </b>,<b>especies</b> y <b>paisaje</b>, de 3 distintas
          maneras:
        </p>
        <p>
          <i>1</i> Selecciona un <b>área de consulta</b> predeterminada
          (departamentos, jurisdicciones, etc.)
        </p>
        <p>
          <i>2</i> Dibuja un <b>polígono</b>
        </p>
        <p>
          <i>3</i> Sube tu propio <b>polígono</b> (usuarios registrados)
        </p>
      </div>
      <Accordion
        componentsArray={sections}
        classNameDefault="m0b"
        classNameSelected="m0b selector-expanded"
        level="1"
        handleChange={onChange}
      />
    </div>
  );
};

export default Selector;
