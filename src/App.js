import Map from "./components/map/map.js";
import Navbar from "./components/navBar/navbar.js";
import "./App.css";
import { useDispatch  } from "react-redux";
import { addMapDataAction} from "./state/mapDataSlice.js";
import { TopBar } from "./components/topBar/topbar";
import { Form } from "./components/form/form";

import { getMapDataUrl } from "./constants.js";
import { getRequest } from "./utilitiies.js";
function App() {
  const dispatch = useDispatch();

  getRequest(getMapDataUrl, (mapData) => {
    mapData?.locations && dispatch(addMapDataAction(mapData));
  });


  return (
    <div className="App">
      <Navbar />
    <TopBar><Form/></TopBar>
        <Map />
    </div>
  );
}

export default App;
