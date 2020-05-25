const express = require('express');
const { verifyToken, verifyADMIN_ROLE } = require('../middlewares/authentication');
let app = express();
let Category = require('../models/Category');

app.get('/category', verifyToken, (req, res) => {
    Category.find()
        .sort('description')
        .populate('user', 'nombre email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            Category.countDocuments((err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                };
                res.json({
                    ok: true,
                    categories,
                    quantity: count
                });
            });
        });
});

app.get('/category/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Category.findById(id, (err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categories) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category does not exists'
                }
            });
        };
        res.json({
            ok: true,
            categories
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    const { description } = req.body;
    const user = req.user;
    let category = new Category({
        description,
        user: user._id
    });
    category.save((err, newCategory) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!newCategory) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            newCategory
        });
    });
});

app.put('/category/:id', verifyToken, (req, res) => {
    const { description } = req.body;
    const { id } = req.params;
    let body = {
        description
    };
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!category) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        };
        res.json({
            ok: true,
            category
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyADMIN_ROLE], (req, res) => {
    const { id } = req.params;
    Category.findByIdAndDelete(id, (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!category) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        };
        res.json({
            ok: true,
            message: 'Category was succesfully deleted.'
        });
    });
});

module.exports = app;