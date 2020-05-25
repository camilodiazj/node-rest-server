const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
let app = express();
let Product = require('../models/Product');
const _ = require('underscore');


app.get('/products', verifyToken, (req, res) => {
    let { from, limit } = req.query;
    from = Number(from) || 0;
    limit = Number(limit) || 0;
    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('category', 'description')
        .populate('user', 'nombre email')
        .sort()
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            Product.countDocuments({ available: true }, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    products,
                    quantity: count
                });
            })
        });
});

app.get('/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'nombre email')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `There are not products with id: '${id}'`
                    }
                });
            };
            res.json({
                ok: true,
                products
            });
        });
});

app.get('/products/search/:term', verifyToken, (req, res) => {
    const term = req.params.term;
    let regex = new RegExp(term, 'i');
    Product.find({ name: regex })
        .populate('category', 'nombre')
        .exec((err, products) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                products
            });
        });
});

app.post('/products', verifyToken, (req, res) => {
    const { user } = req;
    const { name, unitPrice, description, idCategory } = req.body;
    let product = new Product({
        name,
        unitPrice,
        description,
        category: idCategory,
        user: user._id
    });
    product.save((err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        res.status(201).json({
            ok: true,
            product
        });
    });
});

app.put('/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description']);
    Product.findByIdAndUpdate(id, body, { new: true }, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'product does not exists'
                }
            });
        };
        res.json({
            ok: true,
            product
        })
    });
});

app.delete('/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    let body = { available: false };
    Product.findByIdAndUpdate(id, body, { new: true }, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'product does not exists'
                }
            });
        };
        res.json({
            ok: true,
            product
        })
    });
})

module.exports = app;