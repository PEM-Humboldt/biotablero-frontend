/** eslint verified */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Ecosistemas from '@material-ui/icons/Nature';
import Especies from '@material-ui/icons/FilterVintage';
import Paisaje from '@material-ui/icons/FilterHdr';
import { ParentSize } from '@vx/responsive';

import ElasticAPI from '../api/elastic';
import GraphLoader from '../GraphLoader';
import TabContainer from '../TabContainer';

const styles = () => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      data: {
        biomas: null,
        distritos: null,
        fc: null,
      },
    };
  }

  componentDidMount() {
    ElasticAPI.requestCarByBiomaArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            biomas: res,
          },
        }));
      });
    ElasticAPI.requestCarByFCArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            fc: res,
          },
        }));
      });
    ElasticAPI.requestCarByDistritosArea('CORPOBOYACA')
      .then((res) => {
        this.setState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            distritos: res,
          },
        }));
      });
  }

  renderGraph = (data, labelX, labelY, graph, graphTitle) => {
    // While data is being retrieved from server
    if (!data) {
      return (
        <div>
          Loading data...
        </div>
      );
    }
    return (
      <ParentSize className="nocolor">
        {parent => (
          parent.width && (
            <GraphLoader
              width={parent.width}
              height={parent.height}
              graphType={graph}
              data={data}
              labelX={labelX}
              labelY={labelY}
              graphTitle={graphTitle}
            />
          )
        )}
      </ParentSize>
    );
  }

  render() {
    const { classes } = this.props;
    const { data: { fc, biomas, distritos } } = this.state;
    const { biomaActivo, biomaActivoData } = this.props;
    if (biomaActivo === null) {
      return (
        <TabContainer
          classes={classes}
          titles={[
            { label: 'Paisaje', icon: (<Paisaje />) },
            { label: 'Ecosistemas', icon: (<Ecosistemas />) },
            { label: 'Especies', icon: (<Especies />) },
          ]}
        >
          {[
            (
              <div key="1">
                {this.renderGraph(fc, 'Hectáreas', 'F C', 'BarStackHorizontal', 'Factor de Compensación')}
                {this.renderGraph(biomas, 'Hectáreas', 'Biomas', 'BarStackHorizontal', 'Biomas')}
                {this.renderGraph(distritos, 'Hectáreas', 'Regiones Bióticas', 'BarStackHorizontal', 'Regiones Bióticas')}
              </div>
            ),
            (
              <div className="graphcard" key="2">
                <h2>
                  Gráficas en construcción
                </h2>
                <p>
                  Pronto más información
                </p>
              </div>
            ),
            (
              <div className="graphcard" key="3">
                <h2>
                  Gráficas en construcción
                </h2>
                <p>
                  Pronto más información
                </p>
              </div>
            ),
          ]}
        </TabContainer>
      );
    }
    if (biomaActivo !== null && biomaActivoData !== null) {
      return (
        <div className={classes.root}>
          {this.renderGraph(biomaActivoData, 'Subzonas Hidrográficas', 'Hectáreas', 'BarVertical', 'HAs por Subzonas Hidrográficas')}
        </div>
      );
    }
    return (
      <div className={classes.root}>
        {/* TODO: esto probablemente nunca se ejecute, no quemar el mensae */}
        Por favor seleccione un bioma en el mapa
      </div>
    );
  }
}

Drawer.propTypes = {
  classes: PropTypes.object.isRequired,
  biomaActivo: PropTypes.string,
  biomaActivoData: PropTypes.object,
};

Drawer.defaultProps = {
  biomaActivo: '',
  biomaActivoData: null,
};

export default withStyles(styles)(Drawer);
