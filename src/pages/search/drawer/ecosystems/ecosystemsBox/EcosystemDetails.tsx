import React from "react";
import SearchContext, { SearchContextValues } from "pages/search/SearchContext";

import {
  transformPAValues,
  transformCoverageValues,
} from "pages/search/drawer/ecosystems/transformData";
import matchColor from "utils/matchColor";

import { SEKey } from "pages/search/utils/appropriate_keys";
import {
  coverageType,
  Coverage,
  SEPADataExt,
  coverageLabels,
} from "pages/search/types/ecosystems";
import SearchAPI from "utils/searchAPI";
import SmallStackedBar from "pages/search/shared_components/charts/SmallStackedBar";
import { wrapperMessage } from "pages/search/types/charts";

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
}

interface Props {
  SEValues: SEPADataExt;
}
class EcosystemDetails extends React.Component<Props, State> {
  mounted = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      coverageData: [],
      paData: [],
      stopLoad: false,
      messages: {
        coverage: "loading",
        pa: "loading",
      },
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

      SearchAPI.requestSEPAByGeofence(areaId, geofenceId, SEType)
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
    const { coverageData, paData, stopLoad, messages } = this.state;
    const { SEValues } = this.props;
    const { handlerClickOnGraph } = this.context as SearchContextValues;
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
                handlerClickOnGraph({
                  chartType: "seCoverage",
                  chartSection: SEKey(SEValues.type),
                  selectedKey: selected,
                });
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
}

export default EcosystemDetails;
EcosystemDetails.contextType = SearchContext;
