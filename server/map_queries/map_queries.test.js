const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);
const { initialLocations, initialPolygons } = require('../serviceData');

it("test get location query", async () => {
  // test getLocations
  const response = await request(app).get("/locations");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ locations: initialLocations });
});

it("test polygon queries", async () => {
  // test getPolygons
  const response = await request(app).get("/polygons");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ polygons: initialPolygons });
});

it("test map data queries", async () => {
  // test getMapData
  const response = await request(app).get("/mapData");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    locations: initialLocations,
    polygons: initialPolygons,
  });
});

it("test save location queries", async () => {
  // test saveLocation
  const response = await request(app)
    .post("/addLocation")
    .send({ name: "New York", lat: 40.7128, lng: -74.006 });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    location: { id: "id3", name: "New York", lat: 40.7128, lng: -74.006 },
  });
});

it("test add polygon queries", async () => {
  // test addPolygon
  const response = await request(app)
    .post("/addPolygon")
    .send({
      id: "id1",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    polygon: {
      id: "id1",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    },
  });
});

it("test delete polygon queries", async () => {
  // test deletePolygon
  const response = await request(app).delete("/deletePolygon/id1");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ status: "success" });
});
