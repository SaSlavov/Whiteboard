import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

function SaveCanvas({memory}) {
  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem('canvas', JSON.stringify(memory))

  }
  

  return (
    <div className="eraser">
      <FontAwesomeIcon
                title="erase"
        icon={faSave}
        className="fa-icon"
        onClick={handleSave}
      />
    </div>
  );
}

export default SaveCanvas;