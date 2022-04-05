const express = require('express');
const router = express.Router();
const student = require('../model/student');
const mongoose = require('mongoose');
//const student = require('../model/student');
//const checkAuth = require('../middleware/check-auth')
////const cloudinary = require('cloudinary').v2;

//cloudinary.config({ 
   // cloud_name: 'dkv4crjzl', 
   // api_key: '375344964466167', 
    //api_secret: 'Y-hvm_3fjEy5l6uz6QcHw56k80c' 
 // });


router.get('/data',(req,res)=>{
    student.find()
    .then(result=>{
        res.status(200).json({
            studentData:result
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

router.get('/dataById/:id',(req,res,next)=>{
    console.log("hhj");

    console.log(req.params.id);
    student.findById(req.params.id)
    .then(result=>{
        res.status(200).json({
            student:result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
         error:err   
        })
    })
})

 router.post('/buth',(req,res,next)=>{
     console.log(req.body);
     //.catch(err=>{
        // res.status(500).json({
            // error:err
        // })
    // })
     //const file = req.files.photo;
     cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
         console.log(result);
         const student = new Student({
            _id:new mongoose.Types.ObjectId,
            name:req.body.name,
            email:req.body.email,
           phone:req.body.phone,
           gender:req.body.gender,
           //imagePath: result.url
        });
   
        student.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
               newStudent:result
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
 router.delete('/deleteById/:id',(req,res)=>{
     Student.remove({_id:req.params.id})
     .then(result=>{
         res.status(200).json({
             message:'student deleted',
             result:result
         })
 })
})

 //put request
router.put('/putById/:id',(req,res,next)=>{
    console.log(req.params.id);
    Student.findOneAndUpdate({_id:req.params.id},{
        $set:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            imagePath: req.body.imagePath
        }
    })
    .then(result=>{
        res.status(200).json({
            updated_Student:result
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})
module.exports = router;