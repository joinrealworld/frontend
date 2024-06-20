import moment from "moment";
import { toast } from "react-toastify";

export const appName = 'THE REAL WORLD';
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

export const transformVimeoUrl = (url) => {
    // Regular expression to match the desired parts of the URL
    const regex = /vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)(?:\?share=copy)?/;
    const match = url.match(regex);

    if (match && match.length === 3) {
        const videoId = match[1];
        const hash = match[2];
        return `vimeo/${videoId}?hash=${hash}`;
    } else {
        return 'Invalid URL';
    }
}

export const dateFormat = (dateValue) => {
    const date = moment(dateValue);
    const today = moment();
    const startOfThisWeek = moment().startOf('week');
    const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week');

    if (date.isSame(today, 'day')) {
        return `Today at ${date.format('h:mm a')}`;
    } else if (date.isSame(today.subtract(1, 'day'), 'day')) {
        // Last week
        return `Yesterday at ${date.format('h:mm a')}`;
    } else if (date.isBetween(startOfLastWeek, startOfThisWeek)) {
        // Last week
        return `Last ${date.format('dddd')}`;
    } else {
        // Anything older than last week
        return date.format('DD MMM, YYYY');
    }
}

export const SmileyFaceEmojiArray = [
    "😀", // Grinning Face
    "😃", // Grinning Face with Big Eyes
    "😄", // Grinning Face with Smiling Eyes
    "😁", // Beaming Face with Smiling Eyes
    "😆", // Grinning Squinting Face
    "😅", // Grinning Face with Sweat
    "😂", // Face with Tears of Joy
    "🤣", // Rolling on the Floor Laughing
    "😊", // Smiling Face with Smiling Eyes
    "😇", // Smiling Face with Halo
    "🙂", // Slightly Smiling Face
    "🙃", // Upside-Down Face
    "😉", // Winking Face
    "😌", // Relieved Face
    "😍", // Smiling Face with Heart-Eyes
    "🥰", // Smiling Face with Hearts
    "😘", // Face Blowing a Kiss
    "😗", // Kissing Face
    "😙", // Kissing Face with Smiling Eyes
    "😚", // Kissing Face with Closed Eyes
    "😋", // Face Savoring Food
    "😛", // Face with Tongue
    "😜", // Winking Face with Tongue
    "🤪", // Zany Face
    "😝", // Squinting Face with Tongue
    "🤑", // Money-Mouth Face
    "🤗", // Hugging Face
    "🤭", // Face with Hand Over Mouth
    "🤫", // Shushing Face
    "🤔", // Thinking Face
    "🤐", // Zipper-Mouth Face
    "🤨", // Face with Raised Eyebrow
    "😐", // Neutral Face
    "😑", // Expressionless Face
    "😶", // Face Without Mouth
    "😏", // Smirking Face
    "😒", // Unamused Face
    "🙄", // Face with Rolling Eyes
    "😬", // Grimacing Face
    "😮‍💨", // Face Exhaling
    "🤥", // Lying Face
    "😌", // Relieved Face
    "😔", // Pensive Face
    "😪", // Sleepy Face
    "🤤", // Drooling Face
    "😴", // Sleeping Face
    "😷", // Face with Medical Mask
    "🤒", // Face with Thermometer
    "🤕", // Face with Head-Bandage
    "🤢", // Nauseated Face
    "🤧", // Sneezing Face
    "🥵", // Hot Face
    "🥶", // Cold Face
    "🥴", // Woozy Face
    "😵", // Dizzy Face
    "🤯", // Exploding Head
    "🤠", // Cowboy Hat Face
    "🥳", // Partying Face
    "😎", // Smiling Face with Sunglasses
    "🤓", // Nerd Face
    "🧐", // Face with Monocle
    "😕", // Confused Face
    "😟", // Worried Face
    "🙁", // Slightly Frowning Face
    "😮", // Face with Open Mouth
    "😯", // Hushed Face
    "😲", // Astonished Face
    "😳", // Flushed Face
    "🥺", // Pleading Face
    "😦", // Frowning Face with Open Mouth
    "😧", // Anguished Face
    "😨", // Fearful Face
    "😰", // Anxious Face with Sweat
    "😥", // Sad but Relieved Face
    "😢", // Crying Face
    "😭", // Loudly Crying Face
    "😱", // Face Screaming in Fear
    "😖", // Confounded Face
    "😣", // Persevering Face
    "😞", // Disappointed Face
    "😓", // Downcast Face with Sweat
    "😩", // Weary Face
    "😫", // Tired Face
    "😤", // Face with Steam from Nose
    "😡", // Pouting Face
    "😠", // Angry Face
    "🤬", // Face with Symbols on Mouth
    "😈", // Smiling Face with Horns
    "👿", // Angry Face with Horns
    "💀", // Skull
    "☠️", // Skull and Crossbones
    "💩", // Pile of Poo
    "🤡", // Clown Face
    "👹", // Ogre
    "👺", // Goblin
    "👻", // Ghost
    "👽", // Alien
    "👾", // Alien Monster
    "🤖", // Robot
    "😺", // Grinning Cat
    "😸", // Grinning Cat with Smiling Eyes
    "😹", // Cat with Tears of Joy
    "😻", // Smiling Cat with Heart-Eyes
    "😼", // Cat with Wry Smile
    "😽", // Kissing Cat
    "🙀", // Weary Cat
    "😿", // Crying Cat
    "😾", // Pouting Cat
    "🙈", // See-No-Evil Monkey
    "🙉", // Hear-No-Evil Monkey
    "🙊"  // Speak-No-Evil Monkey
];