const express = require('express');
const router = express.Router();

const UserModel = require('../models/user');
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require('uuid');
const web3 = require('web3');
const moment = require('moment');

router.get("/", async (req, res) => {
    const address = req.query ? req.query.address : undefined;
    let isvalid = web3.utils.isAddress(address);
    if (!isvalid) {
        return res.status(400).json({error: "Invalid address"});
    }

    try {
        let user = await UserModel.findOne({
            address: address
        });

        if (user) {
            return res.json({
                address: user.address,
                nonce: user.nonce
            });
        }

        user = new UserModel({
            address: web3.utils.toChecksumAddress(address),
            nonce: uuidv4()
        });
        const saveUser = await user.save();
        return res.status(200).json({
            address: saveUser.address,
            nonce: saveUser.nonce
        });
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.get("/:id", auth, async (req, res) => {
    const id = req.params ? req.params.id : undefined;
    try {
        if (id !== req.user.user_id) {
            return res.status(400).json({error: "Invalid user"});  
        }

        let user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({error: "Invalid user"});  
        }
        return res.status(200).json({
            address: user.address,
            shipping_address: user.shipping_address,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.patch("/:id", auth, async (req, res) => {
    const id = req.params ? req.params.id : undefined;

    try {
        let user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({error: "Invalid user"});  
        }
        
        // can't update other user's info
        if (user.id !== req.user.user_id) {
            return res.status(403).json({error: "Invalid action"});
        }

        let hasChanged = false;

        if (req.body.name && req.body.name !== user.name) {
            user.name = req.body.name;
            hasChanged = true;
        }

        if (req.body.shipping_address && req.body.shipping_address !== user.shipping_address) {
            user.shipping_address = req.body.shipping_address;
            hasChanged = true;
        }
        if (hasChanged) {
            console.log("value changed. save into database");
            await user.save();
        }

        return res.status(200).json({
            address: user.address,
            shipping_address: user.shipping_address,
            name: user.name
        });
    } catch (error) {
        return res.status(400).json({error});
    }
});

module.exports = router;