const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const app = express();

app.get('/user', function(req, res) {
    res.json('get usuario Local')
});

app.post('/user', function(req, res) {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((e, userDB) => {
        if (e) {
            return res.status(400).json({
                ok: false,
                e
            });
        }

        // userDB.password = null;

        res.json({
            ok: true,
            usuario: userDB
        })

    });
});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    User.findByIdAndUpdate(id, body, { new: true }, (e, userDB) => {
        if (e) {
            return res.status(400).json({
                ok: false,
                e
            });
        }
        res.json({
            ok: true,
            usuario: userDB
        })
    })
});

app.delete('/user', function(req, res) {
    res.json('delete usuario')
});

module.exports = app;