
const {v4:uuidv4}=require("uuid");
const usersDB={
    users:require("../models/usermode"),
    setUsers:function(data){
        this.users=data;
    }
}

const secret="anisha123";
const jwt=require("jsonwebtoken");
const User=require("../models/usermode");
const generatetoken=require("../config/generatetoken")
const register=async(req,res)=>{
    try{
        await User.create({
            name: req.body.name,
            mobile:req.body.mobile,
         
            moodleid: req.body.moodleid,
            image:req.body.image,
            password:req.body.password,
         });
        
         
        return res.redirect("chat.ejs"); 
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}
const login=async(req,res)=>{
    
    try{
        const {mobile,moodleid}=req.body;
        const user=await User.find({mobile,moodleid});
        
    
console.log(user);
        if(user){
          
          const token= jwt.sign({"_id":user[0]._id.toString()},"anisha123");
            console.log(token);
            res.cookie("uid",token);
res.json({
_id: user[0]._id.toString(),
            name: user[0].name,
            mobile: user[0].email,
            
            moodleid: user[0].moodleid,
            mobile:user[0].mobile,
            token: generatetoken(user[0]._id.toString())
})

            
        }
        if(!user) return res.render("login",{
            error:"invalid mobile or moodleid"
    
        })
        
      
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }
}
const allusers=async(req,res)=>{
    
    
            
        
        
    const keyword=req.query.search?{
        $or:[
            {mobile:{ $regex: req.query.search, $options:"i"}},
            {name:{ $regex: req.query.search, $options:"i"}},
        ]
    }:{};
    const users=await User.find(keyword);
    console.log(keyword);
    res.send(users);}

    
module.exports={register,login,allusers}