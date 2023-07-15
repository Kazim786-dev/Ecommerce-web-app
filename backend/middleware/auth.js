
//------------------------------with passport.js-------------------------------


import User from '.././models/user';

import passport from 'passport';
import passportJWT from 'passport-jwt'

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const { secret_key } = process.env

// Configure JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret_key,
};

// Create JWT strategy
const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
  // Find the user by ID in the payload
  try {
    const foundUser = User.findById(payload.id)
    if (foundUser) {
      // If user is found, return user
      done(null, foundUser);
    } else {
      // If user is not found, return false
      done(null, false);
    }
  } catch (error) {
    
  }
});

// Use the JWT strategy
passport.use(strategy);

// Export the authentication middleware
module.exports = passport.authenticate('jwt', { session: false });



// without passport.js

// import jwt from 'jsonwebtoken';

// export const checkRole=(Role)=>{
//     return (req,res,next)=>{
//         if( req.decoded.role==Role){
//             next();
//         }else{
//             res.status(401).send({"message":`You are not authorized`})
//         }
//     }
// }

// export const verifyuserloggedin=(req,res,next)=>{
//     const token = req.headers['token'];
//     jwt.verify(token, process.env.secret_key , (err, decoded) =>{
//         if(!err){
//             req.decoded = decoded;
//             next();         
//         }else{
//             res.status(401).send({"message":"Not logged in"})
//         }
//     })
// }

// export const validate=(req,res,next)=>{
//     const token = req.headers['token'];
//     jwt.verify(token, process.env.secret_key , (err, decoded) =>{
//         if(!err){
//             req.decoded = decoded;
//             res.json({message:"Valid token"})
//         }else{
//             res.status(401).send({"message":"Invalid Token or not logged in"})
//         }
//     })
//}


