const mongoose = require('mongoose');

const connection = 'mongodb://mongo:27017/';

const connectDB = () => {
    return mongoose.connect(connection);
};

module.exports = connectDB;
