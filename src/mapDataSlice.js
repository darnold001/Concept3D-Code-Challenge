import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
  polygons: [],
  filters: {
    status: "All",
  },
  showTopbar: false,
};

export const mapDataSlice = createSlice({
  name: "mapData",
  initialState,
  reducers: {
    toggleShowTopbarAction: (state ) => {state.showTopbar = !state.showTopbar},
    hideShowTopbarAction: (state) => {state.showTopbar = false},
    addLocationAction: (state, action) =>{state.locations = [...state.locations, action.payload.location]},
    addPolygonAction: (state, action) => {state.polygons = [...state.polygons, action.payload]},
    updatePolygonAction: (state, action) => {
      const { id, geometry } = action.payload;
      const index = state.polygons.findIndex((polygon) => polygon.id === id);
 index !== -1 ? state.polygons[index] = { id, geometry } :   state.polygons.push({ id, geometry });
      
    },
    deletePolygonAction: (state, action) => {
      const { id } = action.payload;
      state.polygons = state.polygons.filter((polygon) => polygon.id !== id);
    },
    updateFiltersAction: (state, action) => {  state.filters = action.payload;},
    addMapDataAction: (state, action) => {
      state.locations = action.payload.locations;
      state.polygons = action.payload.polygons;
    },
    updateLocationsAction: (state, action) => {
      state.locations = action.payload
    },
  }  
});

export const {
  addLocationsAction,
  addLocationAction,
  toggleShowTopbarAction,
  hideShowTopbarAction,
  addPolygonAction,
  addMapDataAction,
  deletePolygonAction,
  updatePolygonAction,
  updateLocationsAction,
} = mapDataSlice.actions;

export const selectLocations = (state) => state.mapData.locations;
export const selectPolygons = (state) => state.mapData.polygons;
export const selectFilters = (state) => state.mapData.filters;
export const selectShowTopbar = (state) => state.mapData.showTopbar;

export default mapDataSlice.reducer;
