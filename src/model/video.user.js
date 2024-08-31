import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


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




export const Video = mongoose.model("Video", videoSchema)