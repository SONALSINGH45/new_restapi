const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
//const{User,validate}=require("../models/user"); 
const multer = require('multer')
const User = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')
const cloudinary = require('cloudinary').v2;
const joi = require('joi');
const crypto = require('crypto');
//const AWS = require('aws-sdk')
const { TokenFileWebIdentityCredentials } = require('aws-sdk');

cloudinary.config({ 
    cloud_name: 'dkv4crjzl', 
    api_key: '375344964466167', 
   api_secret: 'Y-hvm_3fjEy5l6uz6QcHw56k80c' 
 });
 
 //get
router.get('/Details',checkAuth,(req,res)=>{
    User.find()
    .then(result=>{
        res.status(200).json({
            userData:result
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})
//get by id
// router.get('/detailsbyid:id',(req,res,next)=>{


//     console.log("hhj");

//     console.log(req.params.id);
//     User.findById(req.params.id)
//     .then(result=>{
//         res.status(200).json({
//             user:result
//         })
//     })
//     .catch(err=>{
//         console.log(err);
//         res.status(500).json({
//          error:err   
//         })
//     })
// })


 router.post('/auth',(req,res,next)=>{
    console.log(req.body);
    // .catch(err=>{
       //  res.status(500).json({
            // error:err
       // })
    // })
    const file = req.files.photo;
     cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
        console.log(result);
         const user = new User({
            _id:new mongoose.Types.ObjectId,
            username:req.body.name,
            email:req.body.email,
           phone:req.body.phone,
           gender:req.body.gender,
           DateOfBirth:req.body.DateOfBirth,
           Address:req.body.Address,
           imagePath: result.url
        });
   
        user.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
               newUser:result
            })
        })
   
        .catch(err=>{
            console.log(err);
            res.status(500).json({
               error:err
            })

        })
    });
 })   

        
//delete request
router.delete('/singleDataDeleteById/:id',(req,res,next)=>{
    User.remove({_id:req.params.id})
    .then(result=>{
        res.status(200).json({
            message:'user deleted',
            result:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

//put request
router.put('/DetailsPutById/:id',(req,res,next)=>{
    console.log(req.params.id);
    User.findOneAndUpdate({_id:req.params.id},{
        $set:{
            username:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            DateOfBirth:req.body.DateOfBirth,
            Address:req.body.Address,
            imagePath: req.body.imagePath
        }
    })
    .then(result=>{
        res.status(200).json({
            updated_User:result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})
router.post('/signup',(req,res,next)=>{
    
    
    // find((email)=>{
       //  res.status(400).json({
          //   msg:'invalid email'
        // })
        // })       
 bcrypt.hash(req.body.password,10,(err, hash)=>{
 if(err)
 {
     return res.status(500).json({
         error:err
     })
 }
 else
 {
     const user = new User({
         _id: new mongoose.Types.ObjectId,
         username:req.body.username,
         password:hash,
         phone:req.body.phone,
         email:req.body.email,
         userType:req.body.userType,
         DateOfBirth:req.body.DateOfBirth,
         Address:req.body.Address,
         //imagePath:result.url
 
     })
 
     user.save()
     .then(result=>{
         res.status(200).json({
             new_user:result
         })
     })
     .catch(err=>{
         console.log(err)
         
         res.status(500).json({
             error:err
         })
     })
 }
 })
 })
 
 
 router.post('/login',(req,res,next)=>{
 //console.log(req.body)
 User.find({email:req.body.email })
 .then(user=>{
 if(user.length < 1)
 {
     return res.status(401).json({
         msg:'user not exist'
     })
 }
 console.log (user);
 bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
     if(!result)
     {
         console.log (result)
         return res.status(401).json({
             msg: 'password not match'
         })
     }
     if(result)
     {
         const token = jwt.sign({
             username:user[0].username,
             userType:user[0].userType,
             email:user[0].email,
             phone:user[0].phone,
             DateOfBirth:user[0].DateOfBirth,
             Address:user[0].Address
 
         },
         'this is dummy text',
         {
             expiresIn:"24h"
         }
         );
         res.status(200).json({
             username:user[0].username,
             userType:user[0].userType,
             email:user[0].email,
             phone:user[0].phone,
             DateOfBirth:user[0].DateOfBirth,
             Address:user[0].Address,
             token:token
         })
    }
 })   
 
 })
 
 .catch(err=>{
 res.status(500).json({
     err:err
 })
 })
 })
 router.get('/DataById/:id',(req,res,next)=>{
 console.log("hhj");
 
 console.log(req.params.id);
 User.findById(req.params.id)
 .then(result=>{
 res.status(200).json({
     user:result
 })
 })
 .catch(err=>{
 res.status(500).json({
  error:err   
 })
 })
 })
//is_block user
router.put('/PutByIdis_block,checkAuth/:id',(req,res,next)=>{
    console.log(req.params.id);
    User.findOneAndUpdate({_id:req.params.id},{
        $set:{
            //name:req.body.name,
            //email:req.body.email,
           // phone:req.body.phone,
            //gender:req.body.
                username:req.body.username,
                //password:hash,
                phone:req.body.phone,
               // email:req.body.email,
                userType:req.body.userType,
                DateOfBirth:req.body.DateOfBirth,
                Address:req.body.Address,
                is_block:req.body.is_block

        }
    

    
    })
    var YES = true;
    var NO = false;
    if(YES){
        console.log='block'
    }
    if(NO){
        console.log='unblock'
    }
})

//email verify
//reset psw
router.post('/resetpassword',async(req,res)=>{
    try{
        const schema = joi.objectid({email: joi.string().email().required()});
        const{error}= schema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findone({email: req.body.email});
        if(!user) return res.status(400).send("user with does not exit");

        let token = await Token.findone({userid: user._id});
        if(!token){
            token = await new Token({
                userid: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            }).save()
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(usre.email, "password reset", link);

        res.send("password reset link sent to your email account.")

    } catch (error){
        res.send("an error occured");
        console.log(error)

    }
});
router.post("emailreset/userid/:token", async (req,res)=>{
    try{
        const schema = joi.object({password: joi.string().required()});
        const {error} = schema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findByid(req.params.userid);
        if(!user) return res.status(400).send('invalid link or expired.');

        const token = await Token.findOne({
            userid: user._id,
            token: req.params.token
        });
        if(!token) return res.status(400).send("invalid link or expired.");

        user.password = req.body.password
        await user.save();
        await token.delete();

        res.send("password reset ")


    }catch (error) {
        res.send('an error occured')
        console.log(error);
    }
})
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ID,
//     secretAccessKey: process.env.AWS_SECRET
// });

// const storage = multer.memoryStorage({
//     destinstion: function(req, file, callback) {
//         callback(null, '')
//     }
// })


// const upload = multer({storage}).single('image')

// router.post('/upload',upload,(req, res) => {
// console.log(req.file)
//     let myFile = req.file.originalname.split(".")
//     const fileType = myFile[myFile.length - 1]

//    // res.send({
//    //     message: "hello world"
//    // })



//     const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         //key: 'photo.jpg',
//         ACL: "public-read-write",
//         Key: "JG939/qMA+mMgQAkmJ2jGeKguo9bnJyBOc0PBrRH",
//        // key: `${uuid()}.${fileType}`,
//         Body: req.file.buffer,
//        // ContentType: "image/JPG" 
//     }

//     s3.upload(params, (error, data) => {
//         if(error){
//             res.status(500).send(error)
//         }

//         res.status(200).send(data)

//     })
// })

var storage = multer.diskStorage({destination:function(req,file,cb){cb(null,'/upload')},
filename:function(req,file,cb){
    cb(null,file.originalname)
}
})

exports.upload = multer({storage:storage})




module.exports = router;