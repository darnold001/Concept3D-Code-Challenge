
module.exports = {
        getMapData: function (req, res, app) {
                res.send({ locations: app.locals.locations, polygons: app.locals.polygons })
        },
        getLocations: function (req, res, app) {
                res.send({ locations: app.locals.locations })
        },
        getPolygons: function (req, res, app) {
                res.send({ polygons: app.locals.polygons })
        },
        addLocation: function (req, res, app) {
                const { name, lat, lng } = req.body;
                if (name && lat && lng) {
                        const id = `id${app.locals.idIndex}`;
                        app.locals.idIndex++;
                        app.locals.locations.push({ id, name, lat, lng });
                        res.send({ status: "success", location: { id, name, lat, lng } });
                } else {
                        res.status(422).send({ error: "Missing required parameters" });
                }
        },
        addPolygon: function (req, res, app) {
                const { id, geometry } = req.body;
                if (id && geometry) {
                        const index = app.locals.polygons.findIndex((polygon) => polygon.id === id);
                        if (index === -1) {
                                app.locals.polygons.push(req.body);
                        } else {
                                // updates the polygon with the new geometry - moving the polygon/updaing vertices in the map
                                app.locals.polygons[index] = req.body;
                        }
                        res.send({ status: "success", polygon: req.body });
                }
            },
        deletePolygon: function (req, res, app) {
                const { id } = req.body;
                if (id) {
                        const index = app.locals.polygons.findIndex((polygon) => polygon.id === id);
                        if (index !== -1) {
                                app.locals.polygons.splice(index, 1);
                        }
                        res.send({ status: "success", polygon: req.body });
                }
        }
  };