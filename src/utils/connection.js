const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qrary', { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false , user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD});
};

module.exports = connectDB;