import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import {ApiError} from "apiError.js"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINART_CLOUD_NAME,
    api_key: process.env.CLOUDINART_API_KEY, 
    api_secret:process.env.CLOUDINART_API_SECRET// Click 'View API Keys' above to copy your API secret
});

  // Upload an image
  const uploadOnCloudinary = async (localfilepath) =>
  {
    try {
        if(!localfilepath) return null;
        // upload the file in cloudinary
        let response = await cloudinary.uploader.upload(localfilepath, {
            resource_type:'auto'
           
        })
        return response
    }
    catch(error){
        fs.unlinkSync(localfilepath)
        // ApiError()
        return null
        
        

    }
}

export {uploadOnCloudinary}