const jwt = require('jsonwebtoken');
// ===============
// Verufy token
// ===============
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    //decoded = Payload - body
    jwt.verify(token, process.env.AUTH_SEED, (e, decoded) => {
        if (e) {
            return res.status(401).json({
                ok: false,
                e
            })
        }
        req.user = decoded.user;
        next();
    });
};

let verifyADMIN_ROLE = (req, res, next) => {

    const { role } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            e: {
                message: 'invalid role'
            }
        })
    }

    next();

};

module.exports = {
    verifyToken,
    verifyADMIN_ROLE
}