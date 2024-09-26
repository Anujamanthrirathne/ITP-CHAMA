const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server Error"

    // Wrong mongodb id error
    if(err.name === "castError"){
        const message = `Resources not found with this.. Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // Duplicate key Error
    if(err.code === 11000){
        const message = `Duplicate key ${object.keys(err.keyValue)}Entered`;
        err = new ErrorHandler(message,400);
    }

    // wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Your url is invalid please try again later`;
        err = new ErrorHandler(message,400);
    }

    // jwt expired
     if(err.name === "TokenExpireError"){
        const message = `Your url is expired please try again later!`;
        err = new ErrorHandler(message,400)
     }

     res.status(err.statusCode).json({
        success: false,
        message: err.message,
     })
}