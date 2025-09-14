module.exports = function(allowedRoles){
  return function(req,res,next){
    const role = req.user && req.user.role;
    if(!role) return res.status(403).json({message:'No role found'});
    if(!allowedRoles.includes(role)) return res.status(403).json({message:'Forbidden'});
    next();
  }
}
