const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/User');
const Product = require('../models/Product');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    let { type, id } = req.params;

    if (!req.files) {
        return res.status.json({
            ok: false,
            err: {
                message: 'You have to select a file'
            }
        });
    };

    //Validate type
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Valid types are: [' + validTypes.join(', ') + ']',
                type
            }
        })
    }

    let archivo = req.files.archivo;
    let splitFile = archivo.name.split('.');
    let extension = splitFile[splitFile.length - 1];
    //Extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + validExtensions.join(', '),
                ext: extension
            }
        });
    };

    //change file name
    let fileName = `${id}-${ new Date().getMilliseconds() }.${extension}`

    archivo.mv(`uploads/${ type }/${ fileName }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        userImage(id, res, fileName);
        //Update img
    });
});

let userImage = (id, res, fileName) => {
    User.findById(id, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        };

        userDB.img = fileName;

        userDB.save((err, userDB) => {
            res.json({
                ok: true,
                user: userDB,
                img: fileName
            });
        });
    });
}


module.exports = app;