import BackIcon from "@mui/icons-material/FirstPage";
import Ecosistemas from "@mui/icons-material/Nature";
import Especies from "@mui/icons-material/FilterVintage";
import Paisaje from "@mui/icons-material/FilterHdr";

import {
  useSearchDispatchCTX,
  useSearchStateCTX,
} from "pages/search/hooks/SearchContext";
import Landscape from "pages/search/dashboard/Landscape";
import TabContainer from "@ui/TabContainer";
import { Ecosystems } from "pages/search/dashboard/Ecosystems";
import { LayoutUpdated } from "core/layout/mainLayout/hooks/layoutReducer";
import { OpenReportEditorBtn } from "@ui/OpenReportEditorBtn";
import { SearchUpdated } from "pages/search/hooks/SearchReducer";
import { Species } from "pages/search/dashboard/Species";
import { formatNumber } from "@utils/format";
import { type UiManager } from "core/layout/MainLayout";
import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { useReport } from "@hooks/useReport";

export function Dashboard() {
  const searchState = useSearchStateCTX();
  const { addLeaveCallback, reportContextResolver } = useReport();
  const { layoutDispatch } = useOutletContext<UiManager>();
  const searchMapDispatch = useSearchDispatchCTX();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchState) {
      reportContextResolver(searchState);
    }
  }, [searchState, reportContextResolver]);

  useEffect(() => {
    return addLeaveCallback(() => {
      layoutDispatch({
        type: LayoutUpdated.HEADER_NAMES,
        newHeader: { title: "", subtitle: "" },
      });
      searchMapDispatch({ type: SearchUpdated.GO_BACK });
    });
  }, [addLeaveCallback, layoutDispatch, searchMapDispatch]);

  const handleGoBackClick = () => {
    void navigate({ pathname, search: "" }, { replace: true });
  };

  return (
    <div className="informer flex flex-col h-full min-h-0 overflow-hidden">
      <div className="drawer_header shrink-0">
        <button className="geobtn" type="button" onClick={handleGoBackClick}>
          <BackIcon />
        </button>
        <div className="HAgen">
          <h4>
            hectáreas totales
            <b>{`${formatNumber(searchState.areaHa || 0, 0)}`}</b>
          </h4>
        </div>
        <OpenReportEditorBtn />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-custom">
        <TabContainer
          initialSelectedIndex={0}
          titles={[
            { label: "Ecosistemas", icon: <Ecosistemas /> },
            { label: "Paisaje", icon: <Paisaje /> },
            { label: "Especies", icon: <Especies /> },
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
    </div>
  );
}
