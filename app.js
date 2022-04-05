const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const express = require('express');
const multer = require('multer')
//const AWS = require('aws-sdk')
//const uuid = require('uuid/.v4')
//const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid').v4;
uuid();
//import { v4 as uuidv4 } from 'uuid';
//uuidv4();
//const passwordReset = require("./routes/passwordReset");

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ID,
//     secretAccessKey: process.env.AWS_SECRET
// });

const app = express();
const studentRoute = require('./api/routes/student');
//const facultyRoute = require('./api/routes/faculty');
const userRoute = require('./api/routes/user');
const adminRoute = require('./api/routes/admin');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

//const storage = multer.memoryStorage({
   // destinstion: function(req, file, callback) {
      //  callback(null, '')
   // }
//})

//const upload = multer({storage: storage}).single('image')

//app.post('/upload',upload,(req, res) => {

    //let myFile = req.file.originalname.split(".")
   // const fileType = myFile[myFile.length - 1]

   // res.send({
   //     message: "hello world"
   // })



    //const params = {
       // Bucket: process.env.AWS_BUCKET_NAME,
        //key: 'photo.jpg',
       // ACL: "public-read-write",
        //Key: "JG939/qMA+mMgQAkmJ2jGeKguo9bnJyBOc0PBrRH",
        //key: `${uuid()}.${fileType}`,
       // Body: req.file.buffer,
       // ContentType: "image/JPG" 
    //}

   // s3.upload(params, (error, data) => {
       // if(error){
           // res.status(500).send(error)
       // }

       // res.status(200).send(data)

   // })
//})

app.use(express.static(__dirname+'/public'));
app.use('/upload',express.static('upload'));




var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/school', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("connected...")
});

app.use(fileUpload({
    useTempFiles:true
}))


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use("/user/password-reset", passwordReset);




//mongoose.connect('mongodb+srv://sonal:@Surbhi@500@api.2flsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

//.connection.on('error',err=>{
   // console.log('connetion failed');
//}); 

//mongoose.connection.on('connected',connected=>{
    //console.log('connected with database....');
//});

app.use('/student',studentRoute);
//app.use('/faculty',facultyRoute);
app.use('/user',userRoute);
app.use('/admin' ,adminRoute);

app.use((req,res,next)=>{
    res.status(404).json({
        error:'url not found'
    })
})

module.exports = app;    