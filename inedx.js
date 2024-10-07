const express = require('express')
const mongoose = require('mongoose');
const userRoutes=require('./routes/user')
const jwt = require('jsonwebtoken'); //for token
const authRoutes= require('./routes/authRoute')
require('dotenv').config();

const server = express()
// const publicKey = process.env.PUBLIC_KEY
const secretKey=process.env.SECRET


// database connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  console.log("Database connected...")
}

//middleware
//verification- is user Register or not 
const auth=(req,res,next)=>{  
  // in postman you need to put token in authorization , after that to get token here use- req.get() to get header value
  try {
 const token= req.get('Authorization').split('Bearer ')[1]
  var decoded = jwt.verify(token, secretKey);
  console.log("---decode",decoded)
 
    if(decoded.email){
      next()
    }else{
      res.sendStatus(401)
    }
  } catch (error) {
    res.status(401).json(error)
  }
  
}
server.use(express.json())
server.use('/auth',authRoutes.router)
server.use('/users',auth,userRoutes.router)


const port= process.env.PORT
server.listen(port, () => {
  console.log("Server Started...")
})