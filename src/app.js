const express = require('express');
const connectDB = require('./utils/connection');
const router = require('./routes/index');
const cors = require('cors');
const bodyparser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/api/v1/', router);

app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route Not Found...'
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
});

connectDB().then(() => {
    console.log('MongoDB connected successfuly...');
});
