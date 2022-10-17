import React, { useEffect, useRef, useState } from "react";
import "./map.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useMapData } from "../../hooks/useMapData";
import { combinedPolyLayerName } from "../../constants";


export default function Map(props) {
  const mapContainerRef = useRef();
  const map = useRef(null);
  const [lng] = useState(props.lng || -104.991531);
  const [lat] = useState(props.lat || 39.742043);
  const [zoom] = useState(14);
  const [style] = useState(
    "https://devtileserver2.concept3d.com/styles/c3d_default_style/style.json"
  );
  const [mapInitialized, setMapInitialized] = useState(false);

  const { savePolygon, updatePolygon, deletePolygon, hideTopbar, handlePolygonClick } = useMapData(map.current, mapInitialized);
 
  // Initialize map when component mounts
  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style,
      center: [lng, lat],
      zoom,
    });
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
        point: true,
      },
    });
    map.current.addControl(draw, "top-left");
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    // event listeners
    map.current.on('load', () => setMapInitialized(true));
    map.current.on("draw.create", savePolygon);
    map.current.on("draw.update", updatePolygon);
    map.current.on("draw.delete", deletePolygon);
    map.current.on("mouseenter", combinedPolyLayerName, () => {
      map.current.getCanvas().style.cursor = "pointer";
    });
    map.current.on("mouseleave", combinedPolyLayerName, () => {
      map.current.getCanvas().style.cursor = "";
    });
    map.current.on("click", combinedPolyLayerName, handlePolygonClick);
    map.current.on('click', hideTopbar);
    return () => {
      map.current.remove();
    };
  }, []);
  
  return (
    <div className="map-wrap">
      <a href="https://www.maptiler.com" className="watermark">
        <img
          src="https://api.maptiler.com/resources/logo.svg"
          alt="MapTiler logo"
        />
      </a>
      <div ref={mapContainerRef} className="map" >

        </div>
    </div>
  );
}
