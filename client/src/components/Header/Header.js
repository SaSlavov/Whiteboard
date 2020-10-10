import React, { useContext, useState } from 'react';
import './Header.css';
import { NavLink, withRouter } from 'react-router-dom';
import AuthContext from '../../providers/AuthContext';
import { BASE_URL } from '../../common/constants';
import { ThemeContext } from '../../providers/ThemeProvider';
import { LanguageContext } from '../../providers/LanguageProvider';

const Header = (props) => {
    const { user, isLoggedIn, setLoginState } = useContext(AuthContext);
    const [errorMsg, setErrorMsg] = useState(null)
    const history = props.history;
    const { theme, toggleTheme, setButtonsTheme } = useContext(ThemeContext);
    const { language, toggleLanguage, setLabels } = useContext(LanguageContext);

    const logout = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')

        setLoginState({
            isLoggedIn: false,
            user: null,
        });

        history.push('/homepage')

        fetch(`${BASE_URL}/session`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || ''}`,
            },
            body: JSON.stringify({ user: user }),

        })
            .then(response => response.json())
            .then(result => {
                localStorage.removeItem('token');
            })
            .catch(result => setErrorMsg(result.message))

        if (errorMsg) {
            return (
                <h3>{errorMsg.message}</h3>
            );
        };
    }

    return (
        <div className="Header">
            {isLoggedIn
                ?
                <>
                    <div className="nav">
                        <p className="app-logo">aBoard</p>
                        <div className="options-container">
                            <div className="options-bar">
                                <NavLink to="user_profile">
                                    <div className=" dropdown">
                                        <img className="avatar" src={`${BASE_URL}/avatars/${user?.avatarUrl}`} alt="user avatar"></img>
                                    </div>
                                </NavLink>
                                <span className="switch-btn" id="theme-btn" onClick={toggleTheme}>
                                    {theme === "light" ? setLabels("dark") : setLabels("light")} {setLabels('mode')}
                                </span>
                                <span className="switch-btn" id="lang-button" onClick={toggleLanguage}>
                                    {setLabels('switchTo')}{language === "bulgarian" ? setLabels("english", true) : setLabels("bulgarian", true)}
                                </span>
                                <span id="Logged-user-username" onClick={() => history.push('/user_profile')}><h2>{user.username}</h2></span>
                            </div>
                        </div>
                        <div className="buttons">
                            <NavLink to="/all_boards">
                                <span className="NaviButton"
                                    style={setButtonsTheme()}>
                                    {setLabels('allBoards')}
                                </span>
                            </NavLink>
                            <NavLink to="/drawing_board">
                                <span className="NaviButton"
                                    style={setButtonsTheme()} >
                                    {setLabels('createBoard')}
                                </span>
                            </NavLink>
                            <NavLink to="/homepage">
                                <span className="NaviButton"
                                    style={setButtonsTheme()}>
                                    {setLabels('home')}
                                </span>
                            </NavLink>
                            <NavLink to="/homepage">
                                <span className="NaviButton"
                                    style={setButtonsTheme()}
                                    onClick={(e) => logout(e)}>
                                    {setLabels('logOut')}
                                </span>
                            </NavLink>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="nav-loggedOut">
                        <p className="app-logo">aBoard</p>
                        <div className="options-container-loggedOut">
                            <div className="options-bar-loggedOut">
                                <NavLink to="/register">
                                    <span className="NaviButton-register" style={setButtonsTheme()}> {setLabels('register')}</span>
                                </NavLink>
                                <NavLink to="/login">
                                    <span className="NaviButton-login" style={setButtonsTheme()}> {setLabels('logIn')}</span>
                                </NavLink>
                                <span className="switch-btn" id="theme-btn" onClick={toggleTheme}>
                                    {theme === "light" ? setLabels("dark") : setLabels("light")} {setLabels('mode')}
                                </span>
                                <span className="switch-btn" id="lang-btn" onClick={toggleLanguage}>
                                    {setLabels('switchTo')}{language === "bulgarian" ? setLabels("english", true) : setLabels("bulgarian", true)}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default withRouter(Header);