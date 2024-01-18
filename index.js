console.log('Starting app...')
const express = require('express');
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');


// app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 3000; // INPUT_REQUIRED {Choose a non-reserved port number}

connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});