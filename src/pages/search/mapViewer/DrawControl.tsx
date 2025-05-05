import React from "react";

import "leaflet-draw";
import type { DrawEvents } from "leaflet";
import L, { Polygon } from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { Done } from "@mui/icons-material";

import SearchContext, { SearchContextValues } from "pages/search/SearchContext";
import matchColor from "utils/matchColor";

interface State {
  editEnabled: boolean;
  createEnabled: boolean;
  drawnPolygon?: Polygon;
  confirmPolygon: boolean;
}

class DrawControl extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      editEnabled: false,
      createEnabled: true,
      confirmPolygon: false,
    };
  }

  /**
   * Listens for the polygon created event
   *
   * @param {DrawEvents.Created} e LeafletDraw created event
   */
  onCreated = (e: DrawEvents.Created) => {
    this.setState({
      drawnPolygon: e.layer as Polygon,
      createEnabled: false,
      editEnabled: true,
    });
  };

  /**
   * Listens for the polygon edited event
   *
   * @param {Object} e LeafletDraw event
   */
  onEdited = (e: DrawEvents.Edited) => {
    const editedLayers = e.layers.getLayers();
    if (editedLayers.length > 0) {
      this.setState({
        drawnPolygon: editedLayers[0] as Polygon,
      });
    }
  };

  /**
   * Listens for the polygon deleted event
   */
  onDeleted = (e: DrawEvents.Deleted) => {
    const deletedLayers = e.layers.getLayers();
    if (deletedLayers.length > 0) {
      this.setState({
        drawnPolygon: undefined,
        createEnabled: true,
        editEnabled: false,
      });
    }
  };

  sendPolygon = () => {
    const { drawnPolygon } = this.state;

    const polygonBounds = L.polygon(drawnPolygon.getLatLngs()[0]).getBounds();
    const bbox = [
      polygonBounds.getSouthWest().lng,
      polygonBounds.getSouthWest().lat,
      polygonBounds.getNorthEast().lng,
      polygonBounds.getNorthEast().lat,
    ];
    const geojson = drawnPolygon.toGeoJSON();
    geojson.geometry.bbox = bbox;

    const { setAreaType, setAreaLayer } = this.context as SearchContextValues;
    setAreaType({ id: "custom", name: "Consulta Personalizada" });
    setAreaLayer(geojson);
    // TODO: request backend with geojson for an id and set that id in the url and areaId context
    this.setState({
      editEnabled: false,
      createEnabled: false,
      drawnPolygon: null,
      confirmPolygon: false,
    });
  };

  /**
   * Localization settings
   */
  localization = () => {
    L.drawLocal = {
      draw: {
        toolbar: {
          actions: {
            title: "Cancelar figura",
            text: "Cancelar",
          },
          finish: {
            title: "Terminar figura",
            text: "Terminar",
          },
          undo: {
            title: "Borrar último punto",
            text: "Deshacer",
          },
          buttons: {
            ...L.drawLocal.draw.toolbar.buttons,
            polygon: "Dibujar polígono",
          },
        },
        handlers: {
          ...L.drawLocal.draw.handlers,
          polygon: {
            tooltip: {
              start: "Haga click para empezar la figura.",
              cont: "Haga click para continuar la figura.",
              end: "Haga click en el primer punto para cerrar la figura.",
            },
          },
        },
      },
      edit: {
        toolbar: {
          actions: {
            save: {
              title: "Terminar edición",
              text: "Terminar",
            },
            cancel: {
              title: "Cancelar edición",
              text: "Cancelar",
            },
            clearAll: {
              title: "Eliminar todo",
              text: "Reiniciar",
            },
          },
          buttons: {
            edit: "Editar figura",
            editDisabled: "No hay nada para editar",
            remove: "Eliminar Figura",
            removeDisabled: "Hay hay nada para eliminar",
          },
        },
        handlers: {
          edit: {
            tooltip: {
              text: "Mueva los vertices del polígono para cambiar la figura.",
              subtext: "Haga click en Cancelar para deshacer los cambios.",
            },
          },
          remove: {
            tooltip: {
              text: "Haga click en el polígono para borrarlo",
            },
          },
        },
      },
    };
  };

  render() {
    const { createEnabled, editEnabled, drawnPolygon, confirmPolygon } =
      this.state;

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

              polygon: createEnabled &&
                !drawnPolygon && {
                  allowIntersection: false,
                  drawError: {
                    color: "#e84a5f",
                    message:
                      "<strong>No se permite polígonos con intersecciones<strong>",
                  },
                  shapeOptions: {
                    color: matchColor("polygon")(),
                    opacity: 0.8,
                    clickable: true,
                  },
                },
            }}
          />
          {drawnPolygon && (
            <>
              <button
                className="confirmButton"
                title="Confirmar polígono"
                type="button"
                onClick={() => {
                  this.setState({ confirmPolygon: true });
                }}
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
                      onClick={this.sendPolygon}
                    >
                      Avanzar
                    </button>
                  </li>
                  <li>
                    <button
                      className=""
                      title="Cancelar"
                      type="button"
                      onClick={() => {
                        this.setState({ confirmPolygon: false });
                      }}
                    >
                      Cancelar
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </FeatureGroup>
      </>
    );
  }
}

export default DrawControl;

DrawControl.contextType = SearchContext;
