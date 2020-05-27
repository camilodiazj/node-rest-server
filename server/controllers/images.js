const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');
let app = express();

app.get('/image/:type/:image', verifyTokenImg, (req, res) => {
    let { type, image } = req.params;
    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}`);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/unnamed.jpg');
        res.sendFile(noImagePath);
    }

});

module.exports = app;