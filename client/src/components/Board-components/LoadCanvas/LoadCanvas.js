import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";

function LoadCanvas({handleLoad}) {
//   function handleLoad(e) {
//     e.preventDefault();
   
//   }

  return (
    <div className="eraser">
      <FontAwesomeIcon
                title="erase"
        icon={faFileDownload}
        className="fa-icon"
        onClick={handleLoad}
      />
    </div>
  );
}

export default LoadCanvas;