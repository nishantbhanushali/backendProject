
import connectDb  from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

connectDb()






// import mongoose from "mongoose";
// import {Db_name} from "./constant"


// const connectDb = (async ( ) =>{
//     try{
//         mongoose.connect(`${process.env.MONGODB_URL}/${Db_name}`)

//     }catch(errora){
//         console.log("status 404 not found");
        

//     }

// })()