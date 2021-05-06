const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
    clientName:{
        type: String,
        minlength: 4,
        required: [true, 'A credit must have a name of client']
    },
    productName:{
        type : 'String',
        required: [true, 'A credit must have a name of product'],
        trim: true,
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [3, 'A product name must have more or equal then 3 characters']
    },
    quantity:{
        type: Number,
        required: [true, 'A credit must have a quantity of product']
    },
    price:{
        type: Number,
        required: [true, 'A credit must have a price ']
    },
    rest: Number,
    creditDate:{
        type: Date,
        default: Date.now
    },
    idAdmin:String
})

const credit = mongoose.model('credit', creditSchema);

module.exports = credit;