
import connectDb  from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

connectDb()
// .then(() =>{
//     app.listen(process.env.PORT || 3000)
// }
    
// )
// .catch((error) =>{
//     console.log("db connection error");
    
//     })






// import mongoose from "mongoose";
// import {Db_name} from "./constant"


// const connectDb = (async ( ) =>{
//     try{
//         mongoose.connect(`${process.env.MONGODB_URL}/${Db_name}`)

//     }catch(errora){
//         console.log("status 404 not found");
        

//     }

// })()