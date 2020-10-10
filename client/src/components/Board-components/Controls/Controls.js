import React from "react";
import "./Controls.css";
import Color from "../Color/Color";
import Eraser from "../Eraser/Eraser";
import DrawingTools from "../DrawingTools/DrawingTools";

function Controls({ handleColor, selectTool }) {
  return <div className="controls">
    <Color handleColor={handleColor} />
    <Eraser handleColor={handleColor} />
    <DrawingTools selectTool={selectTool} />
  </div>;
}

export default Controls;