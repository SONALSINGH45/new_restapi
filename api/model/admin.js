const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    password:String,
    phone:Number,
    email: {
        type:String,
        required: true,
        index: {
            unique: true,
        },
        match:/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
    },
    adminType:String,
    DateOfBirth:String,
    Address:String,
    is_block:Boolean,
    is_deleted:Boolean
})

module.exports = mongoose.model('admin',adminSchema);
