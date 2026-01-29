import dogIcon from "./assets/icons/dog.svg";

import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import MapComponent from "./components/MapComponent";

function App() {

  return (
    <>
      <nav className="nav">
        <h1>Who Let The Dogs Out?</h1>
        <img src={dogIcon} />
      </nav>
      <main className="main">
        <MapComponent />
      </main>
    </>
  );
}

export default App;
