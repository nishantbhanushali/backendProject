import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt"
import { JsonWebTokenError } from "jsonwebtoken";

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required :[true, "required to add"]
    },
    thumbnail:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    duration:{
        type:Number
    },
    views:{
        type:Number
    }
} ,{timestamps:true})
userSchema.plugin(mongooseAggregatePaginate)

userSchema.pre("save", async function (next) {
    // password hoga vo 10 routes tak encrypt hoga 
    if(!this.isModified("password")) return next()

    this.password =  bcrypt.hash(this.password, 10)
   next()
    
})


export const Video = mongoose.model("Video", videoSchema)