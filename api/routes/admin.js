const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const cloudinary = require("cloudinary").v2;
console.log("gyg");
cloudinary.config({
  cloud_name: "dkv4crjzl",
  api_key: "375344964466167",
  api_secret: "Y-hvm_3fjEy5l6uz6QcHw56k80c",
});

//get
router.get("/Detailsbyadmin", checkAuth, (req, res) => {
  Admin.find()
    .then((result) => {
      res.status(200).json({
        adminData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
//get by id
router.get("/DetailsByadminId/,checkAuth:id", (req, res, next) => {
  console.log("hhj");

  console.log(req.params.id);
  Admin.findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        admin: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/authbyadmin", (req, res, next) => {
  console.log(req.body);
  // .catch(err=>{
  //  res.status(500).json({
  // error:err
  // })
  // })
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    console.log(result);
    const admin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      DateOfBirth: req.body.DateOfBirth,
      Address: req.body.Address,
      imagePath: result.url,
    });

    admin
      .save()
      .then((result) => {
        console.log(result);
        res.status(200).json({
          newAdmin: result,
        });
      })

      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  });
});

//delete request
router.delete("/singleDataDeleteByadminId,checkAuth/:id", (req, res, next) => {
  Admin.remove({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "admin deleted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//put request
router.put("/DetailsPutByadminId,checkAuth/:id", (req, res, next) => {
  console.log(req.params.id);
  Admin.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        DateOfBirth: req.body.DateOfBirth,
        Address: req.body.Address,
        imagePath: req.body.imagePath,
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        updated_Admin: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/signupadmin", (req, res, next) => {
  console.log("gyfh");

  // find((email)=>{
  //  res.status(400).json({
  //   msg:'invalid email'
  // })
  // })
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const admin = new Admin({
        _id: new mongoose.Types.ObjectId(),
        password: hash,
        phone: req.body.phone,
        email: req.body.email,
        userType: req.body.userType,
        DateOfBirth: req.body.DateOfBirth,
        Address: req.body.Address,
        //imagePath: result.url,
      });

      admin
        .save()
        .then((result) => {
          res.status(200).json({
            new_admin: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.post("/loginadmin", (req, res, next) => {
  //console.log(req.body)
  //Admin.find({username:req.body.username})
  //.then(user=>{
  //if(user.length < 1)
  //{
  //  return res.status(401).json({
  // msg:'user not exist'
  //})
  //}
  bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
    if (!result) {
      return res.status(401).json({
        msg: "password not match",
      });
    }
    if (result) {
      const token = jwt.sign(
        {
          adminType: user[0].adminType,
          email: user[0].email,
          phone: user[0].phone,
          DateOfBirth: user[0].DateOfBirth,
          Address: user[0].Address,
        },
        "this is dummy text",
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        // username:user[0].username,
        adminType: admin[0].userType,
        email: admin[0].email,
        phone: admin[0].phone,
        DateOfBirth: admin[0].DateOfBirth,
        Address: admin[0].Address,
        token: token,
      });
    }
  });
});

//.catch(err=>{
//res.status(500).json({
//err:err
//})
//})

router.get("/DataByadminId/:id", (req, res, next) => {
  console.log("hhj");

  console.log(req.params.id);
  admin
    .findById(req.params.id)
    .then((result) => {
      res.status(200).json({
        admin: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
//is_block user
router.put("/PutByadminIdis_block,checkAuth/:id", (req, res, next) => {
  console.log(req.params.id);
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        //name:req.body.name,
        //email:req.body.email,
        // phone:req.body.phone,
        //gender:req.body.
        // username:req.body.username,
        //password:hash,
        phone: req.body.phone,
        // email:req.body.email,
        userType: req.body.userType,
        DateOfBirth: req.body.DateOfBirth,
        Address: req.body.Address,
        is_block: req.body.is_block,
      },
    }
  );
  var YES = true;
  var NO = false;
  if (YES) {
    console.log = "block";
  }
  if (NO) {
    console.log = "unblock";
  }
});

//email verify

module.exports = router;
