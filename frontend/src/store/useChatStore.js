import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set,get)=>({
    messages: [],
    users: [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async () => {
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("messages/users"); // Changed from message/users to messages/users
            set({users : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in getting users", error);
        } finally {
            set({isUsersLoading : false});
        }
    },
    getMessages : async (userId) => {
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`messages/msgs/${userId}`); // Changed from message/msgs to messages/msgs
            set({messages : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in getting msgs", error);
        } finally {
            set({isMessagesLoading : false});
        }
    },
    sendMessages : async (msgData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`messages/msgs/${selectedUser._id}`, msgData); // Changed from message/msgs to messages/msgs
            set({messages : [...messages,res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in sending msgs", error);
        } 
    },
    subscribeToMessages : () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;

            set({
                messages : [...get().messages,newMessage],
            });
        });
    },
    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser) => set({selectedUser}),

}));