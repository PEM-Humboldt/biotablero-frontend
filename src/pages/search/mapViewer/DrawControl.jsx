import PropTypes from 'prop-types';
import React from 'react';

import L from 'leaflet';
import { Done } from '@mui/icons-material';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import SearchContext from 'pages/search/SearchContext';
import matchColor from 'utils/matchColor';

class DrawControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editEnabled: false,
      createEnabled: true,
      polygon: null,
      confirmPolygon: false,
    };
  }

  /**
   * Listens for the polygon created event
   *
   * @param {Object} e LeafletDraw event
   */
  onCreated = (e) => {
    this.setState({
      polygon: e.layer,
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
      this.setState({
        polygon: editedLayers[0],
        createEnabled: false,
        editEnabled: true,
      });
    }
  }

  /**
   * Listens for the polygon deleted event
   */
  onDeleted = (e) => {
    const deletedLayers = e.layers.getLayers();
    if (deletedLayers.length > 0) {
      this.setState({
        polygon: null,
        createEnabled: true,
        editEnabled: false,
      });
    }
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

  /**
   * Localization settings
   */
  localization = () => {
    L.drawLocal = {
      draw: {
        toolbar: {
          actions: {
            title: 'Cancelar figura',
            text: 'Cancelar',
          },
          finish: {
            title: 'Terminar figura',
            text: 'Terminar',
          },
          undo: {
            title: 'Borrar último punto',
            text: 'Deshacer',
          },
          buttons: {
            ...L.drawLocal.draw.toolbar.buttons,
            polygon: 'Dibujar polígono',
          },
        },
        handlers: {
          ...L.drawLocal.draw.handlers,
          polygon: {
            tooltip: {
              start: 'Haga click para empezar la figura.',
              cont: 'Haga click para continuar la figura.',
              end: 'Haga click en el primer punto para cerrar la figura.',
            },
          },
        },
      },
      edit: {
        toolbar: {
          actions: {
            save: {
              title: 'Terminar edición',
              text: 'Terminar',
            },
            cancel: {
              title: 'Cancelar edición',
              text: 'Cancelar',
            },
            clearAll: {
              title: 'Eliminar todo',
              text: 'Reiniciar',
            },
          },
          buttons: {
            edit: 'Editar figura',
            editDisabled: 'No hay nada para editar',
            remove: 'Eliminar Figura',
            removeDisabled: 'Hay hay nada para eliminar',
          },
        },
        handlers: {
          edit: {
            tooltip: {
              text: 'Mueva los vertices del polígono para cambiar la figura.',
              subtext: 'Haga click en Cancelar para deshacer los cambios.',
            },
          },
          remove: {
            tooltip: {
              text: 'Haga click en el polígono para borrarlo',
            },
          },
        },
      },
    };
  }

  render() {
    const {
      editEnabled,
      createEnabled,
      polygon,
      confirmPolygon,
    } = this.state;

    this.localization();

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
              polygon: (createEnabled && !polygon) && ({
                allowIntersection: false,
                drawError: {
                  color: '#e84a5f',
                  message: '<strong>No se permite polígonos con intersecciones<strong>',
                },
                shapeOptions: {
                  color: matchColor('polygon')(),
                  opacity: 0.8,
                  clickable: true,
                },
              }),
            }}
          />
        </FeatureGroup>
        {polygon && (
          <>
            <button
              className="confirmButton"
              title="Confirmar polígono"
              type="button"
              onClick={() => { this.setState({ confirmPolygon: true }); }}
              tabIndex={0}
            >
              <Done />
            </button>
            {confirmPolygon && (
              <ul className="confirmActions">
                <li>
                  <button
                    className=""
                    title="Enviar polígono"
                    type="button"
                    onClick={this.confirmPolygon}
                  >
                    Avanzar
                  </button>
                </li>
                <li>
                  <button
                    className=""
                    title="Cancelar"
                    type="button"
                    onClick={() => { this.setState({ confirmPolygon: false }); }}
                  >
                    Cancelar
                  </button>
                </li>
              </ul>
            )}
          </>
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

DrawControl.contextType = SearchContext;
