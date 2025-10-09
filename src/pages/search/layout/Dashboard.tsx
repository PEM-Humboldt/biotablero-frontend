import { useEffect, useState } from "react";
import BackIcon from "@mui/icons-material/FirstPage";
import Ecosistemas from "@mui/icons-material/Nature";
import Paisaje from "@mui/icons-material/FilterHdr";
// NOTE: No consumido en esta implementación
// import Especies from "@mui/icons-material/FilterVintage";

import { useSearchStateCTX } from "pages/search/hooks/SearchContext";
import Landscape from "pages/search/outlets/Landscape";
import Species from "pages/search/outlets/Species";
import Ecosystems from "pages/search/outlets/Ecosystems";
import formatNumber from "pages/search/utils/format";
import TabContainer from "pages/search/shared_components/TabContainer";

type DashboardProps = {
  goBackClick: () => void;
};

export function Dashboard({ goBackClick: handlerGoBack }: DashboardProps) {
  const { searchType, areaHa } = useSearchStateCTX();
  const [selectedIndex, setSelectedIndex] = useState(1); //TODO: Devolver el indice a 0 cuando este listo Ecosistemas en el backend de consultas

  useEffect(() => {
    if (searchType === "drawPolygon") {
      setSelectedIndex(1);
    }
  }, [searchType]);

  //TODO: Habilitar las secciones comentadas cuando se conecte el nuevo backend de consultas

  return (
    <div className="informer">
      <div className="drawer_header">
        <button className="geobtn" type="button" onClick={handlerGoBack}>
          <BackIcon />
        </button>
        <div className="HAgen">
          <h4>
            hectáreas totales
            <b>{`${formatNumber(areaHa || 0, 0)}`}</b>
          </h4>
        </div>
      </div>
      <TabContainer
        initialSelectedIndex={selectedIndex}
        titles={[
          //{ label: "Ecosistemas", icon: <Ecosistemas /> },
          { label: "Paisaje", icon: <Paisaje /> },
          // { label: "Especies", icon: <Especies />, showTab: false },
        ]}
      >
        <div>
          <Ecosystems />
        </div>
        <div>
          <Landscape />
        </div>
        <div>
          <Species />
        </div>
      </TabContainer>
    </div>
  );
}
