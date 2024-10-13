const jwt=require("jsonwebtoken");
const secret="anisha123"
function setuser(user){
   return jwt.sign({
    mobile:user.mobile,
    moodleid:user.moodleid

   },secret)
};
function getuser(token){
    if (!token) return null;
    console.log(token);
    return jwt.verify(token,secret);
    
    
};

module.exports={
    setuser,getuser
}