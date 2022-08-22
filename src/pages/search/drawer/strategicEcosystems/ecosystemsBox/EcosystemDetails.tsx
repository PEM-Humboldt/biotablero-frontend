import React from "react";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

import {
  transformPAValues,
  transformCoverageValues,
} from "pages/search/utils/transformData";
import GraphLoader from "components/charts/GraphLoader";
import matchColor from "utils/matchColor";

import { SEKey } from "pages/search/utils/appropriate_keys";
import {
  coverageType,
  SECoverage,
  EDValues,
} from "pages/search/types/ecosystems";
import SearchAPI from "utils/searchAPI";

const coverageLabels = ["Natural", "Secundaria", "Transformada"] as const;
export interface PAData {
  area: number;
  label: string;
  key: string;
  percentage: number;
}
interface CoverageValues extends SECoverage {
  key: typeof coverageType[number];
  label: typeof coverageLabels[number];
}
interface State {
  coverageData: Array<CoverageValues> | null;
  paData: Array<PAData> | null;
  stopLoad: boolean;
}

interface Props {
  SEValues: EDValues;
}
class EcosystemDetails extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      coverageData: null,
      paData: null,
      stopLoad: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { SEValues } = this.props;
    const { areaId, geofenceId, switchLayer } = this
      .context as SearchContextValues;
    const SEType = SEValues.type;
    const SEArea = SEValues.area;
    const { stopLoad } = this.state;

    if (!stopLoad) {
      SearchAPI.requestSECoverageByGeofence(areaId, geofenceId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ coverageData: transformCoverageValues(res) });
          }
        })
        .catch(() => {});

      SearchAPI.requestSEPAByGeofence(areaId, geofenceId, SEType)
        .then((res) => {
          if (this.mounted) {
            this.setState({ paData: transformPAValues(res, SEArea) });
          }
        })
        .catch(() => {});

      switchLayer(`seCoverages-${SEKey(SEType)}`);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.setState({
      stopLoad: true,
    });
  }

  render() {
    const { coverageData, paData, stopLoad } = this.state;
    const { SEValues } = this.props;
    const { handlerClickOnGraph } = this.context as SearchContextValues;
    if (!stopLoad) {
      return (
        <div>
          <h3>
            Distribución de coberturas:
            {!coverageData && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {coverageData && coverageData.length <= 0 && (
              <b>No hay información disponible de coberturas</b>
            )}
            {coverageData && coverageData.length > 0 && (
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={coverageData}
                units="ha"
                colors={matchColor("coverage")}
                onClickGraphHandler={(selected) => {
                  handlerClickOnGraph({
                    chartType: "seCoverage",
                    chartSection: SEKey(SEValues.type),
                    selectedKey: selected,
                  });
                }}
              />
            )}
          </h3>
          <h3>
            Distribución en áreas protegidas:
            {!paData && (
              <b>
                <br />
                Cargando información...
              </b>
            )}
            {paData && paData.length <= 0 && (
              <div>
                <b>Sin áreas protegidas</b>
              </div>
            )}
            {paData && paData.length > 0 && (
              <GraphLoader
                graphType="SmallBarStackGraph"
                data={paData}
                units="ha"
                colors={matchColor("pa", true)}
              />
            )}
          </h3>
        </div>
      );
    }
    return null;
  }
}

export default EcosystemDetails;
EcosystemDetails.contextType = SearchContext;
