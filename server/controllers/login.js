const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Google configs
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    };
};

app.post('/google', async(req, res) => {
    let { idtoken } = req.body;
    let googleUser = await verify(idtoken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                error: e
            });
        });
    User.findOne({ email: googleUser.email }, (e, userDB) => {
        if (e) {
            return res.status(500).json({
                ok: false,
                e
            });
        }
        if (userDB) {
            if (!userDB.google) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Should use normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // if user does not exist in our db
            let user = new User();
            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((e, userDB) => {

                if (e) {
                    return res.status(500).json({
                        ok: false,
                        e
                    });
                };

                let token = jwt.sign({
                    user: userDB
                }, process.env.AUTH_SEED, { expiresIn: process.env.EXPIRATION_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        };
    });
});

module.exports = app;