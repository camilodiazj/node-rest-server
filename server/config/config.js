//==============
// Puerto
//==============
process.env.PORT = process.env.PORT || 3000;

//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// Base de datos
//==============

let urlDB = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' :
    'mongodb+srv://nodedbadmon:CSk7ZgpOJLF9Hmxt@cluster0-ljvtk.mongodb.net/cafe?retryWrites=true&w=majority';

process.env.URLDB = urlDB;