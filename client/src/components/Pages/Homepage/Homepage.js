import React, { useContext } from 'react';
import { ThemeContext } from '../../../providers/ThemeProvider';
import './Homepage.css';
import CenterMode from '../../Carousel/Carousel'

const Homepage = () => {

    const { setLabelsTheme } = useContext(ThemeContext);

    return (
        <div className="Homepage" style={setLabelsTheme()}>
            <p className="welcome-msg">Welcome aboard, a WhiteBoard</p>
            <div className="app-info">
                <CenterMode />
            </div>
        </div>

    );
};
export default Homepage;