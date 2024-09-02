import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
// import { ApiError } from './apiError.js'; // Ensure correct path

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: "dhuusmsrp",
    api_key: "869147248137917" ,
    api_secret: "QQ6WrfpLEcvH0Mkq13iRoUx0klw"
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        });
        fs.unlinkSync(localfilepath)

        return response;
    } catch (error) {
        // Delete the file only if it exists
        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
        }

        // Log the error or use a custom error handler
        console.error("Error uploading to Cloudinary:", error);
        // throw new ApiError(500, "Cloudinary upload failed"); // Use this if you have a custom error handler

        return null;
    }
};
// console.log( cloud_name, api_key, api_secret);

export { uploadOnCloudinary };
