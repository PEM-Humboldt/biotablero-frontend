import React, { Fragment } from 'react';
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
        },
        'alta-dinamica': {
          id: 'alta-dinamica',
          label: 'SCI Alto - HH Dinámica',
          value: 0,
        },
        'alta-estable_natural': {
          id: 'alta-estable_natural',
          label: 'SCI Alto - HH Natural',
          value: 0,
        },
        'moderada-estable_alta': {
          id: 'moderada-estable_alta',
          label: 'SCI Moderado - HH Alta',
          value: 0,
        },
        'moderada-dinamica': {
          id: 'moderada-dinamica',
          label: 'SCI Moderado - HH Dinámica',
          value: 0,
        },
        'moderada-estable_natural': {
          id: 'moderada-estable_natural',
          label: 'SCI Moderado - HH Natural',
          value: 0,
        },
      },
      ProtectedAreas: {
        'alta-estable_alta': [],
        'alta-dinamica': [],
        'alta-estable_natural': [],
        'moderada-estable_alta': [],
        'moderada-dinamica': [],
        'moderada-estable_natural': [],
      },
      selectedCategory: null,
      loading: true,
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
              PAs[idx].push({ key: elem.pa, label: elem.pa, area: elem.area });
            });
            return { SciHfCats: cats, ProtectedAreas: PAs, loading: false };
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
    const {
      showInfoGraph,
      SciHfCats,
      ProtectedAreas,
      selectedCategory,
      loading,
    } = this.state;
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
            loading={loading}
            data={Object.values(SciHfCats)}
            graphType="pie"
            units="ha"
            colors={matchColor('SciHf')}
            onClickGraphHandler={(sectionId) => {
              this.setState({ selectedCategory: sectionId });
            }}
          />
        </div>
        {selectedCategory && (
          <Fragment>
            <h6>
              Distribución en áreas protegidas
            </h6>
            <div style={{ padding: '0 12px' }}>
              <GraphLoader
                data={ProtectedAreas[selectedCategory]}
                graphType="SmallBarStackGraph"
                units="ha"
                colors={matchColor('pa', true)}
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ForestIntegrity;

ForestIntegrity.contextType = SearchContext;
