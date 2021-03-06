//==============
// Puerto
//==============
process.env.PORT = process.env.PORT || 3000;

//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// Vencimiento del token
//==============
process.env.EXPIRATION_TOKEN = '48h';

//==============
// Seed de autenticación
//==============
process.env.AUTH_SEED = process.env.AUTH_SEED || 'this-is-secret/seed-in-develop';

//==============
// Base de datos
//==============
let urlDB = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' :
    process.env.MONGO_URI;

process.env.URLDB = urlDB;

//============
// Google Client Id
//============
process.env.CLIENT_ID = process.env.CLIENT_ID || '665878224781-up6nvncjvsgfcp6depsuv27klqsle91j.apps.googleusercontent.com';