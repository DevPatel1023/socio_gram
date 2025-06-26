import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  cloudinary  from '../utils/cloudinary.js';
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
    try {

        //check the input fileds are empty or not 
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                msg: "something is missing please cheack",
                success: false
            });
        }

        //if user with the same email Id try to create new account 
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                msg: "TUser with the email-Id already exists",
                success: false
            });
        }

        // hashed password for storing in the database 
        const hashedPassword = await bcrypt.hash(password, 10);

        // user entry after all checks in db
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            msg: "User created successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        // Extract data from the body and check if it is empty or not
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                msg: "something is missing please cheack it",
                success: false
            });
        }

        // finds user with given email is exists or not
        let user = await User.findOne({ email });
        // If not exists create new user
        if (!user) {
            return res.status(401).json({
                msg: "Incorrect email or password",
                success: false
            });
        }
        // if password match given access client data -- comparing hashed and given password 
        const ispassMatched = await bcrypt.compare(password, user.password);
        if (!ispassMatched) {
            return res.status(401).json({
                msg: "Incorrect password",
                success: false
            });
        }
         //user authenticated -- tokens
        const token = await jwt.sign({
            userId: user._id,
        },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        //  populate each post if in the post array of user
        const populatedPosts = await Promise.all()
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `welcome ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
    };
}

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logout Successfully.',
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'user not found',
                success: false
            });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: 'profile updated.',
            success: true,
            user
        })

    } catch (error) {
        console.log((error));
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
                success: false
            })
        };

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);

    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followerUser = req.id; //user id
        const followingUser = req.params.id; //user follows other user id
        if (followerUser == followingUser) {
            return res.status(400).json({
                message: 'you can not follow and unfollow yourself!',
                success: false
            })
        }
        const user = await User.findById(followerUser);
        const targetUser = await User.findById(followingUser);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found!',
                success: false
            });
        }
        const isFollowing = user.following.includes(followingUser);

        //if true already follows user to targetuser
        if (isFollowing) {
            //unfollow
            await Promise.all([
                User.updateOne({ _id: followerUser }, { $pull: { following: followingUser } }),
                User.updateOne({ _id: followingUser }, { $pull: { follower: followerUser } }),
            ])
            return res.status(200).json({
                message: 'Unfollowed successfully!',
                success: true
            })
        } else {
            //follow
            await Promise.all([
                User.updateOne({ _id: followerUser }, { $push: { following: followingUser } }),
                User.updateOne({ _id: followingUser }, { $push: { follower: followerUser } }),
            ])
            return res.status(200).json({
                message: 'followed successfully!',
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}