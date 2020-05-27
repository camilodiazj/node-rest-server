const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

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
        if (type === validTypes[1]) {
            updateUserImgName(id, res, fileName);
        } else {
            updateProductImage(id, res, fileName);
        }
    });
});

const updateProductImage = (id, res, fileName) => {
    Product.findById(id, (err, product) => {
        const type = 'products';
        if (err) {
            deleteImage(fileName, type);
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!product) {
            deleteImage(fileName, type);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product does not exist'
                }
            });
        };
        if (product.img) {
            deleteImage(product.img, type);
        }
        product.img = fileName;
        product.save((err, newProduct) => {
            res.json({
                ok: true,
                product: newProduct
            });
        });
    });
};

const updateUserImgName = (id, res, fileName) => {
    User.findById(id, (err, userDB) => {
        const type = 'users';
        if (err) {
            deleteImage(fileName, type);
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!userDB) {
            deleteImage(fileName, type);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        };
        deleteImage(userDB.img, type);
        userDB.img = fileName;
        userDB.save((err, userDB) => {
            res.json({
                ok: true,
                user: userDB,
                img: fileName
            });
        });
    });
};

const deleteImage = (imageName, type) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${type}/${ imageName }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    };
};

module.exports = app;