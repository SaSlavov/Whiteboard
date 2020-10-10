import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../../providers/LanguageProvider";

function Eraser(props) {
  const { setLabels } = useContext(LanguageContext);

  function handleEraser(e) {
    props.handleColor("#ffffff");
  }

  return (
    <div className="eraser">
      <FontAwesomeIcon
        title={setLabels('eraser')}
        icon={faEraser}
        className="fa-icon"
        onClick={handleEraser}
      />
    </div>
  );
}

export default Eraser;