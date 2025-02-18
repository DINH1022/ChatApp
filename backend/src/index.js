import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/msg.route.js";



dotenv.config();
const app=express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoute);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}
app.listen(PORT,()=> {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})