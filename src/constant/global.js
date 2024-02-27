import { toast } from "react-toastify";

export const appName = 'The Real World';
// export const apiURL = 'http://18.219.248.37:8000/';
export const apiURL = 'http://13.59.98.200:8000/';

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