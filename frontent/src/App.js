import './App.css';
import React, { useEffect, useState } from 'react';
import { Login } from './Login';
import { Profile } from './Profile';
import logo from './logo.svg';
const LS_KEY = 'token';
export const App = () => {
    const [state, setState] = useState({});
    useEffect(() => {
        // Access token is stored in localstorage
        const ls = window.sessionStorage.getItem(LS_KEY);
        console.log(ls);
        const auth = ls && JSON.parse(ls);
        console.log(auth);
        setState({ auth });
    }, []);
    const handleLoggedIn = (auth) => {
      sessionStorage.setItem(LS_KEY, JSON.stringify(auth));
        setState({ auth });
    };
    const handleLoggedOut = () => {
      sessionStorage.removeItem(LS_KEY);
        setState({ auth: undefined });
    };
    const { auth } = state;
    console.log(auth)
    return (React.createElement("div", { className: "App" },
        
            React.createElement("img", { src: logo, className: "App-logo", alt: "logo" }),
            React.createElement("h1", { className: "App-title" }, "Welcome to Login with MetaMask Demo")),
        React.createElement("div", { className: "App-intro" }, auth ? (React.createElement(Profile, { auth: auth, onLoggedOut: handleLoggedOut })) : (React.createElement(Login, { onLoggedIn: handleLoggedIn }))));
};

export default App;