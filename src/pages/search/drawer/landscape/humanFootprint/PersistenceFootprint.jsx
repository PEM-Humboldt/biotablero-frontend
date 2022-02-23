import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import SearchContext from 'pages/search/SearchContext';
import { persistenceHFText } from 'pages/search/drawer/landscape/InfoTexts';
import GraphLoader from 'components/charts/GraphLoader';
import ShortInfo from 'components/ShortInfo';
import { IconTooltip } from 'components/Tooltips';
import matchColor from 'utils/matchColor';
import RestAPI from 'utils/restAPI';
import DownloadCSV from 'components/DownloadCSV';

const getLabel = {
  estable_natural: 'Estable Natural',
  dinamica: 'Dinámica',
  estable_alta: 'Estable Alta',
};

class PersistenceFootprint extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      hfPersistence: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;
    RestAPI.requestHFPersistence(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState({
            hfPersistence: res.map((item) => ({
              ...item,
              label: getLabel[item.key],
            })),
          });
        }
      })
      .catch(() => {});
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
    const {
      areaId,
      geofenceId,
      handlerClickOnGraph,
    } = this.context;
    const { showInfoGraph, hfPersistence } = this.state;
    return (
      <div className="graphcontainer pt6">
        <h2>
          <IconTooltip title="Acerca de esta sección">
            <InfoIcon
              className="graphinfo"
              onClick={() => this.toggleInfoGraph()}
            />
          </IconTooltip>
        </h2>
        {(
          showInfoGraph && (
            <ShortInfo
              description={persistenceHFText}
              className="graphinfo2"
              collapseButton={false}
            />
          )
        )}
        <h6>
          Estable natural, Dinámica, Estable alta
        </h6>
        {(hfPersistence && hfPersistence.length > 0) && (
          <DownloadCSV
            data={hfPersistence}
            filename={`bt_hf_persistence_${areaId}_${geofenceId}.csv`}
          />
        )}
        <div>
          <GraphLoader
            graphType="LargeBarStackGraph"
            data={hfPersistence}
            labelX="Hectáreas"
            labelY="Persistencia Huella Humana"
            units="ha"
            colors={matchColor('hfPersistence')}
            padding={0.25}
            onClickGraphHandler={(selected) => handlerClickOnGraph({ selectedKey: selected })}
          />
        </div>
      </div>
    );
  }
}

export default PersistenceFootprint;

PersistenceFootprint.contextType = SearchContext;
