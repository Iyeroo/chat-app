const jwt=require("jsonwebtoken");
const secret="anisha123";

function setuser(user){
  
let token = jwt.sign( {
    _id:user._id
},secret);
   return token;
};
function getuser(token){
    if (!token) return null;
    return jwt.verify(token,secret);
    
};

module.exports={
    setuser,getuser
}