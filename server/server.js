const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require("cors");
const map_queries = require("./map_queries/map_queries");
const serviceData = require("./serviceData");
const { Router } = require("express");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.locals.idIndex = 3;
app.locals.locations = serviceData.initialLocations;
app.locals.polygons = serviceData.initialPolygons;

const router = Router();
router.get("/locations", (req, res) => map_queries.getLocations(req, res, app));
router.get("/polygons", (req, res) => map_queries.getPolygons(req, res, app));
router.get("/mapData", (req, res) => map_queries.getMapData(req, res, app));
router.post("/addLocation", (req, res) => map_queries.addLocation(req, res, app));
router.post("/updateLocation", (req, res) => map_queries.addLocation(req, res, app));
router.post("/addPolygon", (req, res) => map_queries.addPolygon(req, res, app));
router.post("/updatePolygon", (req, res) => map_queries.addPolygon(req, res, app));
router.post("/deletePolygon/:id", (req, res) => map_queries.deletePolygon(req, res, app));
router.get('*', function(req, res){
  res.send('hmmm....looks like your url is incorrect', 404);
});

app.use(router)

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

const portNumber = process.env.PORT || 3001;

app.listen(portNumber, () => {
  console.log("RrrarrrrRrrrr server alive on port 3001");
});
