import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating refresh and access token")
    }
}
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
   // console.log("email", email);

    // if(fullName === "") {
    //     throw new apiError(400, "fullName is required")
    // }

    if(
        [fullName, email, username, password].some((field) =>field?.trim() === "")
    ) {
        throw new apiError(400, "All field is required")
    }
    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new apiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length> 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is required")
    }

    // if(!coverImageLocalPath) {
    //     throw new apiError(400, "coverImage is required")
    // }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new apiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new apiError(500, "something went wrong while registering a user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> dats
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies

    const {email, username, password,} = req.body

    if(!username || !email) {
        throw new apiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new apiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401, "Invalid user credentials")
    }
})


export {
    registerUser,
    loginUser
}