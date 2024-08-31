import {asyncHandlers} from "../utils/synchandler.js"

const registerUser = asyncHandlers( async(req, res) =>{
    res.status(200).json({
        message : "your are register on this page"})
    
})

export {registerUser}