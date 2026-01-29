import maplibregl, { Map } from "maplibre-gl";
import { useEffect } from "react";
import { useSSE } from '../hooks/useSSE';
import PathLayerComponent from "./PathLayer";
import useMapStore from "../stores/mapStore"
import lastIcon from "../assets/icons/pin.svg";
import manualIcon from "../assets/icons/triangle.svg";
import ContextMenu from "./ContextMenu";
import { PathFeature } from "../types";

function MapComponent() {

  useSSE(); //Start listen to SSE

  useEffect(() => {

    const map = new Map({
      container: "map-container",
      style:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
      center: [34.57, 31.67],
      zoom: 13,
      //minZoom: 12
    });

    map.on('load', async () => {
      console.debug(`map.on('load')`)

      // Line
      map.addSource('path', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} }
      });
      map.addLayer({
        id: 'path-line',
        type: 'line',
        source: 'path',
        paint: { 'line-color': 'blue', 'line-width': 5 }
      });

      // Points
      map.addSource('points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addSource('lastpoint', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: [] }, properties: {} }
      });

      map.addLayer({
        id: 'path-points-system',
        type: 'circle',
        source: 'points',
        filter: ['==', ['get', 'type'], 'SYSTEM'],
        paint: { 'circle-radius': 4, 'circle-color': 'red' }
      });
      map.addLayer({
        id: 'path-points-manual',
        type: 'symbol',
        source: 'points',
        filter: ['==', ['get', 'type'], 'MANUAL'],
        layout: {
          'icon-image': 'manual-icon',
          'icon-size': 0.5,
          'icon-allow-overlap': true
        }
      });
      map.addLayer({
        id: 'last-point-layer',
        type: 'symbol',
        source: 'lastpoint',
        layout: {
          'icon-image': 'last-icon',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-anchor': 'bottom'
        }
      });

      // Load icons
      const iconImages = [{ name: 'last-icon', imgPath: lastIcon }, { name: 'manual-icon', imgPath: manualIcon }]
      await Promise.all(iconImages.map(async (icon) => {
        const image = new Image();
        image.src = icon.imgPath;
        await new Promise((resolve) => { image.onload = resolve; });
        map.addImage(icon.name, image, { pixelRatio: 24 });
      }));

      //Follow last point
      let debaunceTimeOut: ReturnType<typeof setTimeout> | undefined;
      map.on('sourcedata', () => {
        const lastFeature = map.getSource('lastpoint') as any;
        const [lat, lng] = lastFeature._data.geometry.coordinates
        if (lat && lng) {
          clearTimeout(debaunceTimeOut);
          debaunceTimeOut = setTimeout(() => {
            map.panTo([lat, lng]);
          }, 1800);//todo- prevent panTo when adding popup is open...
        }
      });

      //Hover poup
      const pointPopup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      const iconIds = ['last-point-layer', 'path-points-manual', 'path-points-system'];
      map.on('mousemove', iconIds, (e) => {
        e.preventDefault()
        const feature = e.features![0] as unknown as PathFeature;
        const pointTime = new Date(feature.properties.time).toLocaleString('he-IL');
        const geometry = feature.geometry;
        const coords = geometry.coordinates.map((n: number) => +n.toFixed(3));
        pointPopup
          .setLngLat(e.lngLat)
          .setHTML(
            `<p style="color:red;">Seen on: ${coords} </p>
            <p style="color:black;"> At: ${pointTime} </p>`)
          .addTo(map);
      })
      map.on('mouseleave', iconIds, () => {
        pointPopup.remove();
      });


      useMapStore.getState().setMap(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <PathLayerComponent />
      <ContextMenu />
      <div id="map-container"></div>
    </>
  );
}

export default MapComponent;
