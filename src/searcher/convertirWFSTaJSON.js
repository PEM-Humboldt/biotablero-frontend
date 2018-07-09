import L from 'leaflet';

function convertirWSFTaJSON(WFST_URL, typeName){
  setWFSLayer(WFST_URL) {
    let wfst = new L.WFST({
  			url: WFST_URL,
  			typeNS: 'Biotablero',
  			typeName: 'Corpoboyaca-agrupado',
  			crs: L.CRS.EPSG4326,
  			geometryField: 'the_geom'
  		  },new L.Format.GeoJSON({crs: L.CRS.EPSG4326}));
        console.log('wfst: '+wfst);
  }
}
