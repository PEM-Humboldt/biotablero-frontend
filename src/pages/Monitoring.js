"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitoring = Monitoring;
var react_router_1 = require("react-router");
var react_1 = require("react");
var SideBar_1 = require("pages/monitoring/layout/SideBar");
require("pages/monitoring/styles/monitoring.css");
var layoutReducer_1 = require("core/layout/mainLayout/hooks/layoutReducer");
function Monitoring() {
    var layoutDispatch = (0, react_router_1.useOutletContext)().layoutDispatch;
    (0, react_1.useEffect)(function () {
        layoutDispatch({
            type: layoutReducer_1.LayoutUpdated.CHANGE_SECTION,
            sectionData: {
                moduleName: "Monitoreo Comunitario",
                logos: new Set(["usaid", "geobon", "umed", "temple"]),
                className: "fullgrid",
            },
        });
    }, [layoutDispatch]);
    return (<div className="monitoring-root">
      <SideBar_1.SideBar />

      <react_router_1.Outlet />
    </div>);
}
