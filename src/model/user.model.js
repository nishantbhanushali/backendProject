import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import  JsonWebTokenError  from "jsonwebtoken";



const userSchema = new Schema({
    watchHistory: {
        type :mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    username:{
        type:String,
        required :true,
        lowercase:true,
        index:true

    },
    avatar:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required : true
 
    },
    coverimage:{
        type:String
    },
    password:{
        type:String,
        required: true,
        min:[6, "password is required"]
    },
    refreshtoken:{
        type:String
    }
}, {timestamps:true})

userSchema.pre("save", async function (next) {
    // password hoga vo 10 routes tak encrypt hoga 
    if(!this.isModified("password")) return next()

    this.password =  await bcrypt.hash(this.password, 10)
   next()
    
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// userSchema.methods.generateAcessToken(function(){})
// userSchema.methods.generateExpiryToken(function(){})

export const User = mongoose.model("User", userSchema)