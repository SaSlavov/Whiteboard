import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthContext, { getToken, extractUser } from './providers/AuthContext';
import Homepage from './components/Pages/Homepage/Homepage';
import Header from './components/Header/Header';
import Register from './components/Pages/Register/Register';
import Login from './components/Pages/Login/Login';
import ConfirmAccount from './components/Pages/ConfirmAccount/ConfirmAccount';
import DrawingBoard from './components/Board-components/Board/DrawingBoard';
import AllBoards from './components/Pages/AllBoards/AllBoards/AllBoards';
import Chat from './components/Pages/Chat/Chat';
import ForgottenPassword from './components/Pages/Forgotten Password/ForgottenPassword';
import LoadBoard from './components/Board-components/Board/LoadBoard';
import UserProfile from './components/Pages/UserProfile/UserProfile';
import AllUsers from './components/Pages/Chat/AllUsers';
import BoardOptions from './components/Pages/AllBoards/BoardOptions/BoardOptions';
function App() {

  const [authValue, setAuthValue] = useState({
    isLoggedIn: !!extractUser(getToken()),
    user: extractUser(getToken())
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value={{ ...authValue, setLoginState: setAuthValue }}>
          <Header />
          <Switch>
            <Redirect exact from="/" to="/homepage" />
            <Route path="/homepage" component={Homepage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/confirmation/:id" component={ConfirmAccount} />
            <Route path="/drawing_board/info/:id" component={BoardOptions} />
            <Route path="/drawing_board/:id" component={LoadBoard} />
            <Route path="/drawing_board" component={DrawingBoard} />
            <Route path="/all_boards" component={AllBoards} />
            <Route path="/chat" component={Chat} />
            <Route path="/users_online" component={AllUsers} />
            <Route path="/forgotten_pass/:id" component={ForgottenPassword} />
            <Route path="/forgotten_pass" component={ForgottenPassword} />
            <Route path="/user_profile" component={UserProfile} />
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}
export default App;