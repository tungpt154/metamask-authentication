import jwtDecode from 'jwt-decode';
import React, {
    useState,
    useEffect
} from 'react';
import Blockies from 'react-blockies';
export const Profile = ({
    auth,
    onLoggedOut
}) => {
    const [state, setState] = useState({
        loading: false,
        user: undefined,
        username: '',
    });
    useEffect(() => {
        const {
            accessToken
        } = auth;
        const data = jwtDecode(accessToken);
        fetch(`http://localhost:5000/users/${data.user_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => response.json())
            .then((user) => setState(Object.assign(Object.assign({}, state), {
                user
            })))
            .catch(window.alert);
    }, []);
    const handleChange = ({
        target: {
            value
        },
    }) => {
        setState(Object.assign(Object.assign({}, state), {
            username: value
        }));
    };
    const handleSubmit = () => {
        const {
            accessToken
        } = auth;
        const {
            user,
            username
        } = state;
        setState(Object.assign(Object.assign({}, state), {
            loading: true
        }));
        if (!user) {
            window.alert('The user id has not been fetched yet. Please try again in 5 seconds.');
            return;
        }
        fetch(`http://localhost:5000/users/${user.user_id}`, {
                body: JSON.stringify({
                    username
                }),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
            })
            .then((response) => response.json())
            .then((user) => setState(Object.assign(Object.assign({}, state), {
                loading: false,
                user
            })))
            .catch((err) => {
                window.alert(err);
                setState(Object.assign(Object.assign({}, state), {
                    loading: false
                }));
            });
    };
    const {
        accessToken
    } = auth;
    const data = jwtDecode(accessToken);
    console.log(data);
    const {
        loading,
        user
    } = state;
    const username = user && user.username;
    return (React.createElement("div", {
            className: "Profile"
        },
        React.createElement("p", null,
            "Logged in as ",
            React.createElement(Blockies, {
                seed: data.address
            })),
        React.createElement("div", null,

            "connected address is ",
            React.createElement("pre", null, data.address)),
        
        React.createElement("p", null,
            React.createElement("button", {
                onClick: onLoggedOut
            }, "Logout"))));
};