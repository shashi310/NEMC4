const jwt= require("jsonwebtoken");

function Auth(req,res,next){
    const token= req.headers.authorization?.split(" ")[1];

    if(token){
        jwt.verify(token,process.env.secrete,(err,decoded)=>{
            if(decoded){
                req.body.userID= decoded.userID;
                req.body.userName= decoded.userName;
                next()
            }else{
                res.json({msg:"you are not authorized. please login again!!"})
            }
        })
    }else{
        res.json({msg:"you are not authorized!!"})
    }
}
module.exports = {
    Auth
}