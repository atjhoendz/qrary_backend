const express = require('express');
const connectDB = require('./utils/connection');

const app = express();
const PORT = 8080;

app.get('/', (req, res)=>{
    res.send('Qrary API is running...');
});

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
});

connectDB().then(() => {
    console.log('MongoDB connected successfuly...');
});

