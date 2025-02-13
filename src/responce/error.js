 class ErrorFormatter{
    anyError(arg){
       return {
        message:arg?.message || "Error occourd",
        status:arg?.status || 400
       }
    }

     serverError(arg){
        return {
            message:arg?.message || "Server error",
        status:arg?.status || 500
        }
    }
    notFound(arg){
        return {
            message:arg || "Resorcee found",
        status: 404
        }
    }
    defaultServerErr(){
        return {
            message:"server error",
            status:500
        }
    }
    defaultRouteErr(){
        return {
            message:"Page not found",
            status:404
        }
    }

    
}

const errObjet=new ErrorFormatter()

module.exports={
    anyError:errObjet.anyError,
    serverError:errObjet.serverError,
    defaultRouteErr:errObjet.defaultRouteErr(),
    defaultServerErr:errObjet.defaultServerErr(),
    notFound:errObjet.notFound
}