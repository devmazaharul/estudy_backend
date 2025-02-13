//initliza section
const { config } = require("dotenv");
config();
const express = require("express");

const isProduction=process.env.NODE_ENV=="production"

const cookieParser = require('cookie-parser');
//variable declaration
const port = process.env.port || 8081;
const app = express();

const cors = require("cors");

const { router } = require("./src/router.js");
const {
  defaultRouteErr,
  defaultServerErr,
} = require("./src/responce/error.js");
const { default: mongoose } = require("mongoose");


// application use section
app.use([
  cors({
    credentials:true,
    origin:"http://localhost:3000"
  }),
  express.json(),
  express.urlencoded({ extended: true }),
]);
app.use((req,res,next)=>{
  console.log("have request")
  next()
})
app.use("/api/v1", router);
app.use(cookieParser());


app.use((_req, res, _next) => {
  res.status(404).json(defaultRouteErr);
});


app.use((err, _req, res, _next) => {

  if(!isProduction){
    res.status(err.status || 500).json(err || defaultServerErr);
  }else {

    res.status(500).json( defaultServerErr);
  }


});




 const dbConnect=async()=>{
    try {
        await mongoose.connect(process.env.db_uri,{dbName:"student_result"})
        console.log("Db connected")
        app.listen(port,()=>{
          console.log("server running" , port)
        })
    } catch (error) {
        console.log("Db not connected")
    }
}
dbConnect()


