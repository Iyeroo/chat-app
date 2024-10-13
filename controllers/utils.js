const jwt=require("jsonwebtoken");
const generatetoken=(id)=>{
    return jwt.sign({id},"anisha123")
}
module.exports=generatetoken;