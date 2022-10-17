
 //Typically I would store the SERVICE_URL in a database or a config file and add it to the gitignore file
  const SERVICE_URL = 'http://localhost:3001/'

  export const getPolygonsUrl = `${SERVICE_URL}polygons`;
  export const getLocationsUrl =  `${SERVICE_URL}locations`;
  export const getMapDataUrl = `${SERVICE_URL}mapData`;
  export const addNewPolygonUrl = `${SERVICE_URL}addPolygon`;
  export const updatePolygonUrl = `${SERVICE_URL}updatePolygon`;
  export const addNewLocationUrl = `${SERVICE_URL}addLocation`;
  export const deletePolygonUrl = `${SERVICE_URL}deletePolygon`;

  export const combinedPolySourceName = "userPolygons";
  export const combinedPolyLayerName = "userPolygonsLayer";


