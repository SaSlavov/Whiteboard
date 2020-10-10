import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { faSprayCan } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from '../../../providers/LanguageProvider';

const DrawingTools = ({ selectTool }) => {
    const { setLabels } = useContext(LanguageContext);

    return (
        <div className="tools">
            <FontAwesomeIcon
                title={setLabels('pen')}
                icon={faKeyboard}
                className="fa-icon"
                onClick={() => selectTool('Text')}
            />
            <FontAwesomeIcon
                title={setLabels('pen')}
                icon={faPen}
                className="fa-icon"
                onClick={() => selectTool('Brush')}
            />

            <FontAwesomeIcon
                title={setLabels('marker')}
                icon={faDotCircle}
                className="fa-icon"
                onClick={() => selectTool('Dots')}
            />

            <FontAwesomeIcon
                title={setLabels('brush')}
                icon={faPaintBrush}
                className="fa-icon"
                onClick={() => selectTool('Ink')}
            />

            <FontAwesomeIcon
                title={setLabels('calligraph')}
                icon={faPenFancy}
                className="fa-icon"
                onClick={() => selectTool('Calligraph')}
            />

            <FontAwesomeIcon
                title={setLabels('spray')}
                icon={faSprayCan}
                className="fa-icon"
                onClick={() => selectTool('Spray')}
            />
        </div>
    );
};

export default DrawingTools;