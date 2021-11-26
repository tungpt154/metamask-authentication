const express = require('express');
const router = express.Router();
const { recoverPersonalSignature } = require('eth-sig-util');
const { bufferToHex } = require('ethereumjs-util');
const { v4: uuidv4 } = require('uuid');
const web3 = require('web3');

const UserModel = require('../models/user')
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
    const { signature, address } = req.body;
    if (!signature || !address)
        return res.status(400).json({error: 'Request should have signature and address'});

    try {
        const isValid = web3.utils.isAddress(address);
        if (!isValid) {
            return res.status(401).json({error: "Not authorized"});
        }

        let user = await UserModel.findOne({
            address: req.body.address
        });

        if (!user) {
            return res.status(401).json({error: "Not authorized"});
        }

        const msg = `Please sign to connect: ${user.nonce}`;
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const recoverAddress = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });

        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() !== recoverAddress.toLowerCase()) {
            return res.status(401).json({error: "Not authorized"});
        }

        // Create token
        const token = jwt.sign(
            {
                user_id: user.id,
                address: recoverAddress
            },
            process.env.JWT_SECRET_KEY, 
            {
                expiresIn: "2h",
                algorithm: "HS256"
            }
        );
        
        user.nonce = uuidv4();
        await user.save();

        return res.status(200).json({
            accessToken: token
        })

    } catch (error) {
        return res.status(401).json({error});
    }
});

module.exports = router;