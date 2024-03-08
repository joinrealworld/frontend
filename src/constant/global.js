import { toast } from "react-toastify";

export const appName = 'The Real World';
export const apiURL = 'http://3.144.1.198:8000/';
export const apiURLDomain = '3.144.1.198';

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