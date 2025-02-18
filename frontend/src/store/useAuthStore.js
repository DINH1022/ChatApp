import { disconnect } from "mongoose";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import {create} from "zustand";

const BASE_URL = import.meta.env.MODE == "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth : false,
    onlineUsers : [],
    socket : null,


    checkAuth : async () => {
        try{
            const res = await axiosInstance.get("auth/check_auth");
            set({authUser : res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in check auth", error);
            set({authUser : null});
        } finally {
            set({isCheckingAuth : false});
        }
    },
    signup : async (data) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("auth/sign_up",data);
            set({authUser : res.data});
            toast.success("Sign up successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error in sign up", error);
            toast.error("Sign up failed");
        } finally {
            set({isSigningUp : false});
        }
    },
    login : async (data) => {
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post("auth/sign_in",data);
            set({authUser : res.data});
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error in login", error);
            toast.error("Login failed");
        } finally {
            set({isLoggingIn : false});
        }
    },
    logout : async () => {
        try {
            const res = await axiosInstance.post("auth/logout");
            set({authUser : null});
            toast.success("Logout successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logout", error);
            toast.error("Logout failed");
        } 
    },

    updateProfile : async (data) => {
        set({isUpdatingProfile : true});
        try {
            const res = await axiosInstance.put("auth/update",data);
            set({authUser : res.data});
            toast.success("Update successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error in update", error);
            toast.error("Update failed");
        } finally {
            set({isUpdatingProfile : false});
        }
    },

    connectSocket : () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query: {
                userId : authUser._id,
            },

        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket : () => {
        if (get().socket?.connected) get().socket.disconnect();
    },



}));