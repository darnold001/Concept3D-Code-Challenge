import { useCallback, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLocations } from "../state/mapDataSlice";
import maplibregl from "maplibre-gl";

export const useMapPoints = (map, mapInitialized) => {
  const locations = useSelector(selectLocations);
  const [addedMarkers, setAddedMarkers] = useState([]);

  const markersToAdd = useMemo(
    () => locations.filter((location) => !addedMarkers.includes(location.id)),
    [locations, addedMarkers]
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

  // handles locations updates
  useEffect(() => {
    if (!mapInitialized || !markersToAdd.length) return;
    markersToAdd.forEach((location) => {
      addPointToMap(location, map);
      setAddedMarkers((prev) => [...prev, location.id]);
    });
  }, [addPointToMap, map, mapInitialized, markersToAdd]);

  const flyToLocation = useCallback(
    (location) => {
      const { lat, lng } = location;
      map.flyTo({
        center: [lng, lat],
        essential: true,
        zoom: 15,
      });
    },
    [map]
  );

  const centerMap = useCallback(() => {
    const bounds = new maplibregl.LngLatBounds();
    locations?.forEach(({ lng, lat }) => bounds.extend([lng, lat]));
    map.fitBounds(bounds, { padding: 40 });
  }, [locations, map]);

  //Handles panning based on locations being added or removed
  useEffect(() => {
    if (mapInitialized && markersToAdd.length > 1) centerMap();
    else if (markersToAdd.length === 1) flyToLocation(markersToAdd[0]);
  }, [
    centerMap,
    flyToLocation,
    mapInitialized,
    markersToAdd,
    markersToAdd.length,
  ]);

  return { addPointToMap };
};
