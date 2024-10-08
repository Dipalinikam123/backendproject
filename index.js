const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const {userRoute,authRoute} = require('./routes')
const authentication = require('./middleware')
 const auths=authentication.authMiddleware
const server = express();
// const publicKey = process.env.PUBLIC_KEY
const dbUrl = process.env.DBURL

// database connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database connected...")
}



server.use(express.json());
server.use(cors());
server.use('/auth',userRoute.router);
server.use('/users', auths, userRoute.router);


const port = process.env.PORT
server.listen(port, () => {
  console.log("Server Started...")
})