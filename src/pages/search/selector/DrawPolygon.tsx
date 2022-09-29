import React from "react";

import { Done } from "@mui/icons-material";

import Accordion from "pages/search/Accordion";
import EditPolygonIcon from "pages/search/selector/EditIcon";
import PolygonIcon from "pages/search/selector/PolygonIcon";
import RemoveIcon from "pages/search/selector/RemoveIcon";

const DrawPolygon = () => {
  const instructions = [
    {
      label: {
        id: "draw",
        name: (
          <div style={{ display: "flex" }}>
            <PolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Dibujar
            </span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: "block" }}>
          <div>
            <b>Terminar:</b>
            {" Conecta el primer y el último punto."}
          </div>
          <br />
          <div>
            <b>Deshacer:</b>
            {" Borra el último punto."}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {" Elimina todos los puntos."}
          </div>
        </div>
      ),
    },
    {
      label: {
        id: "edit",
        name: (
          <div style={{ display: "flex" }}>
            <EditPolygonIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>Editar</span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: "block" }}>
          <div>
            <b>Terminar:</b>
            {" Acepta la edición actual."}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {" Deshace toda la edición."}
          </div>
        </div>
      ),
    },
    {
      label: {
        id: "remove",
        name: (
          <div style={{ display: "flex" }}>
            <RemoveIcon />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>Borrar</span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: "block" }}>
          <div>
            <b>Terminar:</b>
            {" Después de seleccionar un polígono acepta su eliminación."}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {" Sale de este control."}
          </div>
          <br />
          <div>
            <b>Reiniciar:</b>
            {" Elimina todo."}
          </div>
        </div>
      ),
    },
    {
      label: {
        id: "confirm",
        name: (
          <div style={{ display: "flex" }}>
            <Done />
            <span style={{ paddingLeft: 10, alignSelf: "center" }}>
              Confirmar
            </span>
          </div>
        ),
      },
      component: () => (
        <div style={{ display: "block" }}>
          <div>
            <b>Avanzar:</b>
            {" Acepta el polígono y muestra la información disponible."}
          </div>
          <br />
          <div>
            <b>Cancelar:</b>
            {" Sale de este control."}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="drawPAcc">
      <div style={{ paddingBottom: 15 }}>
        Los controles a la izquierda superior del mapa se manejan así, después
        de dibujar el polígono aparecerán las opciones extra.
      </div>
      <div style={{ width: "100%" }}>
        <Accordion
          componentsArray={instructions}
          classNameDefault="m0"
          classNameSelected="m0"
          level="2"
          handleChange={() => {}}
        />
      </div>
    </div>
  );
};

export default DrawPolygon;
