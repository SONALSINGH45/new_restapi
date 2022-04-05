const mongoose = require('mongoose');
const joi = require('joi');

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
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
    userType:String,
    DateOfBirth:String,
    Address:String,
   // resetLink: {
       // data: String,
       // default: ''
   // }, 

    is_block:Boolean,
    is_deleted:Boolean
})

module.exports = mongoose.model('user',userSchema);
//const validate = (user)=>{
    //const schema = joi.object({
       // name: joi.string().required(),
       // email: joi.string().email().required(),
       // password: joi.string().required()
   // })
   // return schema.validate(user)
//}

module.exports =  mongoose.model('User', userSchema)