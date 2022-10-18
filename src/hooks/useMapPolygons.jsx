import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postRequest } from "../utilitiies";
import maplibregl from "maplibre-gl";
import {
  addNewPolygonUrl,
  deletePolygonUrl,
  updatePolygonUrl,
  combinedPolySourceName,
  combinedPolyLayerName,
} from "../constants";
import {
  deletePolygonAction,
  selectPolygons,
  updatePolygonAction,
  addPolygonAction,
} from "../state/mapDataSlice";

export const useMapPolygons = (map, mapInitialized) => {
  const dispatch = useDispatch();
  const polygons = useSelector(selectPolygons);


  const combinedPolygonGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection",
      features: [...polygons],
    }),
    [polygons]
  );

  // <--- Beginning of event listener callbacks --->
  const savePolygon = useCallback(
    (e) => {
      const newPolygon = {
        ...e.features[0],
        properties: { id: e.features[0].id },
      };
      postRequest(addNewPolygonUrl, newPolygon, (res) => {
        if (res.status === "success") {
          dispatch(addPolygonAction(res.polygon));
        } else {
          console.error("error", res);
        }
      });
    },
    [dispatch]
  );

  const updatePolygon = useCallback(
    (e) => {
      postRequest(updatePolygonUrl, e.features[0], (res) => {
        if (res.status === "success") {
          dispatch(updatePolygonAction(res.polygon));
        } else {
          console.error("error", res);
        }
      });
    },
    [dispatch]
  );

  const deletePolygon = useCallback(
    (e) => {
      const id = e.features[0].id;
      postRequest(`${deletePolygonUrl}/${id}`, { id }, (res) => {
        if (res.status === "success" && res.polygon) {
          dispatch(deletePolygonAction(res.polygon));
        } else {
          console.error("error", res);
        }
      });
    },
    [dispatch]
  );

  const handlePolygonClick = useCallback(
    (e, map) => {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`this polygon is located at: Long:${e.lngLat.lng}, Lat:${e.lngLat.lat}`)
        .addTo(map);
    },
    []
  );

  // <--- Beginning of map functions --->

  const removePolygonFromMap = useCallback(() => {
    map?.removeLayer(combinedPolyLayerName);
    map?.removeSource(combinedPolySourceName);
  }, [map]);

  const addPolygonToMap = useCallback(
    (polygons) => {
      if (map.getLayer(combinedPolyLayerName)) removePolygonFromMap(map);
      map.addSource(combinedPolySourceName, {
        type: "geojson",
        data: polygons,
      });
      map.addLayer({
        id: combinedPolyLayerName,
        type: "fill",
        source: combinedPolySourceName,
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.8,
        },
      });
    },
    [map, removePolygonFromMap]
  );


  // handles all polygon updates
  useEffect(() => {
    if (mapInitialized && combinedPolygonGeoJSON.features.length) {
      addPolygonToMap(combinedPolygonGeoJSON);
    }
  }, [addPolygonToMap, combinedPolygonGeoJSON, mapInitialized]);

  return {
    savePolygon,
    updatePolygon,
    deletePolygon,
    handlePolygonClick,
  };
};
