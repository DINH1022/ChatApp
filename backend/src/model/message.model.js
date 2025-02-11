import mongoose from 'mongoose';

const msgSchema = new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text:{
            type: String,
        },
        img:{
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Msg = mongoose.model('Msg',msgSchema);
export default Msg;