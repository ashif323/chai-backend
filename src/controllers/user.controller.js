import {asyncHandler} from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation -not empty
    //check if user already exists:username,email
    //check for image ,check for avatar
    //upload them to  cloudinary, avatar
    //create user object-create entry in db
    //remove password and refresf token field from response
    //check for user cretion
    //return response

    res.status(200).json({
        message: "ok"
    })
    
})


export {registerUser}