const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (e, userDB) => {

        if (e) {
            return res.status(500).json({
                ok: false,
                e
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User or password invalid"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "user or Password invalid"
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });

    });

});



module.exports = app;