import React from "react";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

import {
  transformPAValues,
  transformCoverageValues,
} from "pages/search/dashboard/ecosystems/transformData";
import matchColor from "utils/matchColor";

import {
  coverageType,
  Coverage,
  SEPADataExt,
  coverageLabels,
} from "pages/search/types/ecosystems";
import BackendAPI from "utils/backendAPI";
import SmallStackedBar from "pages/search/shared_components/charts/SmallStackedBar";
import { wrapperMessage } from "pages/search/types/charts";
import { EcosystemsController } from "pages/search/dashboard/EcosystemsController";
import { rasterLayer } from "pages/search/types/layers";

export interface PAData {
  area: number;
  label: string;
  key: string;
  percentage: number;
}
interface CoverageExt extends Coverage {
  key: coverageType;
  label: coverageLabels;
}
interface State {
  coverageData: Array<CoverageExt>;
  paData: Array<PAData>;
  stopLoad: boolean;
  messages: {
    coverage: wrapperMessage;
    pa: wrapperMessage;
  };
  layers: Array<rasterLayer>;
}

interface Props {
  SEValues: SEPADataExt;
}

class EcosystemDetails extends React.Component<Props, State> {
  mounted = false;
  EcosystemsController;
  constructor(props: Props) {
    super(props);
    this.EcosystemsController = new EcosystemsController();
    this.state = {
      coverageData: [],
      paData: [],
      stopLoad: false,
      messages: {
        coverage: "loading",
        pa: "loading",
      },
      layers: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { SEValues } = this.props;
    const { areaType, areaId } = this.context as SearchContextValues;
    const SEType = SEValues.type;
    const SEArea = SEValues.area;
    const { stopLoad } = this.state;

    const areaTypeId = areaType!.id;
    const areaIdId = areaId!.id.toString();

    this.EcosystemsController.setArea(areaTypeId, areaIdId);

    if (!stopLoad) {
      BackendAPI.requestSECoverageByGeofence(areaTypeId, areaIdId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState((prev) => ({
              coverageData: transformCoverageValues(res),
              messages: {
                ...prev.messages,
                coverage: null,
              },
            }));
          }
        })
        .catch(() => {
          this.setState((prev) => ({
            messages: {
              ...prev.messages,
              coverage: "custom",
            },
          }));
        });

      BackendAPI.requestSEPAByGeofence(areaTypeId, areaIdId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState((prev) => ({
              paData: transformPAValues(res, SEArea),
              messages: {
                ...prev.messages,
                pa: null,
              },
            }));
          }
        })
        .catch(() => {
          this.setState((prev) => ({
            messages: {
              ...prev.messages,
              pa: "custom",
            },
          }));
        });

      this.switchLayer(SEType);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.setState({
      stopLoad: true,
    });
  }

  render() {
    const { coverageData, paData, stopLoad, messages } = this.state;
    const { SEValues } = this.props;

    if (!stopLoad) {
      return (
        <div>
          <h3>
            Distribución de coberturas:
            <SmallStackedBar
              message={messages.coverage}
              customMessage="No hay información disponible de coberturas"
              data={coverageData}
              units="ha"
              colors={matchColor("coverage")}
              onClickGraphHandler={(selected) => {
                this.clickOnGraph(selected);
              }}
            />
          </h3>
          <h3>
            Distribución en áreas protegidas:
            <SmallStackedBar
              message={messages.pa}
              customMessage="Sin áreas protegidas"
              data={paData}
              units="ha"
              colors={matchColor("pa", true)}
            />
          </h3>
        </div>
      );
    }
    return null;
  }

  /**
   * Load layers according to the selected special ecosystem
   *  @param {string} SEType Special Ecosystem type
   */
  switchLayer = (SEType: string) => {
    const {
      setRasterLayers,
      setLoadingLayer,
      setShowAreaLayer,
      setLayerError,
      setMapTitle,
    } = this.context as SearchContextValues;

    setLoadingLayer(true);
    setRasterLayers([]);

    this.EcosystemsController.getCoveragesSELayer(SEType)
      .then((layers) => {
        this.setState({ layers: layers });

        if (this.mounted) {
          setRasterLayers(this.state.layers);
          setLoadingLayer(false);
          setShowAreaLayer(true);
          setMapTitle({
            name: `Coberturas - ${SEType}`,
          });
        }
      })
      .catch((e) => {
        if (e.toString() != "Error: request canceled") {
          setLayerError(e.toString());
        }
      });
  };

  /**
   * Set the selected layer to highlight
   *  @param {string} selectedKey Special Ecosystem type
   */
  clickOnGraph = (selectedKey: string) => {
    const { layers } = this.state;
    const { setRasterLayers } = this.context as SearchContextValues;

    setRasterLayers(
      layers.map((layer) => ({
        ...layer,
        selected: layer.id === selectedKey,
      }))
    );
  };
}

export default EcosystemDetails;
EcosystemDetails.contextType = SearchContext;
