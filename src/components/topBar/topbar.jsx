import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectShowTopbar, toggleShowTopbarAction } from "../../state/mapDataSlice";
import { CloseIcon } from "../closeIcon/closeIcon";
import "./topbar.css";
export const TopBar = ({ children }) => {
  const dispatch = useDispatch();
  const showTopbar = useSelector(selectShowTopbar);
  return <>{showTopbar && <div className="topbar">
    <CloseIcon clickHandler = {() => dispatch(toggleShowTopbarAction())}/>
    {children}</div>}</>;
};

export const TopBarButton = ({ children }) => {
  const dispatch = useDispatch();
  const showTopbar = useSelector(selectShowTopbar);
 return  <div className="topbar-button" onClick={() => dispatch(toggleShowTopbarAction())} role={"button"}>
  {children || !showTopbar ? 'Show add location form' : 'Hide add location form'}
  </div>
};
