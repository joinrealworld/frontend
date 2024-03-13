import { toast } from "react-toastify";

export const appName = 'The Real World';
export const apiURL = 'https://joinrealworld-backend.onrender.com/';
export const frontEndURL = 'https://join-real-world.vercel.app/';

export const isClient = () => {
    return typeof window !== "undefined"
};

export const handleAPIError = (rsp) => {
    if (rsp.payload && typeof rsp.payload === 'string') {
        toast(rsp.payload + "");
    } else {
        toast("Something went wrong!");
    }
}