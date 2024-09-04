
import connectDb  from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path: './.env'
})


connectDb()
.then(() =>{
    app.listen( 3000)
}
    
)
.catch((error) =>{
    console.log("db connection error");
    
    })

    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
console.log('ACCESS_TOKEN_EXPIRY:', process.env.ACCESS_TOKEN_EXPIRY);
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
console.log('REFRESH_TOKEN_EXPIRY:', process.env.REFRESH_TOKEN_EXPIRY);



// import mongoose from "mongoose";
// import {Db_name} from "./constant"


// const connectDb = (async ( ) =>{
//     try{
//         mongoose.connect(`${process.env.MONGODB_URL}/${Db_name}`)

//     }catch(errora){
// / /         console.log("status 404 not found");
        

//     }

// })()