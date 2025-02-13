const {Schema,model} =require("mongoose")

const teacherSchema=new  Schema({
    name:{
        required:true,
        type:String
    },
    number:{
        required:true,
        type:String,
        maxlength:11
    },
    password:{
        required:true,
        type:String
    },
    address:{
        required:true,
        type:String
    },
    admin_id:{
        type:Schema.ObjectId,
        ref:"admin"
    },
    status:{
        type:Boolean,
        default:false
    },
    updateCount:{
        type:Number,
        default:0
    },
    maxUpdate:{
        type:Number,
        default:5
    }
   
},{timestamps:true})

const teacherModel=model("teacher",teacherSchema)
module.exports=teacherModel