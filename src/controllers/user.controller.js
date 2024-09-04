import {asyncHandlers} from "../utils/synchandler.js"
import {ApiError} from "../utils/apiError.js"
import { User  } from "../model/user.model.js";
import {uploadOnCloudinary,  deleteFromCloudinary} from "../utils/cloudinary.js"
import  { ApiResponse } from "../utils/apiResponse.js"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"



const generateAcessAndRefreshToken = async(userId) =>{
  try {
    
    let user = await User.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    let accessToken =  await user.generateAccessToken()
    console.log(accessToken);
    
    let  refreshToken = await  user.generateRefreshToken()
    console.log(refreshToken );
    

    user.refreshtoken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken}
  } catch (error) {
   throw new ApiError(500, "something went wrong while acessing the acess and refresh token")

    
  }

}

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
console.log(req.body);

// console.log(`email : ${email}`);

// validating if the data is not empty ...there can be many type of validation
// if(email === ""){
//     throw new ApiError(400, "PLEASE PROVIDE EMAIL", )
if (
    [ email, username, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

//  validating is user with samw name or number is not avaliable
let existedUser = await  User.findOne({
    $or: [{email}, {username}  ]
  })

  if(existedUser){
    throw new ApiError(409, "user or email id os already exit")
  }
  
// this is how you the file path from multer gorm local storage
let avatarlocalpath = req.files?.avatar?.[0]?.path;
let coverImageLocalPath = req.files?.coverimage?.[0]?.path;
console.log("Uploaded files:", req.files);


  if(!avatarlocalpath){
    throw new ApiError(404, "avatar not uploaded in local path")
  }
// upload the avatar and cover to the cloudinart and check uploaded or not
   let avatarUploadCloud  =  await   uploadOnCloudinary(avatarlocalpath)
   let coverimageUploadCloud = await uploadOnCloudinary(coverImageLocalPath)
   if (!avatarUploadCloud) {
    throw new ApiError(404, "avatar not uploaded in cloudinary")
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
  new ApiResponse(200, firstUser, "User registered Successfully")
)

})

const loginUser = asyncHandlers(async(req, res) =>{
  // req body - data
  // username or  email
  // find the user
  // password check
  // acess and refresh token
  // send cookies
  // user succesfully login

  const {username, password, email } = req.body;

  console.log(email)

  if(!(username || email)){
    throw new ApiError(404," provide username or email ")
  }
 

  const user = await User.findOne({
    $or: [
        { email: email },
        { username: username }
    ]
  
})

if(!user){
  throw new ApiError(404, " provided username or email doesnot exist")
}

// check the password is given by user
if(!password){
  throw new ApiError("please provide the password")
}
// check the provided password exist in our database
const isPasswordCorrects =  await user.isPasswordCorrect(password)

// if password not provided
if(!isPasswordCorrects){
  throw new ApiError("provided password is not correct")
}

 let {accessToken, refreshToken} = await generateAcessAndRefreshToken(user._id)

 let logginUser = await User.findById(user._id).select("-password -refereshToken")

 let options  = {
  httpOnly: true,
  secure: true
 }

 return res
 .status(200)
 .cookie("accessToken", accessToken, options )
 .cookie("refreshToken", refreshToken ,options)
 .json(
  new ApiResponse(200, 
    {user : logginUser ,accessToken, refreshToken},
    "User Login In SucessFully"
  )
 )

})

const logOut = asyncHandlers(async(req, res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: 1 // this removes the field from document
        }
    },
    {
        new: true
    }
)

const options = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshtoken", options)
.json(new ApiResponse(200, {}, "User logged Out"))
})   


const refreshAccessToken = asyncHandlers(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }
  try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
let user  = await User.findById(decodedToken?._id)
if(!user){
  throw new ApiError(401, "user not found")
}
if (incomingRefreshToken !== user?.refreshtoken) {
  throw new ApiError(401, "Refresh token is expired or used")
  
}

const options = {
  httpOnly: true,
  secure: true
}

const {accessToken, newRefreshToken} = await generateAcessAndRefreshToken(user._id)

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", newRefreshToken, options)
.json(
  new ApiResponse(
      200, 
      {accessToken, refreshToken: newRefreshToken},
      "Access token refreshed"
  )
)
} catch (error) {
throw new ApiError(401, error?.message || "Invalid refresh token")
}





})


const changeCurrentPassword = asyncHandlers(async(req, res) =>{

  const {oldPassword, newPassword} = req.body;

  
  let user  = await User.findById(req.user?._id)
  
  if(!user){
    throw new ApiError(401, "user not found")
  }
  


 let isvalidatePassword =  await user.isPasswordCorrect(oldPassword)

 if(!isvalidatePassword){
  throw new ApiError("password not validate")
 }

 User.password = newPassword;
 await user.save({validateBeforeSave:false})

return res.status(200).json(new ApiResponse(200, "password changed sucessfully"))
})


const getCurrentUser = asyncHandlers(async(req, res) =>{
  res.status(200)
  .json(new ApiResponse(200, req.user,  "current login user fetch sucessfully"))
})

const updateUserDetails = asyncHandlers(async (req, res) => {
  const { username, newUsername } = req.body;

  // Validate input
  if (!username || !newUsername) {
      throw new ApiError(400, "Both username and newUsername are required");
  }

  // Find the user from the database
  const user = await User.findOne({ username: username });
  if (!user) {
      throw new ApiError(404, "User not found");
  }
  

  // Check if the new username already exists
  const existingUsername = await User.findOne({ username: newUsername });
  if (existingUsername) {
      throw new ApiError(409, "Username already taken");
  }

  // Change the username
  user.username = newUsername;

  // Save the updated user
  await user.save();

  return res.status(200).json(new ApiResponse(200, { username: newUsername }, "Username has been updated"));
});

const updateUserAvatar = asyncHandlers(async(req, res) =>{
  let user = User.find(req.user._id)
if(!user){
  throw new ApiError(404, "user not found")
}


 const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing")
  }

  //TODO: delete old image - assignment




  const avatar = await uploadOnCloudinary(avatarLocalPath)
    // delte the old image \
  if(avatar.public_id){
    await deleteFromCloudinary(avatar.public_id)
  }

  if (!avatar.url) {
      throw new ApiError(400, "Error while uploading on avatar")
}



// upadate the avatar and public id
user.avatar = avatar.secure_url
console.log(user.avatar);

user.public_id =  avatar.public_id

res
.status(200)
.json(new ApiResponse(200, "avatar sucessfuly updated"))
})



const getUserChannelProfile = asyncHandlers(async(req, res) => {
  const {username} = req.params

  if (!username?.trim()) {
      throw new ApiError(400, "username is missing")
  }

  const channel = await User.aggregate([
      {
          $match: {
              username: username?.toLowerCase()
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "subscribedTo"
          }
      },
      {
          $addFields: {
              subscribersCount: {
                  $size: "$subscribers"
              },
              channelsSubscribedToCount: {
                  $size: "$subscribedTo"
              },
              isSubscribed: {
                  $cond: {
                      if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              fullName: 1,
              username: 1,
              subscribersCount: 1,
              channelsSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1

          }
      }
  ])

  if (!channel?.length) {
      throw new ApiError(404, "channel does not exists")
  }

  return res
  .status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )
})

const getWatchHistory = asyncHandlers(async(req, res) => {
  const user = await User.aggregate([
      {
          $match: {
              _id: new mongoose.Types.ObjectId(req.user._id)
          }
      },
      {
          $lookup: {
              from: "videos",
              localField: "watchhistory",
              foreignField: "_id",
              as: "watchHistory",
              pipeline: [
                  {
                      $lookup: {
                          from: "users",
                          localField: "owner",
                          foreignField: "_id",
                          as: "owner",
                          pipeline: [
                              {
                                  $project: {
                                      fullName: 1,
                                      username: 1,
                                      avatar: 1
                                  }
                              }
                          ]
                      }
                  },
                  {
                      $addFields:{
                          owner:{
                              $first: "$owner"
                          }
                      }
                  }
              ]
          }
      }
  ])

  return res
  .status(200)
  .json(
      new ApiResponse(
          200,
          user[0].watchHistory,
          "Watch history fetched successfully"
      )
  )
})




export {registerUser,
   loginUser,
    logOut,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword ,
    updateUserDetails,
    updateUserAvatar,
    getWatchHistory
    
  }