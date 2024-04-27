const {validationResult}=require('express-validator')

const ValidateErrors = (req, res, next) => {
 
// handel errors   
    const errors=validationResult(req);

    //this errors.errors[0].msg to reach the error message passed from route validation
   
    if(!errors.isEmpty()){

        const error=new Error();
     
        console.log(errors.errors[0].msg)
        error.statusCode=422;
        error.message=errors.errors[0].msg
        throw error;
    

    }
    else{
        next()
    }
  
  
  };
  module.exports = ValidateErrors

 