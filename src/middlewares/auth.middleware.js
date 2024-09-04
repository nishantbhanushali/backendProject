import { ApiError } from "../utils/apiError.js";
// import {asyncHandlers} from "../utils/synchandler.js";
// import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js";
import { asyncHandlers } from "../utils/synchandler.js";

import jwt from 'jsonwebtoken';
export const verifyJWT = asyncHandlers(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log(req.cookies);
        

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in verifyJWT:', error);
        throw new ApiError(401, error.message || "Invalid access token");
    }
});
