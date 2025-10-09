import React from "react";
import InfoIcon from "@mui/icons-material/Info";

import {
  SearchLegacyCTX,
  type LegacyContextValues,
} from "pages/search/hooks/SearchContext";
import { ShortInfo } from "core/composites/ShortInfo";
import { IconTooltip } from "pages/search/ui/Tooltips";
import matchColor from "pages/search/utils/matchColor";
import BackendAPI from "pages/search/api/backendAPI";
import TextBoxes from "pages/search/ui/TextBoxes";

import { hfPersistence } from "pages/search/types/humanFootprint";
import { textsObject } from "pages/search/types/texts";
import LargeStackedBar from "pages/search/shared_components/charts/LargeStackedBar";
import { wrapperMessage } from "pages/search/types/charts";
import { ShapeLayer } from "pages/search/types/layers";
import { PersistenceFootprintController } from "pages/search/outlets/landscape/humanFootprint/PersistenceFootprintController";

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
  layers: Array<ShapeLayer>;
}

class PersistenceFootprint extends React.Component<Props, persistenceHFState> {
  static contextType = SearchLegacyCTX;
  mounted = false;
  componentName = "hfPersistence";
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
      setLayerError,
      setMapTitle,
    } = this.context as LegacyContextValues;

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

    setLoadingLayer(true);

    this.PersistenceHFController.getLayer()
      .then((hfPersistence) => {
        if (this.mounted) {
          this.setState(
            () => ({ layers: [hfPersistence] }),
            () => setLoadingLayer(false),
          );
          setShapeLayers(this.state.layers);
          setMapTitle({ name: "HH - Persistencia" });
        }
      })
      .catch((error) => setLayerError(error));
  }

  componentWillUnmount() {
    this.mounted = false;
    this.PersistenceHFController.cancelActiveRequests();
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
    const { areaType, areaId } = this.context as LegacyContextValues;
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
    const { setShapeLayers } = this.context as LegacyContextValues;
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
