import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import ShortInfo from "components/ShortInfo";
import { IconTooltip } from "pages/search/shared_components/Tooltips";
import matchColor from "utils/matchColor";
import BackendAPI from "utils/backendAPI";
import TextBoxes from "pages/search/shared_components/TextBoxes";

import { hfPersistence } from "pages/search/types/humanFootprint";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";
import { shapeLayer } from "pages/search/types/layers";
import { PersistenceFootprintController } from "pages/search/dashboard/landscape/humanFootprint/PersistenceFootprintController";

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
  layers: Array<shapeLayer>;
}

class PersistenceFootprint extends React.Component<Props, persistenceHFState> {
  mounted = false;
  PersistenceHFController;

  constructor(props: Props) {
    super(props);
    this.PersistenceHFController = new PersistenceFootprintController();
    this.state = {
      showInfoGraph: true,
      hfPersistence: [],
      message: "loading",
      texts: {
        hfPersistence: { info: "", cons: "", meto: "", quote: "" },
      },
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaType,
      areaId,
      setShapeLayers,
      setLoadingLayer,
      setMapTitle: setActiveLayer,
    } = this.context as SearchContextValues;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.PersistenceHFController.setArea(areaTypeId, areaIdId);

    BackendAPI.requestHFPersistence(areaTypeId, areaIdId)
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

    BackendAPI.requestSectionTexts("hfPersistence")
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

    setLoadingLayer(true, false);

    const newActiveLayer = {
      id: "hfPersistence",
      name: "HH - Persistencia",
    };

    this.PersistenceHFController.getLayer()
      .then((hfPersistence) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [hfPersistence] }),
            () => setLoadingLayer(false, false)
          );
          setShapeLayers(this.state.layers);
          setActiveLayer(newActiveLayer);
        }
      })
      .catch(() => setLoadingLayer(false, true));
  }

  componentWillUnmount() {
    this.mounted = false;
    const { setShapeLayers } = this.context as SearchContextValues;
    this.PersistenceHFController.cancelActiveRequests();
    setShapeLayers([]);
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
    const { areaType, areaId } = this.context as SearchContextValues;
    const { showInfoGraph, hfPersistence, message, texts } = this.state;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

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
            description={`<p>${texts.hfPersistence.info}</p>`}
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
            onClickGraphHandler={(selected) => this.highlightFeature(selected)}
          />
        </div>
        <TextBoxes
          downloadData={hfPersistence}
          downloadName={`persistence_${areaTypeId}_${areaIdId}.csv`}
          quoteText={texts.hfPersistence.quote}
          metoText={texts.hfPersistence.meto}
          consText={texts.hfPersistence.cons}
          isInfoOpen={showInfoGraph}
          toggleInfo={this.toggleInfoGraph}
        />
      </div>
    );
  }

  /**
   * Highlight an specific feature of the Persistence Human Footprint layer
   *
   * @param {string} selectedKey Id of the feature
   */
  highlightFeature = (selectedKey: string) => {
    const { setShapeLayers } = this.context as SearchContextValues;
    const { layers } = this.state;
    const highlightedLayers = layers.map((layer) => {
      if (layer.id === "hfPersistence") {
        layer.layerStyle =
          this.PersistenceHFController.setLayerStyle(selectedKey);
      }
      return layer;
    });
    setShapeLayers(highlightedLayers);
  };
}

export default PersistenceFootprint;

PersistenceFootprint.contextType = SearchContext;
