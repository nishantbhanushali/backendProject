import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


let router = Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            
         },
        {
            name:"coverimage",
          
        }
    ]),

    registerUser
)



export { router}