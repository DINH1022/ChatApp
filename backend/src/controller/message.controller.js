import User from "../model/user.model.js";
import Msg from "../model/message.model.js";

import cloudinary from "cloudinary";
import { getReceiverSocketId, io } from "../config/socket.js";

export const getUsers = async (req,res) => {
    try{
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

export const getMsgs = async (req,res) => {
    try{
        const {id : userToChartId} = req.params;
        const myId = req.user._id;
        const messages = await Msg.find({
            $or: [
                {sender : myId, receiver: userToChartId},
                {sender : userToChartId, receiver: myId},
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}

export const sendMsg = async (req,res) => {
    try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl ;
        if(image){
            const result = await cloudinary.v2.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMsg = new Msg({
            senderId,
            receiverId,
            text,
            img: imageUrl,
        });

        await newMsg.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverId) {
            io.to(receiverSocketId).emit("newMsg",newMsg);
        }
        res.status(200).json(newMsg);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}