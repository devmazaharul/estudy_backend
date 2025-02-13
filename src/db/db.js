const {connect} =require("mongoose")
 const dbConnect=async()=>{
    try {
        await connect(process.env.db_uri,{dbName:"student_result"})
        console.log("Db connected")
    } catch (error) {
        console.log("Db not connected")
    }
}
module.exports={
    dbConnect
}