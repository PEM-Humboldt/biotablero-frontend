import PropTypes from 'prop-types';
import React from 'react';

import { Done } from '@material-ui/icons';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

class DrawControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editEnabled: false,
      createEnabled: true,
      polygon: null,
    };
  }

  /**
   * Listens for the polygon created event
   *
   * @param {Object} e LeafletDraw event
   */
  onCreated = (e) => {
    this.setState({
      polygon: { latLngs: e.layer.getLatLngs()[0] },
      createEnabled: false,
      editEnabled: true,
    });
  }

  /**
   * Listens for the polygon edited event
   *
   * @param {Object} e LeafletDraw event
   */
  onEdited = (e) => {
    const editedLayers = e.layers.getLayers();
    if (editedLayers.length > 0) {
      const polygonLatlngs = editedLayers[0].getLatLngs()[0];
      this.setState({
        polygon: { latLngs: polygonLatlngs },
        createEnabled: false,
        editEnabled: true,
      });
    }
  }

  /**
   * Listens for the polygon deleted event
   */
  onDeleted = () => {
    this.setState({
      polygon: null,
      createEnabled: true,
      editEnabled: false,
    });
  }

  /**
   * Listens for the polygon finished event
   */
  confirmPolygon = () => {
    const { polygon } = this.state;
    const { loadPolygonInfo } = this.props;
    loadPolygonInfo(polygon);
    this.setState({
      editEnabled: false,
      createEnabled: true,
      polygon: null,
    });
  }

  render() {
    const { editEnabled, createEnabled, polygon } = this.state;
    return (
      <>
        <FeatureGroup>
          <EditControl
            onCreated={(e) => this.onCreated(e)}
            onDeleted={(e) => this.onDeleted(e)}
            onEdited={(e) => this.onEdited(e)}
            edit={{
              edit: editEnabled,
              remove: editEnabled,
            }}
            draw={{
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
              edit: false,
              polygon: ((createEnabled && !polygon) && ({
                allowIntersection: false,
                drawError: {
                  color: '#e84a5f',
                  message: '<strong>No se permite polígonos con intersecciones<strong>',
                },
                shapeOptions: {
                  color: '#2a363b',
                  clickable: true,
                },
              })),
            }}
          />
        </FeatureGroup>
        {polygon && (
          <div
            className="confirmButton"
            title="Confirmar polígono"
            role="button"
            onKeyPress={this.confirmPolygon}
            onClick={this.confirmPolygon}
            tabIndex={0}
          >
            <Done />
          </div>
        )}
      </>
    );
  }
}

DrawControl.propTypes = {
  loadPolygonInfo: PropTypes.func,
};

DrawControl.defaultProps = {
  loadPolygonInfo: () => {},
};

export default DrawControl;
