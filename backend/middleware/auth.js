
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()


export const checkRole=(Role)=>{
    return (req,res,next)=>{
        if( req.decoded.role==Role){
            next();
        }else{
            res.status(401).send({"message":`You are not authorized`})
        }
    }
}

export const verifyuserloggedin=(req,res,next)=>{
    const token = req.headers['token'];
    jwt.verify(token, process.env.secret_key , (err, decoded) =>{
        if(!err){
            req.decoded = decoded;
            next();         
        }else{
            res.status(401).send({"message":"Not logged in"})
        }
    })
}

export const validate=(req,res,next)=>{
    const token = req.headers['token'];
    jwt.verify(token, process.env.secret_key , (err, decoded) =>{
        if(!err){
            req.decoded = decoded;
            res.json({message:"Valid token"})
        }else{
            res.status(401).send({"message":"Invalid Token or not logged in"})
        }
    })
}