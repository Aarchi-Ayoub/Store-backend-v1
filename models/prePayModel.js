const mongoose = require('mongoose');

const prePaySchema = new mongoose.Schema({
    clientName:{
        type: String,
        minlength: 4,
        required: [true, 'A prePayment must have a name of client']
    },
    prePayPrice:{
        type:Number,
        required: [true, 'A prePayment must have a price']
    },
    Date:{
        type: Date,
        default: Date.now,
        select: false
    },
    idAdmin:String
})
seller
const prePayment = mongoose.model('prePayment', prePaySchema);

module.exports = prePayment;