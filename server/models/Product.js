var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'Name is necesary'] },
    unitPrice: { type: Number, required: [true, 'Price is necesary'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    img: { type: String }
});

module.exports = mongoose.model('Product', productSchema);