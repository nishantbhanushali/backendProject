import {asyncHandlers} from "../utils/synchandler.js"
import {ApiError} from "../utils/apiError.js"
import { User  } from "../model/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandlers( async(req, res) =>{
// get user details from frontend
// validate
// check if user is already exist:email username
// check for images, check for avatar
// upload them to cloudinary
// create user in object - create entery in db
// remove passeword and refresh token from response
// check for user creation
// return res

// taking the data from the frontend provided by user

let {email, password, username} = req.body;
console.log(`email : ${email}`);

// validating if the data is not empty ...there can be many type of validation
// if(email === ""){
//     throw new ApiError(400, "PLEASE PROVIDE EMAIL", )
if (
    [ email, username, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

//  validating is user with samw name or number is not avaliable
let existedUser = User.findOne({
    $or: [{email}, {username}  ]
  })

  if(existedUser){
    throw new ApiError(409, "user Already exist")
  }
  
// this is how you the file path from multer gorm local storage
  let avatarlocalpath= req.files?.avatar[0]?.path
  let coverImageLocalPath = req.files?.coverimage[0]?.path

  if(!avatarlocalpath){
    throw new ApiError(404, "avatar not uploaded")
  }
// upload the avatar and cover to the cloudinart and check uploaded or not
   let avatarUploadCloud  =  await   uploadOnCloudinary(avatarlocalpath)
   let coverimageUploadCloud = await uploadOnCloudinary(coverImageLocalPath)
   if (!avatarUploadCloud) {
    throw new ApiError(404, "avatar not uploaded")
   }
  
//    create a user based on response
let user  = await User.create({
    username:username,
    avatar: avatarUploadCloud.url,
    coverimage:coverimageUploadCloud?.url || "",
    email:email,
    password:password

})
// finf the suer is created or not
// select field help to not select the objects inside the string
let firstUser = await User.find(user._id).select("-password -refreshtoken")

if(!firstUser){
  throw new ApiError(500, "something gone wrong internally")
}
return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
)

})

export {registerUser}