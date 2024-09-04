import { Router } from "express";
import { registerUser,loginUser, logOut , refreshAccessToken
    ,getCurrentUser,changeCurrentPassword, updateUserDetails ,updateUserAvatar, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


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


router.route("/login").post(loginUser)

router.route("/currentuser").get(verifyJWT,getCurrentUser)

router.route("/changepassword").post(verifyJWT,changeCurrentPassword )

// /secured routes
router.route("/logout").post(verifyJWT ,  logOut)

router.route("/refreshtoken").post(verifyJWT, refreshAccessToken)

router.route("/updatedetails").post(verifyJWT , updateUserDetails)
router.route("/updateavatar").post(upload.single("avatar"),verifyJWT, updateUserAvatar )
router.route("/watchHistory").post( verifyJWT, getWatchHistory)

export { router}

