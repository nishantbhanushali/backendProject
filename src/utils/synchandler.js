// const asyncHandler =  () => async() =>{
//     try{
//         await (req, res, next)
//     }s
//     catch(error){
//         res.status(err.code || 400).json({
//             message : err.message
//         })

//     }
// }

const asyncHandlers = (requestHandler) => {
return (req, res, next) =>{
    Promise.resolve(requestHandler(req, res, next)).catch((err) => (next(err)))
}
        
}


export {asyncHandlers}