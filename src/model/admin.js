const {Schema,model} =require("mongoose")


const adminSchema=new  Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
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
    institute_name:{
        required:true,
        type:String
    },
    institute_address:{
        required:true,
        type:String
    },
    teachers:[{
        type:Schema.ObjectId,
        ref:"teacher"
    }],
    staus:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})

const adminModel=model("admin",adminSchema)
module.exports=adminModel