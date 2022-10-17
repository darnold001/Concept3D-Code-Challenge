import React from "react";
import "./form.css";
import { addNewLocationUrl } from "../../constants";
import { postRequest, isLatitudeValid, isLongitudeValid } from "../../utilitiies";
import { useDispatch } from "react-redux";
import { addLocationAction } from "../../state/mapDataSlice";

export const Form = () => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [lng, setlng] = React.useState("");
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const resetForm = () => {
    setName("");
    setLat("");
    setlng("");
    setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLocation = { name, lat, lng };
    setLoading(true);
    postRequest(addNewLocationUrl, newLocation, (data) => {
      setLoading(false);
      if (data.status === "success" && data?.location) {
        dispatch(addLocationAction(data));
        resetForm();
      } else {
        console.error(data, "error");
        setErrors([`${data}`]);
      }
    });
  };

  const isLatValid = (e) => {
  return   isLatitudeValid(e.target.value)
      ? setErrors(errors.filter((error) => error !== "invalid latitude"))
      :  errors.includes("invalid latitude") ? null : setErrors( [...errors, "invalid latitude"]);
  };

  const isLngValid = (e) => {
   return  isLongitudeValid(e.target.value) 
      ? setErrors(errors.filter((error) => error !== "invalid longitude"))
      :  errors.includes("invalid longitude") ? null : setErrors( [...errors, "invalid longitude"]);
  };


  const handleLatChange = (e) => {
    setLat(e.target.value);
    isLatValid(e);
  };

  const handleLngChange = (e) => {
    setlng(e.target.value);
    isLngValid(e);
  };



  const errorMessages = () => {
    return errors?.length
      ? errors.map((error, index) => (
          <p key={index} className="error-message">
            {error}
          </p>
        ))
      : null;
  };

  const isButtonDisabled=
  loading ||
    !name ||
    !lat ||
    !lng ||
    errors.includes("invalid latitude") ||
    errors.includes("invalid longitude");

  return (
    <div className="form-wrapper">
      <h2>Add a New Location</h2>
      {errorMessages()}
      <form className="coordinate-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor ="name">Location Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter a location name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor ="latitude">Latitude</label>
          <br />
          <input
            id="latitude"
            type="number"
            placeholder="Enter a latitude"
            onChange={handleLatChange}
            value={lat}
          />
        </div>
        <div>
          <label htmlFor ="longitude">Longitude</label>
          <br />
          <input
            id="longitude"
            type="number"
            placeholder="Enter a longitude"
            onChange={handleLngChange}
            value={lng}
          />
        </div>
        <button
          className="submit-button no-label"
          type="submit"
          disabled={isButtonDisabled}
        >
          Add Location
        </button>
      </form>
    </div>
  );
};
