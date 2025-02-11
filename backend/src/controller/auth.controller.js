import User from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../../config/token.js';
import cloudinary from '../../config/cloudinary.js';

const signup = async (req, res) => {
    const { fullname, email, password, retypePassword } = req.body;
    try {
        if (!fullname || !email || !password || !retypePassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be longer than 6 digits" })
        }

        if (password !== retypePassword) {
            return res.status(400).json({ message: "Retype-Password does not match" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            createAccessToken(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                message: "Signup Success",
                user: newUser,
            });
        } else {
            res.status(400).json({ message: "Signup failed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        createAccessToken(user._id, res);
        res.status(200).json({
            message: "SignIn Success",
            user: user,
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logout = async(req,res)=>{
    try{
        res.cookie('jwt','',{maxAge:0});
        res.status(200).json({message: "Logout Success"});

    } catch (error){
        res.status(500).json({message: error.message});
    }
}

const update = async(req,res) =>{
    try{
        const user = await User.findById(req.user);
        const {avatar, fullname, email} = req.body;
        if(avatar){
            const uploadResponse = await cloudinary.uploader.upload(avatar);
            user.avatar = uploadResponse.secure_url;
        }
        if(fullname){
            user.fullname = fullname;
        }
        if(email){
            user.email = email;
        }
        user.save();
        res.status(200).json({message: "Update Success",user: user});
    } catch (error){
        res.status(500).json({message: error.message});
    }
}

const checkAuth = async(req,res) => {
    try{
        const user = await User.findById(req.user);
        res.status(200).json({user: user});
    } catch (error){
        res.status(500).json({message: error.message});
    }
}


export {
    signup,
    signin,
    logout,
    update,
    checkAuth,
};