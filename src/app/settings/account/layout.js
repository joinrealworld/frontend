import { appName } from "@/constant/global";

export default function Account({ children }) {
    return children;
}

export const metadata = {
    title: 'Account - ' + appName,
}