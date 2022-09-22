import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "utils/matchColor";
import SearchAPI from "utils/searchAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { hfPersistence } from "pages/search/types/humanFootprint";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";

const getLabel = {
  estable_natural: "Estable Natural",
  dinamica: "Dinámica",
  estable_alta: "Estable Alta",
};

interface hfPersistenceExt extends hfPersistence {
  label: string;
}

interface Props {}
interface persistenceHFState {
  showInfoGraph: boolean;
  hfPersistence: Array<hfPersistenceExt>;
  message: wrapperMessage;
  texts: {
    hfPersistence: textsObject;
  };
}

class PersistenceFootprint extends React.Component<Props, persistenceHFState> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      showInfoGraph: true,
      hfPersistence: [],
      message: "loading",
      texts: {
        hfPersistence: { info: "", cons: "", meto: "", quote: "" },
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;

    switchLayer("hfPersistence");

    SearchAPI.requestHFPersistence(areaId, geofenceId)
      .then((res: Array<hfPersistence>) => {
        if (this.mounted) {
          this.setState({
            hfPersistence: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
            message: null,
          });
        }
      })
      .catch(() => {
        this.setState({ message: "no-data" });
      });

    SearchAPI.requestSectionTexts("hfPersistence")
      .then((res) => {
        if (this.mounted) {
          this.setState({ texts: { hfPersistence: res } });
        }
      })
      .catch(() => {
        this.setState({
          texts: { hfPersistence: { info: "", cons: "", meto: "", quote: "" } },
        });
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Show or hide the detailed information on each graph
   */
  toggleInfoGraph = () => {
    this.setState((prevState) => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { areaId, geofenceId, handlerClickOnGraph } = this
      .context as SearchContextValues;
    const { showInfoGraph, hfPersistence, message, texts } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Interpretación">
            <InfoIcon
              className={`graphinfo${showInfoGraph ? " activeBox" : ""}`}
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {showInfoGraph && (
          <ShortInfo
            description={texts.hfPersistence.info}
            className="graphinfo2"
            collapseButton={false}
          />
        )}
        <h6>Estable natural, Dinámica, Estable alta</h6>
        <div>
          <LargeStackedBar
            data={hfPersistence}
            message={message}
            labelX="Hectáreas"
            labelY="Persistencia Huella Humana"
            units="ha"
            colors={matchColor("hfPersistence")}
            padding={0.25}
            onClickGraphHandler={(selected) =>
              handlerClickOnGraph({ selectedKey: selected })
            }
          />
        </div>
        <TextBoxes
          downloadData={hfPersistence}
          downloadName={`persistence_${areaId}_${geofenceId}.csv`}
          quoteText={texts.hfPersistence.quote}
          metoText={texts.hfPersistence.meto}
          consText={texts.hfPersistence.cons}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }
}

export default PersistenceFootprint;

PersistenceFootprint.contextType = SearchContext;
