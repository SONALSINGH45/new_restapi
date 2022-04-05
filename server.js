const http = require('http');
const app = require('./app')
const server = http.createServer(app);
//const db = require('./config/db.config')
server.listen(3000,console.log('app is running'));
const port = process.env.port || 3000;
//const AWS = require("aws-sdk")
