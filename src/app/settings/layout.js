import { appName } from "@/constant/global";

export default function Settings({ children }) {
    return children;
}

export const metadata = {
    title: 'Settings - ' + appName,
}