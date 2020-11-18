import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { IconTooltip } from '../../commons/tooltips';
import GraphLoader from '../../charts/GraphLoader';
import matchColor from '../../commons/matchColor';
import RestAPI from '../../api/RestAPI';
import SearchContext from '../../SearchContext';
import ShortInfo from '../../commons/ShortInfo';

class ForestIntegrity extends React.Component {
  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showInfoGraph: false,
      SciHfCats: {
        'alta-estable_alta': {
          id: 'alta-estable_alta',
          label: 'SCI Alto - HH Alta',
          value: 0,
          color: matchColor('SciHf')('alta-estable_alta'),
        },
        'alta-dinamica': {
          id: 'alta-dinamica',
          label: 'SCI Alto - HH Dinámica',
          value: 0,
          color: matchColor('SciHf')('alta-dinamica'),
        },
        'alta-estable_baja': {
          id: 'alta-estable_baja',
          label: 'SCI Alto - HH Baja',
          value: 0,
          color: matchColor('SciHf')('alta-estable_baja'),
        },
        'moderada-estable_alta': {
          id: 'moderada-estable_alta',
          label: 'SCI Moderado - HH Alta',
          value: 0,
          color: matchColor('SciHf')('moderada-estable_alta'),
        },
        'moderada-dinamica': {
          id: 'moderada-dinamica',
          label: 'SCI Moderdo - HH Dinámica',
          value: 0,
          color: matchColor('SciHf')('moderada-dinamica'),
        },
        'moderada-estable_baja': {
          id: 'moderada-estable_baja',
          label: 'SCI Moderado - HH Baja',
          value: 0,
          color: matchColor('SciHf')('moderada-estable_baja'),
        },
      },
      ProtectedAreas: {
        'alta-estable_alta': [],
        'alta-dinamica': [],
        'alta-estable_baja': [],
        'moderada-estable_alta': [],
        'moderada-dinamica': [],
        'moderada-estable_baja': [],
      },
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {
      areaId,
      geofenceId,
    } = this.context;

    RestAPI.requestSCIHF(areaId, geofenceId)
      .then((res) => {
        if (this.mounted) {
          this.setState((prevState) => {
            const { SciHfCats: cats, ProtectedAreas: PAs } = prevState;
            res.forEach((elem) => {
              const idx = `${elem.sci_cat}-${elem.hf_pers}`;
              cats[idx].value += elem.area;
              PAs[idx].push({ id: elem.pa, label: elem.pa, value: elem.area });
            });
            return { SciHfCats: cats, ProtectedAreas: PAs };
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
    this.setState(prevState => ({
      showInfoGraph: !prevState.showInfoGraph,
    }));
  };

  render() {
    const { showInfoGraph, SciHfCats, ProtectedAreas } = this.state;
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
            name="Integridad"
            description="Integridad"
            className="graphinfo2"
            collapseButton={false}
          />
          )
        )}
        <div>
          <GraphLoader
            data={Object.values(SciHfCats)}
            graphType="pie"
            colors={matchColor('SciHf')}
            units="ha"
          />
        </div>
      </div>
    );
  }
}

export default ForestIntegrity;

ForestIntegrity.contextType = SearchContext;
