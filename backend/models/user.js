const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        require: true
    },
    name: {
        type: String
    },
    nonce: {
        type: String
    },
    shipping_address: {
        type: String
    },
    join_at: {
        type: Number,
        default: () => moment().unix()
    },
    role: {
        type: String
    }
});

module.exports = mongoose.model('user', userSchema);