import { Map } from "maplibre-gl";
import { useEffect } from "react";
import dogIcon from "./assets/icons/dog.svg";

import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

function App() {
  useEffect(() => {
    const map = new Map({
      container: "map-container",
      style:
        "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
      center: [34.57, 31.67],
      zoom: 13,
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <nav className="nav">
        <h1>Who Let The Dogs Out?</h1>
        <img src={dogIcon} />
      </nav>
      <main className="main">
        <div id="map-container"></div>
      </main>
    </>
  );
}

export default App;
