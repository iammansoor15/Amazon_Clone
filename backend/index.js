require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const router = require('./routes/router');
const buyItems = require("./routes/buyItem")
const DefaultData = require('./defaultdata');

const PORT = process.env.PORT;
require('./db/conn');
const cors = require('cors');

app.use(cookieParser());
app.use(cors({
    origin: "https://amaazonn.onrender.com", 
    credentials: true,
}));
app.use(express.json());
app.use(router);
app.use(buyItems);




app.listen(PORT, '0.0.0.0', () => 
    console.log(`Server is running on port ${PORT}`)
);


DefaultData();
