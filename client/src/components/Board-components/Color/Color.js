import React, { useContext, useState } from "react";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../../providers/LanguageProvider";

function Color(props) {
    const { setLabels } = useContext(LanguageContext);

    const [color, setColor] = useState("#000000");
    const [displayed, setDisplayed] = useState(false);
    const popover = {
        position: "absolute",
        zIndex: "2",
    };
    const cover = {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
    };

    function handleClick() {
        setDisplayed(true);
    }

    function handleClose() {
        setDisplayed(false);
    }
    function handleChange(pickerColor) {
        setColor(pickerColor.hex);
        props.handleColor(pickerColor.hex);
    }

    return (
        <div className="color">
            <FontAwesomeIcon
                onClick={handleClick}
                title={setLabels('selectColor')}
                className="fa-icon"
                icon={faPalette}
            />
            {displayed ? (
                <div style={popover}>
                    <div style={cover} onClick={handleClose} />
                    <ChromePicker color={color} onChange={handleChange} />
                </div>
            ) : null}
        </div>
    );
}

export default Color;