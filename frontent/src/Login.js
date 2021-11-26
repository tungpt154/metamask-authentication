import React, {
    useState
} from 'react';
import Web3 from 'web3';
let web3 = undefined; // Will hold the web3 instance
export const Login = ({
    onLoggedIn
}) => {
    const [loading, setLoading] = useState(false); // Loading button state
    const handleAuthenticate = ({
        address,
        signature,
    }) => fetch(`http://localhost:5000/auth`, {
        body: JSON.stringify({
            address,
            signature
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then((response) => response.json());
    const handleSignMessage = async ({
        address,
        nonce
    }) => {
        console.log(`${address} --- ${nonce}`);
        try {
            const signature = await web3.eth.personal.sign(`Please sign to connect: ${nonce}`, address, '');
            console.log(signature);
            return {
                address,
                signature
            };
        } catch (err) {
            console.log(err)
            throw new Error('You need to sign the message to be able to log in.');
        }
    };

    const handleClick = async () => {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            window.alert('Please install MetaMask first.');
            return;
        }
        if (!web3) {
            try {
                // Request account access if needed
                await window.ethereum.enable();
                // We don't know window.web3 version, so we use our own instance of Web3
                // with the injected provider given by MetaMask
                web3 = new Web3(window.ethereum);
            } catch (error) {
                window.alert('You need to allow MetaMask.');
                return;
            }
        }
        const coinbase = await web3.eth.getCoinbase();
        if (!coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }
        const publicAddress = web3.utils.toChecksumAddress(coinbase.toLowerCase());
        setLoading(true);
        // Look if user with current publicAddress is already present on backend
        fetch(`http://localhost:5000/users?address=${publicAddress}`)
            .then((response) => response.json())
            // Popup MetaMask confirmation modal to sign message
            .then(handleSignMessage)
            // Send signature to backend on the /auth route
            .then(handleAuthenticate)
            // Pass accessToken back to parent component (to save it in localStorage)
            .then(onLoggedIn)
            .catch((err) => {
                window.alert(err);
                setLoading(false);
            });
    };
    return (React.createElement("div", null,
        React.createElement("button", {
            className: "Login-button Login-mm",
            onClick: handleClick
        }, loading ? 'Loading...' : 'Login with MetaMask')));
};