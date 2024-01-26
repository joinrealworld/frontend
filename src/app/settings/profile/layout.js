import { appName } from "@/constant/global";

export default function Profile({ children }) {
    return children;
}

export const metadata = {
    title: 'Profile - ' + appName,
}