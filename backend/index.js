const express = require('express');
const mongoose = require('mongoose');
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({path: `.env.${env}`});
const cors = require('cors')
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }));

app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
    res.send('App is running')
})
// routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// db

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("db connected")
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});