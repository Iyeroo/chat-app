const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const userSchema=new mongoose.Schema({
    
    name:{type:String,required:true,unique:true},
    mobile:{type:String,required:true,unique:true},
    moodleid:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,required:true
    },
    // image:{
    //     type:String,
    //     default:"C2-Photos-iStock-1356197695",
    // },
    is_online:{
        type:String,
        default:'0',
    }

})
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre("save", async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
const User = mongoose.model("User", userSchema);

module.exports = User;