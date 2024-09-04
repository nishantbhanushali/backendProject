import mongoose from "mongoose";
import {Db_name} from "../constant.js"


const connectDb = async( ) =>{
    try{
       let connection = await  mongoose.connect(`${process.env.MONGODB_URL}/${Db_name}`)
       console.log("monogodb connnected");
       

    }catch(error){
        console.log("mongodbconnection error");
        process.exit(1)
        

    }

    
}

export default connectDb