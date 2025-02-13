class ReturnResponce{
    successRes(arg){
        return {
            message:arg?.message || "successful",
            status:arg?.status || 200,
            data:arg?.data || ""
        }
    }
    
}

const responce=new ReturnResponce()
module.exports={
    successRes:responce.successRes
}