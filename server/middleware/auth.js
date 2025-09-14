const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function(req,res,next){
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ','') : null;
  if(!token) return res.status(401).json({message:'No token, authorization denied'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded.user;
    next();
  }catch(err){
    res.status(401).json({message:'Token is not valid'});
  }
}
