const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/User');
const { verifyToken, verifyADMIN_ROLE } = require('../middlewares/authentication');
const app = express();

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'nombre email role status google img') //can be {} to filter
        .skip(from) //se salta la cantidad de registros que le señalamos, y muestro los demás de ahí en adelante.
        .limit(limit) //maximo de registros que se desea mostrar en el resultado.
        .exec((e, users) => {
            if (e) {
                return res.status(400).json({
                    ok: false,
                    e
                });
            }

            User.countDocuments({ status: true }, (e, count) => {
                res.json({
                    ok: true,
                    users,
                    quantity: count
                });
            })


        })
});

app.post('/user', [verifyToken, verifyADMIN_ROLE], function(req, res) {
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
        res.json({
            ok: true,
            usuario: userDB
        })

    });
});

app.put('/user/:id', [verifyToken, verifyADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (e, userDB) => {
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

app.delete('/user/:id', [verifyToken, verifyADMIN_ROLE], function(req, res) {

    let id = req.params.id;
    let changeStatus = { status: false };

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (e, deletedUser) => {
        if (e) {
            return res.status(400).json({
                ok: false,
                e
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                e: {
                    message: 'User not found'
                }
            })
        }


        res.json({
            ok: true,
            user: deletedUser
        });

    });


});

module.exports = app;