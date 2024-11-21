import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {user} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


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

    const {fullName, email, username, password} = req.body
    console.log("email", email);

    // if(fullName === "") {
    //     throw new apiError(400, "fullName is required")
    // }

    if(
        [fullName, email, username, password].some((field) =>field.trim() === "")
    ) {
        throw new apiError(400, "fullName is required")
    }
    
    const existedUser = user.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new apiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    if(!coverImageLocalPath) {
        throw new apiError(400, "coverImage is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const user = await user.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await user.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new apiError(500, "something went wrong while registering a user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )
})


export {registerUser}