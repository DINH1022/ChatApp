import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        fullname:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
        },
        avatar:{
            type: String,
            default: "https://res.cloudinary.com/dxkufsejm/image/upload/v1621402313/avatar/avatar_cugq40.png",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User",userSchema);
export default User;