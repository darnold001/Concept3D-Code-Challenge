import { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postRequest } from "./utilitiies";
import maplibregl from "maplibre-gl";
import {
  addNewPolygonUrl,
  deletePolygonUrl,
  updatePolygonUrl,
  combinedPolySourceName,
  combinedPolyLayerName,
} from "./constants";
import {
  deletePolygonAction,
  selectLocations,
  selectPolygons,
  hideShowTopbarAction,
  updatePolygonAction,
  addPolygonAction,
} from "./mapDataSlice";

export const useMapData = (map, mapInitialized) => {
  const dispatch = useDispatch();
  const locations = useSelector(selectLocations);
  const polygons = useSelector(selectPolygons);
  const [addedMarkers, setAddedMarkers] = useState([]);

  const markersToAdd = useMemo(
    () => locations.filter((location) => !addedMarkers.includes(location.id)),
    [locations, addedMarkers]
  );

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
    (e) => {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`this is a popup for ID: ${e.features[0].properties.id}`)
        .addTo(map);
    },
    [map]
  );

  const hideTopbar = useCallback(
    () => dispatch(hideShowTopbarAction()),
    [dispatch]
  );

  // <--- End of event listener callbacks --->
  // <--- Beginning of map functions --->

  const centerMap = useCallback(() => {
    const bounds = new maplibregl.LngLatBounds();
    locations?.forEach(({ lng, lat }) => bounds.extend([lng, lat]));
    polygons?.forEach(({ geometry }) =>
      geometry.coordinates[0].forEach((coord) => bounds.extend(coord))
    );
    map.fitBounds(bounds, { padding: 40 });
  }, [locations, map, polygons]);

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

  const addPointToMap = useCallback(
    (location) => {
      const { lat, lng } = location;
      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map);
    },
    [map]
  );

  const flyToLocation = useCallback(
    (location) => {
        const { lat, lng } = location;
        map.flyTo({
            center: [lng, lat],
            essential: true,
        });
    },
    [map]
    );

  // <--- End of map utlitiy functions --->


  // handles locations updates
  useEffect(() => {
    if (!mapInitialized || !markersToAdd.length) return;
    markersToAdd.forEach((location) => {
      addPointToMap(location, map);
      setAddedMarkers((prev) => [...prev, location.id]);
    });
    // center the map based on all the new locations
    if( markersToAdd.length > 1) centerMap()
    // a single location was added, fly to it
    if (markersToAdd.length === 1) flyToLocation(markersToAdd[0]);
  }, [addPointToMap, centerMap, flyToLocation, map, mapInitialized, markersToAdd]);

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
    centerMap,
    hideTopbar,
    handlePolygonClick,
  };
};
