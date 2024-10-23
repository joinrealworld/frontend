"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';
import { Tooltip, Switch, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Button, Spinner, Progress, AvatarGroup, Avatar } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { MenuIcon, HomeIcon, MoonIcon, SunIcon, UsersIcon, LuggageIcon, BadgeCheckIcon, XIcon, ArrowLeftIcon, CheckCircleIcon, PauseCircleIcon, PlayCircleIcon, ClipboardList, Ticket, Fullscreen } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import moment from 'moment';
import $ from 'jquery';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import { SmileyFaceEmojiArray, apiURL, dateFormat, handleAPIError } from '@/constant/global';
import { darkTheme } from "@/themes/darkTheme";
import { lightTheme } from "@/themes/lightTheme";
import ValidatedForm from '@/components/ValidatedForm';
import Image from 'next/image';

const ChannelType = {
    checkList: 1,
    polls: 2,
    media: 3,
    blackHole: 4,
    raffles: 5,
    support: 6,
    streaming: 7,
    clans: 8,
    feedback: 9,
    savedProgressChannels: 10
}

const Channels = [
    {
        uuid: '8385ae4e-65c5-4287-a8cf-b4c64fec4ee4',
        name: '✅┃daily-checklist',
        type: ChannelType.checkList,
    },
    {
        uuid: '4ebafc15-3f53-49ec-9f11-7395e7669108',
        name: '📊┃polls',
        type: ChannelType.polls,
    },
    {
        uuid: '65720aef-5446-43f3-91fc-86fc3f19b6e6',
        name: '🎞️┃streaming',
        type: ChannelType.streaming,
    },
    {
        uuid: '2ca63800-92ac-45ba-b856-bd9de193212a',
        name: '🗄️┃clans',
        type: ChannelType.clans,
    },
    {
        uuid: '7DE517C0-B05F-47DB-986A-0B130638C91B',
        name: '📱| media',
        type: ChannelType.media,
    },
    {
        uuid: '7DE517C0-B05F-47DB-986A-0B130638C91C',
        name: '⚫ | black-hole',
        type: ChannelType.blackHole,
    },
    {
        uuid: '7DE517C0-B05F-47DB-986A-0B130638C91D',
        name: '🎟️ | raffles',
        type: ChannelType.raffles,
    },
    {
        uuid: '7DE517C0-B05F-47DB-986A-0B130638C91E',
        name: '❔| support',
        type: ChannelType.support,
    },
    {
        uuid: 'f7496b8d-fcbe-4b97-bdb8-e434c03068bc',
        name: '❔| saved in-progress channels',
        type: ChannelType.savedProgressChannels,
    },
    // do not need - so code commented for now
    // {
    //     uuid: 'C97FEF69-BB37-46A1-BE13-4B0360DE218E',
    //     name: '💬┃general-chat',
    //     type: ChannelType.generalChat,
    // },
]

const FeedbackChannel = {
    uuid: '3ca33a20-01ac-45ba-b852-bd9de921212a',
    name: '🗄️┃feedbacks',
    type: ChannelType.feedback,
}

const SideMenus = [
    {
        Value: 1,
        Icon: () => <UsersIcon color="var(--fourth-color)" size={20} />
    },
    // zzz - removed other two tabs - no need for now
    // {
    //     Value: 2,
    //     Icon: () => <SearchIcon color="var(--fourth-color)" size={20} />
    // },
    // {
    //     Value: 3,
    //     Icon: () => <InboxIcon color="var(--fourth-color)" size={20} />
    // },
];

const dummyMessages = [
    { 'username': "Harsh Patel", 'message': "Hello, how are you?" },
    { 'username': "Amit Shah", 'message': "Just finished my work." },
    { 'username': "Priya Desai", 'message': "Did you watch the game?" },
    { 'username': "Rohan Gupta", 'message': "Let's catch up this weekend!" },
    { 'username': "Megha Jain", 'message': "Just got my new laptop!" },
    { 'username': "Sonali Rao", 'message': "Let's start the project next week." },
    { 'username': "Aditya Khanna", 'message': "Can you share the document?" },
    { 'username': "Vikas Saxena", 'message': "Lunch tomorrow?" },
    { 'username': "Pooja Nair", 'message': "Got your message, will reply soon." }
];

const dummyNumbers = [
    { 'username': "Harsh Patel", 'number': 1 },
    { 'username': "Amit Shah", 'number': 2 },
    { 'username': "Priya Desai", 'number': 3 },
    { 'username': "Rohan Gupta", 'number': 4 },
    { 'username': "Megha Jain", 'number': 5 },
    { 'username': "Sonali Rao", 'number': 6 },
    { 'username': "Aditya Khanna", 'number': 7 },
    { 'username': "Vikas Saxena", 'number': 8 },
    { 'username': "Pooja Nair", 'number': 9 },
    { 'username': "Lcd Nair", 'number': 10 },

];

const currentUser = {
    id: "2", // Example of a hardcoded current user ID for testing
    name: "John Doe",
    image: "https://example.com/avatar.jpg",
    isVerified: true
};

const dummyadminMessage = [{
    user: {
        id: "2", // Fake admin ID
        name: "Admin",
        image: "/assets/person.png",
        isVerified: true
    },
    timestamp: new Date().getTime(),
    content: "Hello, how can I assist you today?"
}];

const ChatData = [
    {
        date: moment().subtract(3, 'days').toDate(),
        data: [
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/4JRrQgW5keC-CVQWSpZn4kL3YKQoTv5JYilOgoe7Fr?max_side=64",
                    name: "Professor Michael G",
                    isVerified: true,
                },
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                timestamp: '1712811870803',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/tf0dRUZHDWAy0qggot0uMhMf3ere4MU7LPb8raDlyH?max_side=64",
                    name: "Professor Silard",
                    isVerified: true,
                },
                content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
                timestamp: '1712811870803',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/01HRQMEYQJ3TYMDT2M3H9WJZEH?max_side=64",
                    name: "Prof. Adam",
                    isVerified: true,
                },
                content: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
                timestamp: '1712811870803',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/01HKK69AV9FMVG9RBGWXR11A9H?max_side=64",
                    name: "DARK-MATTER",
                    isVerified: true,
                },
                content: "Great!",
                timestamp: '1712811870803',
            },
        ]
    },
    // {
    //     date: moment().toDate(),
    //     data: [
    //         {
    //             user: {
    //                 image: "https://assets.therealworld.ag/avatars/4JRrQgW5keC-CVQWSpZn4kL3YKQoTv5JYilOgoe7Fr?max_side=64",
    //                 name: "Professor Michael G",
    //                 isVerified: true,
    //             },
    //             content: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    //             timestamp: '1713071095885',
    //         },
    //         {
    //             user: {
    //                 image: "https://assets.therealworld.ag/avatars/tf0dRUZHDWAy0qggot0uMhMf3ere4MU7LPb8raDlyH?max_side=64",
    //                 name: "Professor Silard",
    //                 isVerified: true,
    //             },
    //             content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
    //             timestamp: '1713071095885',
    //         },
    //         {
    //             user: {
    //                 image: "https://assets.therealworld.ag/avatars/01HRQMEYQJ3TYMDT2M3H9WJZEH?max_side=64",
    //                 name: "Prof. Adam",
    //                 isVerified: true,
    //             },
    //             content: "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    //             timestamp: '1713071095885',
    //         },
    //         {
    //             user: {
    //                 image: "https://assets.therealworld.ag/avatars/01HKK69AV9FMVG9RBGWXR11A9H?max_side=64",
    //                 name: "DARK-MATTER",
    //                 isVerified: true,
    //             },
    //             content: "Nice to meet you!",
    //             timestamp: '1713071095885',
    //         },
    //     ]
    // }
]


const IDENTITY_BOOSTER_COIN_PRICE = 20;

function Chat(props) {

    const dispatch = useDispatch();
    const router = useRouter();
    const path = usePathname();

    const [servers, setServers] = useState(props.chat.serverList ?? []);
    const [selectedServer, setSelectedServer] = useState(null);

    const [channels, setChannels] = useState(Channels);
    const [selectedChannel, setSelectedChannel] = useState(Channels[0]);

    const [isPollAnswerLoading, setIsPollAnswerLoading] = useState({ uuid: null });
    const [isChatDataFetch, setIsChatDataFetch] = useState(false);
    const [chatData, setChatData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [checkCompletedList, setCheckCompletedList] = useState([]);
    const [isMediaListFetch, setIsMediaListFetch] = useState(false);
    const [mediaList, setMediaList] = useState([]);

    const [checkList, setCheckList] = useState([]);
    const [isCheckListFetch, setIsCheckListFetch] = useState(false);

    const [checkedMediaRules, setCheckedMediaRules] = useState({});
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);


    const [sendText, setSendText] = useState('');
    const [blackHoleList, setBlackHoleList] = useState([]);

    const [raffleList, setRaffleList] = useState(dummyNumbers);

    const [selectedSideMenu, setSelectedSideMenu] = useState(SideMenus[0]);
    const [searchText, setSearchText] = useState('');

    const [categoryUsers, setCategoryUsers] = useState([]);
    const [isCategoryUsersFetch, setIsCategoryUsersFetch] = useState(false);

    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [isLoadingAddPoll, setIsLoadingAddPoll] = useState(false);

    const [isLoadingRandomVideoClick, setIsLoadingRandomVideoClick] = useState(false);

    const [isLoadingSuitcaseClick, setIsLoadingSuitcaseClick] = useState(false);
    const [isLoadingChangeWallpaper, setIsLoadingChangeWallpaper] = useState({ isLoading: false, itemId: null });
    const [chatBackgroundWallpapers, setChatBackgroundWallpapers] = useState(false);

    const [isLoadingPurchaseEmoji, setIsLoadingPurchaseEmoji] = useState(false);

    const [soundClickData, setSoundClickData] = useState([]);
    const [playedSoundClick, setPlayedSoundClick] = useState({ itemId: null });
    const [isLoadingChangeSoundClick, setIsLoadingChangeSoundClick] = useState({ isLoading: false, itemId: null });

    const [isChooseBackground, setIsChooseBackground] = useState(false);
    const [chatBackgroundImage, setChatBackgroundImage] = useState(props.user?.user?.selected_wallpaper ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.selected_wallpaper) : "");

    const [isChooseSoundClick, setIsChooseSoundClick] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [positions, setPositions] = useState([]);
    const [velocities, setVelocities] = useState([]);
    const padding = 82;
    const containerHeight = window.innerHeight * 0.82;
    const containerWidth = window.innerWidth * 1;
    const blackbackgroundColor = selectedChannel?.type === ChannelType.blackHole ? 'black' : 'var(--seventh-color)';
    const blackChatbackgroundColor = selectedChannel?.type === ChannelType.blackHole ? 'black' : 'var(--third-color)';
    const overflowBlackHole = selectedChannel?.type === ChannelType.blackHole ? 'hidden' : selectedChannel?.type === ChannelType.raffles ? 'hidden' : 'auto';
    const widthBlackHole = selectedChannel?.type === ChannelType.blackHole ? '100%' : selectedChannel?.type === ChannelType.raffles ? "100%" : '67%';
    const [isFullscreen, setIsFullscreen] = useState(false);
    const calculateTimeLeft = () => {
        const now = new Date(); // Get the current local time
        const midnight = new Date(); // Create a new date object for midnight
        midnight.setHours(24, 0, 0, 0); // Set the time to exactly 24:00 (midnight)
        
        const timeLeftInMs = midnight - now; // Calculate the milliseconds difference between now and midnight
        const timeLeftInSeconds = Math.floor(timeLeftInMs / 1000); // Convert the difference to seconds

        return timeLeftInSeconds;
    };

    const [timeLeft, setTimeLeft] = useState(() => {
        // Retrieve saved time or calculate the remaining time from 24 hours
        const savedTime = localStorage.getItem('timeLeft');
        return calculateTimeLeft();
    });

    const [supportList, setSupportList] = useState([]);
    const [adminMessages, setAdminMessages] = useState(dummyadminMessage);
    const [sendMessage, setSendMessage] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [raffleSent, setRaffleSent] = useState(false);

    const handleMouseEnter = () => setIsModalVisible(true);

    // Update positions when a new message is added
    useEffect(() => {
        const interval = setInterval(() => {
            setPositions((prevPositions) =>
                prevPositions.map((pos, index) => {
                    let { top, left } = pos;

                    // If velocity is undefined, set default values with reduced speed
                    let velocityX = velocities[index]?.velocityX || 0.05;  // Reduced speed
                    let velocityY = velocities[index]?.velocityY || 0.05;

                    // Calculate new position
                    let newTop = top + velocityY;
                    let newLeft = left + velocityX;

                    // Bounce off top/bottom
                    if (newTop < padding / containerHeight * 100 || newTop > 100 - padding / containerHeight * 100) {
                        velocityY = -velocityY;
                    }

                    // Bounce off left/right
                    if (newLeft < padding / containerWidth * 100 || newLeft > 100 - padding / containerWidth * 100) {
                        velocityX = -velocityX;
                    }

                    // Update velocity for next frame
                    velocities[index] = { velocityX, velocityY };

                    return { top: newTop, left: newLeft };
                })
            );
        }, 50); // Adjust for smoother motion

        return () => clearInterval(interval);
    }, [positions, velocities]);

    // Effect to initialize new positions and velocities
    useEffect(() => {
        const initializePositionsAndVelocities = (list, existingPositions) => {
            return list.slice(existingPositions.length).map(() => {
                const randomTop = Math.random() * (containerHeight - 2 * padding) + padding;
                const randomLeft = Math.random() * (containerWidth - 2 * padding) + padding;

                const newPosition = {
                    top: (randomTop / containerHeight) * 100,
                    left: (randomLeft / containerWidth) * 100
                };

                const newVelocity = {
                    velocityX: Math.random() * 0.1 + 0.02,
                    velocityY: Math.random() * 0.1 + 0.02
                };

                return { newPosition, newVelocity };
            });
        };

        if (positions.length < blackHoleList.length) {
            const newItems = initializePositionsAndVelocities(blackHoleList, positions);
            setPositions((prevPositions) => [
                ...prevPositions,
                ...newItems.map(item => item.newPosition)
            ]);
            setVelocities((prevVelocities) => [
                ...prevVelocities,
                ...newItems.map(item => item.newVelocity)
            ]);
        }

        if (positions.length < raffleList.length) {
            const newItems = initializePositionsAndVelocities(raffleList, positions);
            setPositions((prevPositions) => [
                ...prevPositions,
                ...newItems.map(item => item.newPosition)
            ]);
            setVelocities((prevVelocities) => [
                ...prevVelocities,
                ...newItems.map(item => item.newVelocity)
            ]);
        }
    }, [blackHoleList, raffleList, positions, velocities, containerHeight, containerWidth, padding]);



    const [mountTheme, setMountTheme] = useState(
        JSON.parse(localStorage.getItem("theme")) || "dark"
    );


    const addPollModel = useDisclosure({
        id: 'ask-poll',
    });

    const coinModel = useDisclosure({
        id: 'coin-modal',
    });

    const suitcaseModel = useDisclosure({
        id: 'suitcase-modal',
    });

    const onlineCountModel = useDisclosure({
        id: 'online-count-modal',
    });

    const mediaContractModel = useDisclosure({
        id: 'media-contract-modal',
    });

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            // get data
            if (props.user?.user?.is_admin) {
                setChannels([...Channels, FeedbackChannel]);
            }
            getInitData();
            setChatBackground();
        }
    }, []);

    const getProfile = async () => {
        const response = await fetch(apiURL + 'api/v1/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            if (rsp.payload && rsp.payload?.id) {
                dispatch(props.actions.setUser({
                    user: rsp.payload
                }));
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            }
        }
    }

    const setChatBackground = () => {
        if (props.user?.user?.selected_wallpaper) {
            let url = encodeURI(apiURL.slice(0, -1) + props.user?.user?.selected_wallpaper);
            $('#chat-background').css('background-image', 'url(' + url + ')');
            $('#chat-background').css('background-size', 'contain');
            $('#chat-background').css('background-repeat', 'round');
            setChatBackgroundImage(url);
        } else {
            $('#chat-background').css('background-image', 'unset');
            $('#chat-background').css('background-size', 'unset');
            $('#chat-background').css('background-repeat', 'unset');
            $('#chat-background').css('background-color', 'var(--third-color)');
            setChatBackgroundImage("");
        }
    }

    const getInitData = async () => {
        getProfile();
        await getServers();
        scrollToBottomChatContent();
        // setRaffleList((prevList) => {
        //     if (Array.isArray(prevList)) {
        //         return [...prevList, { 'username': "Harsh Patel", 'number': 1 }];
        //     }
        // });
    }

    const getServers = async () => {
        const response = await fetch(apiURL + 'api/v1/channel/fetch/master_category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload && typeof rsp.payload == 'object') {
                setServers(rsp.payload);
                dispatch(props.actions.setServerList({
                    serverList: rsp.payload
                }));
                let selectedServerData = rsp.payload?.find?.(s => s?.uuid == props?.params?.server);
                if (selectedServerData) {
                    setSelectedServer(selectedServerData);
                    // get category user list by category uuid
                    await getCheckListData(selectedServerData?.uuid);
                    getCategoryUserList(selectedServerData?.uuid);
                } else {
                    router.replace('/chat');
                }
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getCheckListData = async (masterCategoryId = selectedServer?.uuid) => {

        const response = await fetch(apiURL + 'api/v1/checklist/fetch/' + masterCategoryId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            setIsCheckListFetch(true);
            setCheckList(rsp.payload);
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getCategoryUserList = async (category) => {
        const response = await fetch(apiURL + 'api/v1/channel/fetch/users/' + category, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            setCategoryUsers(rsp.payload.filter(user => user.first_name != null && user.first_name != ""));
            setIsCategoryUsersFetch(true);
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            }
        }
    }

    const getPollsData = async () => {
        const response = await fetch(apiURL + 'api/v1/polls/poll-list/' + selectedServer?.uuid, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload && typeof rsp.payload == 'object') {
                let groupedData = [];
                rsp.payload.sort((a, b) => {
                    return new Date(a.created_at) - new Date(b.created_at);
                })
                rsp.payload.map(item => {
                    let index = groupedData.findIndex(s => moment(s.created_at).startOf('date').isSame(moment(item.created_at).startOf('date')));
                    if (index > -1) {
                        groupedData[index].data.push(item);
                    } else {
                        groupedData.push({
                            created_at: item.created_at,
                            data: [item]
                        });
                    }
                });
                setChatData(groupedData);
                setIsChatDataFetch(true);
                setIsPollAnswerLoading({ uuid: null });
                scrollToBottomChatContent();
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getStreamingData = async () => {
        const response = await fetch(apiURL + 'api/v1/streams/live-streams', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp && typeof rsp == 'object') {
                setChatData(rsp);
                setIsChatDataFetch(true);
                scrollToBottomChatContent();
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getClansData = async () => {
        const response = await fetch(apiURL + 'api/v1/clan/users', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload && typeof rsp.payload == 'object') {
                setChatData(Object.values(rsp.payload));
                setIsChatDataFetch(true);
                scrollToBottomChatContent();
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getFeedbackData = async () => {
        const response = await fetch(apiURL + 'api/v1/feedback/fetch', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload && typeof rsp.payload == 'object') {
                setChatData(rsp.payload);
                setIsChatDataFetch(true);
                scrollToBottomChatContent();
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getSavedProgressData = async () => {
        // zzz - in progress
        const response = await fetch(apiURL + 'api/v1/channel/save/progress/channel', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload && typeof rsp.payload == 'object') {
                // zzz
                console.log("rsp.payload --------------------------------");
                console.log(rsp.payload);
                setChatData([rsp.payload]);
                setIsChatDataFetch(true);
                scrollToBottomChatContent();
            } else {
                toast("Error while fetching data!");
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getBlackHoleData = async () => {
        const response = await fetch(apiURL + 'api/v1/blackhall/fetch/message', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();

        if (response.status >= 200 && response.status < 300) {
            const filteredData = rsp.data.filter(item => item !== null);
            setBlackHoleList(filteredData);
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    const getSupportData = async () => {
        const response = await fetch(apiURL + 'api/v1/support/support_list', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp = await response.json();

        if (response.status >= 200 && response.status < 300) {
            setSupportList(rsp.payload);

        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Error while fetching data!");
            }
        }
    }

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(mountTheme));
    }, [mountTheme]);

    useEffect(() => {
        if (props?.params?.server && selectedServer && selectedServer?.uuid && props?.params?.server != selectedServer?.uuid) {
            setSelectedServer(servers.find(s => s.uuid == props?.params?.server));
        }
    }, [props?.params?.server]);

    const onChannelSelected = (channel) => async () => {
        if (channel.uuid == selectedChannel?.uuid) return;
        setSelectedChannel(channel);
        setIsChatDataFetch(false);
        setChatData([]);
        if (channel?.type == ChannelType.checkList) {
            await getCheckListData();
        }
        else if (channel?.type == ChannelType.polls) {
            await getPollsData();
        }
        else if (channel?.type == ChannelType.blackHole) {
            await getBlackHoleData();
        }
        else if (channel?.type == ChannelType.support) {
            await getSupportData();
        }
        else if (channel?.type == ChannelType.streaming) {
            await getStreamingData();
        }
        else if (channel?.type == ChannelType.clans) {
            await getClansData();
        }
        else if (channel?.type == ChannelType.feedback) {
            await getFeedbackData();
        }
        else if (channel?.type == ChannelType.savedProgressChannels) {
            await getSavedProgressData();
        }
        // do not need - so code commented for now
        // else if (channel?.type == ChannelType.generalChat) {

        // }
    }

    const scrollToBottomChatContent = () => {
        setTimeout(() => {
            $('#chat-content')?.animate({
                scrollTop: ($("#chat-content")?.offset?.()?.top ?? 0) + ($("#chat-content")?.[0]?.scrollHeight ?? 0)
            }, 10);
        }, 10);
    }

    const bold = (text) => {
        var bold = /\*\*(.*?)\*\*/gm;
        var html = text.replace(bold, '<strong>$1</strong>');
        return html;
    }

    const onMenuToggle = (e) => {
        e.preventDefault();
        $('#sidebar').toggleClass("visible");
        $('#chat').toggleClass("visible");
    }

    const onChangeTheme = (theme) => {
        if (theme == 'light') {
            setMountTheme("light");
            lightTheme();
        } else {
            setMountTheme("dark");
            darkTheme();
        }
        changeTheme(props.user.authToken, theme);
    }

    const onAddMedia = () => {
        if (selectedChannel?.type == ChannelType.polls) {
            if (props.user?.user?.is_admin) {
                addPollModel.onOpen();
            }
        }
    }

    const changeTheme = async (authToken, theme) => {
        const response = await fetch(apiURL + 'api/v1/user/theme', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                theme: theme
            })
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                if (theme == 'dark') {
                    toast("Dark Mode applied!");
                } else {
                    toast("Light Mode applied!");
                }
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            }
        }
    }

    const onRefreshData = (e) => {
        e.preventDefault();
        router.refresh();
    }

    const getWallpapersSoundData = () => {
        getWallpapers(props.user.authToken, () => {
            getTunes(props.user.authToken, () => {
                suitcaseModel.onOpen();
                setIsLoadingSuitcaseClick(false);
            });
        });
    }

    const onSuitCaseClick = (e) => {
        setIsLoadingSuitcaseClick(true);
        getWallpapersSoundData();
    }

    const getRandomVideoData = async (authToken) => {
        try {
            setIsLoadingRandomVideoClick(true);
            const response = await fetch(apiURL + 'api/v1/channel/random/button?master_category_uuid=' + props?.params?.server, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
            });
            const rsp = await response.json();
            console.log(response.status);
            console.log(rsp);
            if (response.status >= 200 && response.status < 300) {
                if (rsp.status == 1 && rsp.payload && typeof rsp.payload === 'object') {
                    if (rsp.payload?.category_uuid && rsp.payload?.course_id && rsp.payload?.content_uuid) {
                        router.push(rsp.payload?.master_categroy_uuid + `/courses/${rsp.payload?.category_uuid}?cid=${rsp.payload?.course_id}&lid=${rsp.payload?.content_uuid}`);
                        setIsLoadingRandomVideoClick(false);
                    }
                } else {
                    handleAPIError(rsp);
                    setIsLoadingRandomVideoClick(false);
                }
            } else {
                if (response.status == 401) {
                    dispatch(props.actions.userLogout());
                } else {
                    handleAPIError(rsp);
                }
                setIsLoadingRandomVideoClick(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoadingRandomVideoClick(false);
        }
    }

    const onRandomVideoClick = (e) => {
        getRandomVideoData(props.user.authToken);
    }

    const onFeedbackVideoClick = (item) => {
        setIsLoadingRandomVideoClick(true);
        setTimeout(() => {
            // zzz
            router.push(props?.params?.server + '/courses/5ff78efe-3ed2-4bc6-b64d-35cab5b3f792?cid=' + item.course + '&lid=' + item?.content?.uuid);
            setIsLoadingRandomVideoClick(false);
        }, 1500);
    }

    const purchaseIdentityBooster = async (authToken) => {
        setIsLoadingPurchaseEmoji(true);
        let formData = new FormData();
        formData.append('coin', IDENTITY_BOOSTER_COIN_PRICE);
        const response = await fetch(apiURL + 'api/v1/user/purches/identity_booster', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.status == 1) {
                toast("Identity booster purchased successfully!");
                let user = { ...props.user?.user };
                user.identity_booster = true;
                dispatch(props.actions.setUser({
                    user
                }));
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingPurchaseEmoji(false);
    }

    const getWallpapers = async (authToken, onSuccess = () => { }) => {
        const response = await fetch(apiURL + 'api/v1/user/fetch/wallpapers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                setChatBackgroundWallpapers(rsp.payload);
                onSuccess();
            } else {
                setIsLoadingSuitcaseClick(false);
                handleAPIError(rsp);
            }
        } else {
            setIsLoadingSuitcaseClick(false);
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
    }

    const purchaseWallpaper = async (authToken, item) => {
        setIsLoadingChangeWallpaper({ isLoading: true, itemId: item.uuid });
        let formData = new FormData();
        formData.append('uuid', item.uuid);
        const response = await fetch(apiURL + 'api/v1/user/buy/wallpapers', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                changeWallpaper(authToken, item);
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingChangeWallpaper({ isLoading: false, itemId: null });
    }

    const changeWallpaper = async (authToken, item, isDefault = false) => {
        setIsLoadingChangeWallpaper({ isLoading: true, itemId: item?.uuid });
        let formData = new FormData();
        formData.append('uuid', item?.uuid);
        if (isDefault) {
            formData.append('is_default', 'True');
        }
        const response = await fetch(apiURL + 'api/v1/user/change/wallpaper', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                if (isDefault) {
                    $('#chat-background').css('background-image', 'unset');
                    $('#chat-background').css('background-size', 'unset');
                    $('#chat-background').css('background-repeat', 'unset');
                    $('#chat-background').css('background-color', 'var(--third-color)');
                    setChatBackgroundImage("");
                    toast('Default Background set successfully!');
                } else {
                    $('#chat-background').css('background-image', 'url(' + encodeURI(apiURL.slice(0, -1) + item?.wallpaper) + ')');
                    $('#chat-background').css('background-size', 'contain');
                    $('#chat-background').css('background-repeat', 'round');
                    toast('Background Image set successfully!');
                    setChatBackgroundImage(encodeURI(apiURL.slice(0, -1) + item?.wallpaper));
                }
                getWallpapers(authToken);
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingChangeWallpaper({ isLoading: false, itemId: null });
    }

    const getTunes = async (authToken, onSuccess = () => { }) => {
        const response = await fetch(apiURL + 'api/v1/user/list/tune', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            }
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                setSoundClickData(rsp.payload);
                onSuccess();
            } else {
                setIsLoadingSuitcaseClick(false);
                handleAPIError(rsp);
            }
        } else {
            setIsLoadingSuitcaseClick(false);
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
    }

    const purchaseTune = async (authToken, item) => {
        setIsLoadingChangeSoundClick({ isLoading: true, itemId: item.uuid });
        let formData = new FormData();
        formData.append('uuid', item.uuid);
        const response = await fetch(apiURL + 'api/v1/user/purches/tune', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                changeTune(authToken, item);
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingChangeSoundClick({ isLoading: false, itemId: null });
    }

    const changeTune = async (authToken, item) => {
        setIsLoadingChangeSoundClick({ isLoading: true, itemId: item.uuid });
        let formData = new FormData();
        formData.append('uuid', item.uuid);
        const response = await fetch(apiURL + 'api/v1/user/change/tune', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                localStorage.setItem('sound_click_tune', item.tune);
                getTunes(authToken);
                toast('Sound selected successfully!');
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingChangeSoundClick({ isLoading: false, itemId: null });
    }

    const onCreatePoll = async (authToken) => {
        setIsLoadingAddPoll(true);
        let formData = new FormData();
        formData.append('master_category', selectedServer?.uuid);
        formData.append('question', pollQuestion);
        pollOptions.forEach(pollOption => {
            formData.append('options', pollOption);
        });
        const response = await fetch(apiURL + 'api/v1/polls/create_poll', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.status == 1) {
                getPollsData();
                addPollModel.onClose();
                toast('Poll created successfully!');
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        setIsLoadingAddPoll(false);
    }

    const handleMediaRulesCheck = (item) => {
        setCheckedMediaRules((prevCheckedItems) => ({
            ...prevCheckedItems,
            [item]: prevCheckedItems[item] === 'true' ? 'false' : 'true'
        }));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set the drawing color to white and other properties
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round'; // Optional: makes lines smooth

        // Function to get mouse position relative to the canvas
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseDown = (e) => {
            const { x, y } = getMousePos(e);
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const handleMouseMove = (e) => {
            if (!isDrawing) return;
            const { x, y } = getMousePos(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const handleMouseUp = () => {
            if (isDrawing) {
                setIsDrawing(false);
                ctx.closePath();
            }
        };

        const handleMouseLeave = () => {
            if (isDrawing) {
                setIsDrawing(false);
                ctx.closePath();
            }
        };

        // Attach event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup event listeners on component unmount
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isDrawing]); // Dependency array can be expanded if needed

    const clearSignature = () => {
        setCheckedMediaRules([]);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        // router.replace('/media');
        if (canvas) {
            const signatureData = canvas.toDataURL();
            localStorage.setItem('signature', signatureData);
            router.replace('/media');
        }
    };

    const renderSideMenuOption = () => {
        if (selectedSideMenu?.Value == 1) {
            if (!isCategoryUsersFetch) {
                return (
                    <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner size='md' color='default' />
                    </div>
                );
            }
            return (
                <div style={{ padding: '10px 15px' }}>
                    {categoryUsers.map((user, index) => {
                        return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 15 }}>
                                {/* <span style={{ fontSize: 14, color: 'var(--fourth-color)', marginBottom: 8 }}>{item.title}</span> */}
                                {/* {item.users.map((user, index) => {
                                    return ( */}
                                <div className='user-info-3kzc3' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={user.avatar ? user.avatar : '/assets/person.png'}
                                            style={{ height: 36, width: 36, borderRadius: '50%' }}
                                        />
                                        {user.is_online && <div style={{ position: 'absolute', bottom: 0, backgroundColor: '#36d399', width: 9, height: 9, borderRadius: '50%', marginRight: 6 }} />}
                                        {/* random generate "isQueen" show or not */}
                                        {/* zzz */}
                                        {user.ai_picture ?
                                            <img
                                                src={"/assets/queen.svg"}
                                                style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
                                            />
                                            :
                                            null
                                        }
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 12 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <p className='user-name-3kzc3'>{user.first_name} {user.last_name} {user.selected_emoji}</p>
                                            {user.is_admin && <BadgeCheckIcon color={'#9e9e9e'} size={16} />}
                                        </div>
                                        <p className='user-description-3kzc3'>{user.bio}</p>
                                    </div>
                                </div>
                                {/* );
                                })} */}
                            </div>
                        );
                    })}
                </div>
            );
        }
        else if (selectedSideMenu?.Value == 2) {
            return (
                <div style={{ padding: '10px 15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <label style={{ alignSelf: 'flex-end' }} for="sorting"></label>
                        <select style={{ justifySelf: 'flex-end', backgroundColor: 'transparent', color: 'var(--fourth-color)', fontSize: 13 }} name="Sorting" id="sorting" defaultValue={'MostRelevant'}>
                            <option value="MostRelevant">Most Relevant</option>
                            <option value="Latest">Latest</option>
                            <option value="Oldest">Oldest</option>
                        </select>
                    </div>

                    <div>
                        <form style={{ backgroundColor: 'var(--third-color)', marginTop: 10 }} className="scrollbar-thumb-base-100 relative flex w-full flex-col items-center overflow-x-scroll rounded-md p-3" novalidate="">
                            <div className="flex w-full flex-wrap items-center justify-start">
                            </div>
                            <input
                                style={{ fontSize: 14, color: 'var(--fourth-color)', }}
                                type="search"
                                className="w-full flex-1 resize-none border-none bg-transparent outline-none"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(event) =>
                                    setSearchText(event.target.value)
                                }
                            />
                        </form>
                    </div>

                    <div style={{ color: 'var(--fourth-color)', fontSize: 13, marginTop: 20 }} className="pb-2 pt-1 opacity-50">Type <span className="font-mono">@user</span> or <span className="font-mono">#channel</span> to narrow your search.</div>

                </div>
            );
        }
        else if (selectedSideMenu?.Value == 3) {
            return (
                <div style={{ padding: '10px 15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <div style={{ display: 'flex' }}>
                            <label style={{ alignSelf: 'flex-end' }} for="sorting"></label>
                            <select style={{ width: '90%', justifySelf: 'flex-end', backgroundColor: 'transparent', borderRadius: 8, padding: '5px 3px 5px 10px', borderWidth: 1, borderColor: 'var(--third-color)', color: 'var(--fourth-color)', fontSize: 13 }} name="Sorting" id="sorting" defaultValue={'MostRelevant'}>
                                <option value="AllMentions">All mentions</option>
                                <option value="OnlyDirectMentions">Only direct mentions</option>
                            </select>
                        </div>
                        <div style={{ backgroundColor: '#ef4444' }} className="flex h-6 w-6 justify-center rounded-full">
                            <p style={{ color: 'var(--fourth-color)', fontSize: 15, justifyContent: 'center' }} className="text-xs">0</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 35, alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
                        <svg
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill='#e5e7eb'
                            data-testid="CheckCircleIcon"
                            style={{ width: 48, height: 48 }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z">
                            </path>
                        </svg>
                        <div style={{ color: 'var(--fourth-color)', fontSize: 15, fontWeight: '700' }} className="mt-3 text-lg font-bold">You're all caught up.</div>
                    </div>


                </div>
            );
        }
    }

    const [content, setContent] = useState(null);

    useEffect(() => {
        if (selectedChannel?.type == ChannelType.media) {
            mediaContractModel.onOpen();
            setIsDrawing(true);
            // Alternatively, you might want to redirect here
            // router.replace('/media');
        } else {
        }
    }, [selectedChannel]);

    const renderMainContent = () => {
        if (selectedChannel?.type == ChannelType.checkList) {
            return renderChecklistMessage(chatData);
        }
        else if (selectedChannel?.type == ChannelType.polls) {
            return renderPolls(chatData);
        }
        else if (selectedChannel?.type == ChannelType.streaming) {
            return renderStreaming(chatData);
        }
        else if (selectedChannel?.type == ChannelType.clans) {
            return renderClans(chatData);
        }
        else if (selectedChannel?.type == ChannelType.feedback) {
            return renderFeedbacks(chatData);
        }
        else if (selectedChannel?.type == ChannelType.blackHole) {
            return renderBlackHole();
        }
        else if (selectedChannel?.type == ChannelType.raffles) {
            return renderRaffle();
        }
        else if (selectedChannel?.type == ChannelType.support) {
            return (selectedMessage ? renderSelectedMessage() : renderSupport())
        }
        else if (selectedChannel?.type == ChannelType.savedProgressChannels) {
            return renderSavedProgressChannels(chatData);
        }
        // do not need - so code commented for now
        // else if (selectedChannel?.type == ChannelType.generalChat) {
        //     return renderChatMessage({});
        // }
    }

    // do not need - so code commented for now
    // const renderChatMessage = (course) => {
    //     return course?.data?.map((cData, index) => {
    //         return (
    //             <div key={index} className='message-wrap-83nja'>
    //                 <div className="chat-user-icon-ac2s2">
    //                     {index == 0 ?
    //                         <div className='user-info-3kzc3'>
    //                             <div style={{ position: 'relative' }} >
    //                                 <img
    //                                     src={cData.user.image}
    //                                     style={{ height: 40, width: 40, borderRadius: '50%', }}
    //                                 />
    //                                 <img
    //                                     src={"assets/queen.svg"}
    //                                     style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
    //                                 />
    //                             </div>
    //                         </div>
    //                         :
    //                         null
    //                         // <div style={{ alignItems: 'center', display: 'none' }} className='message-datetime-zkn22d'>
    //                         //     <p style={{ color: 'var(--fourth-color)', opacity: 0.6, fontSize: 11, marginTop: 20 }}>{moment(cData.timestamp)}</p>
    //                         // </div>
    //                     }
    //                 </div>
    //                 <div className="message-ac2s2">
    //                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
    //                         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    //                             <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>{cData.user.name}</p>
    //                             {cData.user.isVerified && <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />}
    //                             <p className='date-text-3kzc3'>
    //                                 {dateFormat(cData.timestamp)}
    //                             </p>
    //                         </div>
    //                     </div>

    //                     <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
    //                         <p className='message-text-3kzc3'>
    //                             {parse(cData.content)}
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     })
    // }

    const answerPoll = async (authToken, bodyData) => {
        const response = await fetch(apiURL + 'api/v1/polls/answer-poll', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: bodyData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.status == 1) {
                await getPollsData();
            } else {
                toast(rsp.payload + '');
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            }
        }
    }

    const answerPollOptionClick = (questionId, optionId) => () => {
        setIsPollAnswerLoading({ uuid: optionId });
        let formData = new FormData();
        formData.append('question_id', questionId);
        formData.append('selected_option_id', optionId);
        answerPoll(props.user.authToken, formData);
    }

    const renderPolls = (pollsData) => {
        if (!isChatDataFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (pollsData.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No polls available!</p>
                </div>
            );
        }
        return pollsData.map((course, index) => {
            return (
                <div key={index} style={{}}>
                    <div className='message-divider-date-wrap-7naj82b'>
                        <div className='message-divider-date-7naj82b'>
                            {moment(course?.date).format('MMMM DD, YYYY')}
                        </div>
                    </div>
                    {course?.data?.map((cData, index) => {
                        let adminUser = typeof cData?.admin_data == 'object' && cData?.admin_data?.length > 0 ? cData.admin_data?.find(x => x.first_name != '' && x.first_name != null && x.first_name != undefined) : null;
                        return (
                            <div key={index} className='message-wrap-83nja'>
                                <div className="message-ac2s2">
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>{adminUser?.first_name + " " + adminUser?.last_name + " " + (adminUser?.selected_emoji ?? '')}</p>
                                            <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
                                            <p className='date-text-3kzc3'>
                                                {dateFormat(cData.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10, marginTop: 10 }}>
                                        <p className='message-text-3kzc3'>
                                            <b>{cData.quetion}</b>
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap' }}>
                                            {cData.options.map((pollOption, index) => {
                                                return (
                                                    <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }} onClick={answerPollOptionClick(cData?.uuid, pollOption?.uuid)}>
                                                        {isPollAnswerLoading.uuid == pollOption?.uuid ?
                                                            <div className='poll-answer-923mas'>
                                                                <Spinner size='sm' color='default' style={{ height: 10, width: 10, borderRadius: 5 }} />
                                                            </div>
                                                            :
                                                            <div className='poll-answer-923mas'>{pollOption.no_of_selected_by_user}</div>
                                                        }
                                                        <p className='options-text-3kzc3'>{pollOption.option}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        });
    }

    const onStreamingClick = (video) => () => {
        window.open(video.url);
    }

    const renderStreaming = (streamingData) => {
        if (!isChatDataFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (streamingData.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No streams available!</p>
                </div>
            );
        }
        return streamingData.map((course, index) => {
            return (
                <div key={index} className='stream-wrap-83nja'>
                    <li className="stream-box-ac2s2" style={{ marginTop: 0, cursor: 'pointer' }} onClick={onStreamingClick(course)}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span className="f1-bold--xs" style={{ minWidth: 35, width: 'unset' }}>NBA</span>
                            <span className="team-color-icon" style={{ background: '#00D2BE' }}></span>
                            <span className="f1--xs MacBaslik">
                                <span className="d-md-inline f1-capitalize">
                                    {course.title}
                                </span>
                            </span>
                        </div>
                        <span className="f1-podium-right">
                            {/* zzz */}
                            {index > 5 ?
                                <div className='stream-live-wrap'>
                                    <span className="stream-live" style={{ color: '#ce2b2b' }}>• LIVE</span>
                                </div>
                                :
                                <div className='stream-live-wrap'>
                                    {/* zzz */}
                                    <span className="stream-live">Today {moment().format('hh:mm A')}</span>
                                </div>
                            }
                            <i className="icon icon-chevron-right f1-color--warmRed"></i>
                        </span>
                    </li>
                </div>
            );
        });
    }

    const renderClans = (clansData) => {
        if (!isChatDataFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (clansData.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No clans available!</p>
                </div>
            );
        }
        return clansData.map((clan, index) => {
            return (
                <div key={index} className='stream-wrap-83nja'>
                    {clan?.length > 0 &&
                        <li className="stream-box-ac2s2" style={{ marginTop: 0, cursor: 'pointer' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <span className="f1-bold--xs" style={{ minWidth: 35, width: 'unset' }}>NBA</span>
                                <span className="team-color-icon" style={{ background: '#00D2BE' }}></span>
                                <span className="f1--xs MacBaslik">
                                    {/* zzz */}
                                    <span className="d-md-inline f1-capitalize">
                                        {"clan.title"}
                                    </span>
                                </span>
                            </div>
                            <span className="f1-podium-right">
                                {/* zzz */}

                                <i className="icon icon-chevron-right f1-color--warmRed"></i>
                            </span>
                        </li>
                    }
                </div>
            );
        });
    }


    const renderFeedbacks = (data) => {
        if (!isChatDataFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (data.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No feedbacks available!</p>
                </div>
            );
        }
        return data.map((item, index) => {
            return (
                <div key={index} className='feedback-wrap-83nja'>
                    <div className="feedback-box-ac2s2" style={{ marginTop: 0, cursor: 'pointer' }} onClick={onStreamingClick(item)}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
                                <img
                                    key={index}
                                    size='sm'
                                    style={{
                                        height: 32, width: 32, borderRadius: '50%'
                                    }}
                                    src={item?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + item?.user?.avatar) : "/assets/person.png"}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <span style={{ flex: 1, color: 'var(--fourth-color)', fontSize: 13.5, letterSpacing: 0.6, fontWeight: '500', marginLeft: 12 }}>
                                        {item?.user?.first_name + ' ' + item?.user?.last_name}
                                        <span style={{ fontSize: 13, opacity: 0.5, fontWeight: '100', marginLeft: 4 }}>
                                            gave feedback for video of
                                        </span>
                                        <span style={{ marginLeft: 4 }}>
                                            🍼┃tutorials
                                        </span>
                                        <span style={{ fontSize: 13, opacity: 0.5, fontWeight: '100', marginLeft: 4 }}>
                                            course.
                                        </span>
                                    </span>
                                    <span style={{ flex: 1, color: 'var(--fourth-color)', opacity: 0.6, fontSize: 9, fontWeight: '300', marginLeft: 12 }}>
                                        {moment(item.created_at).format('DD MMM, YYYY')}
                                    </span>
                                </div>
                            </div>
                            <span className="f1--xs MacBaslik" style={{ marginTop: 20 }}>
                                <span style={{ color: 'var(--fourth-color)', fontSize: 13, letterSpacing: 0.6, fontWeight: '300', marginLeft: 4 }}>
                                    {item.description}
                                </span>
                            </span>
                        </div>
                        <span className="f1-podium-right">
                            <div className='feedback-live-wrap' onClick={(e) => onFeedbackVideoClick(item)}>
                                <PlayCircleIcon size={30} className="refresh" />
                                <span className="feedback-icon-text">Play</span>
                            </div>
                        </span>
                    </div>
                </div>
            );
        });
    }

    const renderSavedProgressChannels = (data) => {
        if (!isChatDataFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (data.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No saved progress channels available!</p>
                </div>
            );
        }
        return data.map((item, index) => {
            return (
                <div key={index} className='feedback-wrap-83nja'>
                    <div className="feedback-box-ac2s2" style={{ marginTop: 0, cursor: 'pointer' }} onClick={onStreamingClick(item)}>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
                                <img
                                    key={index}
                                    size='sm'
                                    style={{
                                        height: 32, width: 32, borderRadius: '50%'
                                    }}
                                    src={item?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + item?.user?.avatar) : "/assets/person.png"}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <span style={{ flex: 1, color: 'var(--fourth-color)', fontSize: 13.5, letterSpacing: 0.6, fontWeight: '500', marginLeft: 12 }}>
                                        {item?.user?.first_name + ' ' + item?.user?.last_name}
                                        <span style={{ fontSize: 13, opacity: 0.5, fontWeight: '100', marginLeft: 4 }}>
                                            gave feedback for video of
                                        </span>
                                        <span style={{ marginLeft: 4 }}>
                                            🍼┃tutorials
                                        </span>
                                        <span style={{ fontSize: 13, opacity: 0.5, fontWeight: '100', marginLeft: 4 }}>
                                            course.
                                        </span>
                                    </span>
                                    <span style={{ flex: 1, color: 'var(--fourth-color)', opacity: 0.6, fontSize: 9, fontWeight: '300', marginLeft: 12 }}>
                                        {moment(item.created_at).format('DD MMM, YYYY')}
                                    </span>
                                </div>
                            </div>
                            <span className="f1--xs MacBaslik" style={{ marginTop: 20 }}>
                                <span style={{ color: 'var(--fourth-color)', fontSize: 13, letterSpacing: 0.6, fontWeight: '300', marginLeft: 4 }}>
                                    {item.description}
                                </span>
                            </span>
                        </div>
                        <span className="f1-podium-right">
                            <div className='feedback-live-wrap' onClick={(e) => onFeedbackVideoClick(item)}>
                                <PlayCircleIcon size={30} className="refresh" />
                                <span className="feedback-icon-text">Play</span>
                            </div>
                        </span>
                    </div>
                </div>
            );
        });
    }

    const answerChecklist = async (authToken, bodyData) => {
        const response = await fetch(apiURL + 'api/v1/checklist/submit', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: bodyData
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp.status == 1) {
                await getCheckListData();
            } else {
                toast(rsp.payload + '');
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            }
        }
    }

    const answerChecklistClick = (selected, cData) => () => {
        if (!cData.checked?.[selected]?.find(c => c?.user?.uuid === props.user?.user?.uuid)) {
            let user_checklist = cData.uuid;
            let formData = new FormData();
            formData.append('selected', selected);
            formData.append('user_checklist', user_checklist);
            answerChecklist(props.user.authToken, formData);
        }
    }


    // Handle checking/unchecking an item
    const handleItemCheck = (item, type) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: type // Either 'cross' or 'true'
        }));
    };

    const submitChecklist = async () => {
        const itemsToAdd = Object.entries(checkedItems).map(([item, type]) => ({
            item,
            type
        }));

        // // Add all checked items to checkCompletedList
        setCheckCompletedList(prevList => {
            // Create a map from the previous list for quick lookup
            const prevListMap = new Map(prevList.map(entry => [entry.item, entry.type]));

            // Combine previous list and new items, updating types if necessary
            const updatedList = [
                ...prevList.filter(entry => {
                    const currentType = prevListMap.get(entry.item);
                    // Keep item if type is the same or it's not in the new items
                    return itemsToAdd.some(newEntry => newEntry.item === entry.item && newEntry.type === currentType);
                }),
                ...itemsToAdd.filter(newEntry => {
                    // Add new item if it's not in the previous list or type is different
                    return !prevListMap.has(newEntry.item) || prevListMap.get(newEntry.item) !== newEntry.type;
                })
            ];
            return updatedList;
        });
        const response = await fetch(apiURL + 'api/v1/checklist/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.user.authToken
            },
            body: JSON.stringify({
                "master_category": selectedServer?.uuid,
                "data": checkCompletedList
            })
        });
        const rsp = await response.json();
        if (response.status >= 200 && response.status < 300) {
            if (rsp) {
                await getCheckListData();
            } else {
                handleAPIError(rsp);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
            }
        }
        // Hide modal
        setIsModalVisible(false);
    };




    const renderChecklistMessage = (checkListData) => {
        // if (!isCheckListFetch) {
        //     return (
        //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //             <Spinner size='md' color='default' />
        //         </div>
        //     );
        // }
        // if (checkListData.length == 0) {
        //     return (
        //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //             <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No checklists available!</p>
        //         </div>
        //     );
        // }
        // return checkListData?.map((cData, index) => {
        //     return (
        //         <div key={index} className='message-wrap-83nja'>
        //             <div className="chat-user-icon-ac2s2">
        //                 {index == 0 ?
        //                     <div className='user-info-3kzc3'>
        //                         <div style={{ position: 'relative' }}>
        //                             <img
        //                                 src={cData.admin_data?.avatar ? encodeURI(apiURL.slice(0, -1) + cData.admin_data?.avatar) : "/assets/person.png"}
        //                                 style={{ height: 40, width: 40, borderRadius: '50%', }}
        //                             />
        //                             <img
        //                                 src={"/assets/queen.svg"}
        //                                 style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
        //                             />
        //                         </div>
        //                     </div>
        //                     :
        //                     <div style={{ alignItems: 'center' }}>
        //                     </div>
        //                 }
        //             </div>
        //             <div className="message-ac2s2">
        //                 <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
        //                     <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        //                         <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>
        //                             {cData.admin_data.first_name} {cData.admin_data.last_name}
        //                             </p>
        //                         <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
        //                     </div>
        //                 </div>

        //                 <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
        //                     <p className='message-text-3kzc3'>
        //                         {parse(cData.checklist)}
        //                         <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', marginTop: 10, marginBottom: 10 }}>
        //                             {cData.options.map((checklist, index) => {
        //                                 return (
        //                                     // <Tooltip
        //                                     //     content={
        //                                     //         <div style={{ width: 70, height: 100, backgroundColor: 'var(--third-color)' }}>
        //                                     //             {cData.checked?.[checklist]?.map?.((checklist, index) => { return checklist.user; })?.join?.(', ')}
        //                                     //         </div>
        //                                     //     }
        //                                     //     closeDelay={100}
        //                                     // >
        //                                     <div className='checklist-answer-923mas' key={index} style={{}} onClick={answerChecklistClick(checklist, cData)}>
        //                                         {checklist}
        //                                         <div style={{ marginLeft: 10 }}>{cData.checked?.[checklist]?.length ?? 0}</div>
        //                                     </div>
        //                                     // </Tooltip>
        //                                 );
        //                             })}
        //                         </div>
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // })

        if (!isCheckListFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }

        return (
            <>
                {checkList.length === 0
                    ? null
                    : checkList?.map((cData, index) => {
                        // Formatting the timestamp (you can customize it as per your need)
                        const formattedDate = new Date(cData.created_at).toLocaleString();

                        return (
                            <div key={index} className='message-wrap-83nja' >
                                <div className="chat-user-icon-ac2s2">
                                    <div className='user-info-3kzc3'>
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src="/assets/person.png"
                                                style={{ height: 40, width: 40, borderRadius: '50%' }}
                                                alt="user-avatar"
                                            />
                                            <img
                                                src="/assets/queen.svg"
                                                style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
                                                alt="badge-icon"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="message-ac2s2" style={{ width: "100%" }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginBottom: 10 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>
                                                {cData.user.first_name} {cData.user.last_name}
                                            </p>
                                            <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#999', marginRight: 10, alignSelf: 'center' }}>
                                            {formattedDate}
                                        </div>
                                    </div>

                                    {/* Mapping over the data array */}
                                    {cData.data.map((itemData, itemIndex) => (
                                        <div key={itemIndex} style={{ display: 'flex', alignItems: 'center', marginLeft: 10, marginBottom: 10 }}>
                                            <div
                                                className={`custom-checkboxlist ${itemData.type === 'true' ? 'yes' : itemData.type === 'cross' ? 'cross' : ''}`}
                                                type="radio"
                                                style={{ marginRight: 10 }}
                                                disabled
                                            ></div>
                                            <p className='message-text-3kzc3' style={{ margin: 0 }}>
                                                {itemData.item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </>
        );



        // return <div className='message-wrap-83nja'>
        //     {checkCompletedList.length == 0 ? null :
        //         <div className="chat-user-icon-ac2s2">
        //             <div className='user-info-3kzc3'>
        //                 <div style={{ position: 'relative' }}>
        //                     <img
        //                         src="/assets/person.png"
        //                         style={{ height: 40, width: 40, borderRadius: '50%' }}
        //                     />
        //                     <img
        //                         src={"/assets/queen.svg"}
        //                         style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
        //                     />
        //                 </div>
        //             </div>
        //         </div>}
        //     {checkCompletedList.length == 0 ? null :
        //         <div className="message-ac2s2">

        //             <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10, marginBottom: 10 }}>
        //                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        //                     <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>
        //                         Harsh Patel
        //                     </p>
        //                     <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
        //                 </div>
        //             </div>
        //             {checkCompletedList?.map((cData, index) => (
        //                 <div key={index} style={{ display: 'flex', alignItems: 'center', marginLeft: 10, marginBottom: 10 }}>
        //                     <div
        //                         className={`custom-checkboxlist ${cData.type === 'true' ? 'yes' : cData.type === 'cross' ? 'cross' : ''}`}
        //                         type="radio"
        //                         style={{ marginRight: 10 }}
        //                         disabled
        //                     ></div>
        //                     <p className='message-text-3kzc3' style={{ margin: 0 }}>
        //                         {cData.item}
        //                     </p>
        //                 </div>
        //             ))}
        //         </div>}
        // </div>



    }

    const onSelectEmoji = async (emoji) => {
        if (props.user?.user?.identity_booster) {
            let formData = new FormData();
            formData.append('emoji', emoji);
            const response = await fetch(apiURL + 'api/v1/user/change/emoji', {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + props.user.authToken
                },
                body: formData
            });
            const rsp = await response.json();
            if (response.status >= 200 && response.status < 300) {
                if (rsp.status == 1) {
                    // update emoji manually
                    let user = { ...props.user?.user };
                    user.selected_emoji = emoji;
                    dispatch(props.actions.setUser({
                        user
                    }));
                } else {
                    toast(rsp.payload + "");
                }
            } else {
                if (response.status == 401) {
                    dispatch(props.actions.userLogout());
                }
            }
        }
    }

    const renderChatInput = () => {
        if (selectedChannel?.type !== ChannelType.streaming && selectedChannel?.type !== ChannelType.clans && selectedChannel?.type !== ChannelType.feedback) {
            return (
                <div style={{ height: '10%', backgroundColor: 'var(--seventh-color)' }} className="flex flex-col">
                    <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)' }}>
                        <div className="border-base-300 flex flex-shrink-0 items-center gap-2 border-t px-3 pt-2">
                            <input accept="image/*" id="add-media-9"
                                type="file" style={{ display: 'none' }} />
                            {selectedChannel?.type == ChannelType.polls && props.user?.user?.is_admin ?
                                <label htmlFor="add-media" className='add-media-3ca22' onClick={(e) => onAddMedia()}>
                                    +
                                </label>
                                :
                                null}
                            <div style={{ display: 'block', position: 'relative', minHeight: 32, borderRadius: 20, flex: 1, height: 32, backgroundColor: 'var(--third-color)' }}>
                                <textarea readOnly="" id="chat-input" className="resize-none border-none bg-transparent  px-3 py-1 outline-none cursor-not-allowed" placeholder={"# " + selectedChannel?.name} style={{ height: '32px !important', fontSize: 15 }}></textarea>
                            </div>
                            {/* <form style={{ display: 'block', position: 'relative', minHeight: 32, borderRadius: 20, flex: 1, height: 32, backgroundColor: 'var(--third-color)' }}>
                                        <textarea readOnly="" id="chat-input" className="resize-none border-none   bg-transparent  px-3 py-1 outline-none cursor-not-allowed" placeholder={"# " + selectedChannel?.name} style={{ height: '32px !important', fontSize: 15 }}></textarea>
                                    </form> */}
                        </div>
                    </footer>
                </div>
            );
        }
    }

    const chatContainerRef = useRef(null);

    const raffleContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [blackHoleList]);

    useEffect(() => {
        if (raffleContainerRef.current) {
            raffleContainerRef.current.scrollTop = raffleContainerRef.current.scrollHeight;
        }
    }, [raffleList]);

    const sendBlackHoleMessage = async () => {
        if (sendText != "") {
            const response = await fetch(apiURL + 'api/v1/blackhall/send/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.user.authToken
                },
                body: JSON.stringify({
                    content: sendText
                })
            });
            const rsp = await response.json();
            if (response.status >= 200 && response.status < 300) {
                if (rsp.status == 0) {
                    toast(rsp.message);
                }
                getBlackHoleData();
                setSendText("");
            } else {
                if (response.status == 401) {
                    dispatch(props.actions.userLogout());
                } else {
                    handleAPIError(rsp);
                }
            }

        }

    }


    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };



    // Timer functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    // Reset lists and timer
                    setBlackHoleList([]);
                    setRaffleList([]);
                    const resetTime = calculateTimeLeft(); // Recalculate time for the next cycle
                    localStorage.setItem('timeLeft', JSON.stringify(resetTime));
                    return resetTime;
                }

                const updatedTime = prevTime - 1;
                localStorage.setItem('timeLeft', JSON.stringify(updatedTime));  // Save updated time
                return updatedTime;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderBlackHole = () => {

        return (
            <div id="black-hole-background">
                {/* <div className='message-divider-date-wrap-7naj82b'>
                    <div className='message-divider-date-7naj82b'>
                        {moment('09/01/2024').format('MMMM DD, YYYY')}
                    </div>
                </div> */}
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 999,
                }}>
                    {/* Timer */}
                    <div style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '14px',
                    }}>
                        {formatTime(timeLeft)}
                    </div>

                    {/* Fullscreen Button */}
                    {/* {isFullscreen ? <Fullscreen style={{color:"var(--fourth-color)"}}/>:<Fullscreen style={{color:"var(--fourth-color)"}}/>} */}
                    <Fullscreen onClick={toggleFullscreen} style={{ color: "var(--fourth-color)", cursor: 'pointer' }} />
                    {/* <button
                    onClick={toggleFullscreen}
                    style={{
                        backgroundColor: isFullscreen ? '#f1c40f' : '#2980b9',
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button> */}
                </div>
                {blackHoleList.map((item, index) => {
                    const { top, left } = positions[index] || { top: 50, left: 50 };
                    return (<div key={index} className='message-wrap-83nja-float' style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <div className="message-ac2s2">
                            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>{item.username}</p>
                                    <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />

                                </div>

                            </div>
                            <p className='date-text-3kzc3'>
                                {dateFormat('09/01/2024')}
                            </p> */}
                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10, marginRight: 5 }}>
                                <p className='message-text-3kzc3'>
                                    <b>{item.message}</b>
                                </p>

                            </div>
                            <div className='message-tail' />
                        </div>
                    </div>
                    );
                })}
            </div>
        );

    }

    const sendRaffle = () => {
        setRaffleSent(true);
        setRaffleList((prevList) => {
            if (Array.isArray(prevList)) {
                return [...prevList, { 'username': "Chirag Lathiya", 'number': 11 }];
            }
            return [{ 'username': "Harsh Patel", 'message': "Text Message" }]; // or handle the error as needed
        });
    }

    const showToastRaffle = () => {
        if (raffleSent) {
            toast("You can submit only one raffle per day");
        }
    };

    const renderRaffle = () => {
        return (<div id='raffle-background' >
            <div style={{
                position: 'absolute',
                top: 20,
                right: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 999,
            }}>
                {/* Timer */}
                <div style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '14px',
                }}>
                    {formatTime(timeLeft)}
                </div>
                <Fullscreen onClick={toggleFullscreen} style={{ color: "var(--fourth-color)", cursor: 'pointer' }} />

            </div>
            {raffleList.map((item, index) => {
                const { top, left } = positions[index] || { top: 50, left: 50 };
                return (


                    <div key={index} className='message-wrap-83nja-float-raffle' style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div style={{ position: "relative", display: "inline-block", width: "60px", height: "50px" }}>
                            <Image
                                src="/assets/rafflenew.png"
                                style={{ height: "100%" }}
                                width={60}
                                height={50}
                            />
                            <span style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#000", // Or any color that contrasts with the image
                            }}>
                                {item.number}
                            </span>
                        </div>
                        {/* <div className="raffle-ac2s2">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%' }}>
                                    <p className='user-name-3kzc3-raffle' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: '#f1c40f', fontWeight: '400' }}>{item.username}
                                        <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
                                    </p>

                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40, alignItems: 'center' }}>
                                    <p className='raffle-text-3kzc3' >
                                        <b>{item.number}</b>
                                    </p>

                                </div>
                            </div>


                            <div className='left-circle' ></div>
                            <div className='right-circle' ></div>
                        </div> */}
                    </div>

                );
            })}
        </div>)
    }

    const handleClick = async (chat_id) => {
        const response1 = await fetch(apiURL + 'api/v1/support/fetch_message?support_chat_id=' + chat_id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        const rsp1 = await response1.json();
        setSelectedMessage(rsp1.payload); // Update state with the clicked message
    };

    const sendNewMessage = () => {
        if (sendMessage.trim() === '') return;

        const newMessage = {
            user: {
                id: "2", // Fake admin ID
                name: "Admin",
                image: "/assets/person.png",
                isVerified: true
            },
            timestamp: new Date().getTime(),
            content: sendMessage // The content of the new message
        };

        // Add new message to the adminMessages array
        setAdminMessages([...adminMessages, newMessage]);

        // Clear the input field and disable the button momentarily
        setSendMessage('');
    };

    const renderSupport = () => {
        return (
            <div className='whatsapp-chat-list'>
                {supportList.map((chat, index) => (
                    <div key={index} className="chat-day">
                        {/* Grouped by Day */}
                        <h4 className="chat-date">{moment(chat.created_at).format('MMMM Do, YYYY')}</h4>

                        <div
                            className="chat-item"
                            key={index}
                            onClick={() => handleClick(chat.uuid)}
                        >
                            <img
                                src={chat.user.avatar ? chat.user.avatar : "/assets/person.png"}
                                alt={chat.user.first_name}
                                className="avatar"
                            />
                            <div className="chat-content">
                                <div className="chat-header">
                                    <strong>{chat.user.first_name} {chat.user.last_name}</strong>
                                    {/* {message.user.isVerified && <span className="verified-icon">✔️</span>} */}
                                    {/* <small className="timestamp">
                                            {moment(parseInt(message.timestamp)).fromNow()}
                                        </small> */}
                                </div>
                                {/* <p className="message-preview">
                                        {message.content.length > 20 
                                            ? message.content.slice(0, 20) + "..." 
                                            : message.content
                                        }
                                    </p> */}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        )
    }


    const renderSelectedMessage = () => {
        const isSender = selectedMessage.user.id == currentUser.id; // Check if the message is sent by the current user

        return (
            <div className='chat-window'>
                {/* Current User Message (Sent) */}
                <div className="whatsapp-chat received">
                    {/* Display user info only once */}
                    <div className="message-user-info">
                        <img
                            src={selectedMessage.user.avatar ? selectedMessage.user.avatar : "/assets/person.png"}
                            alt={selectedMessage.user.first_name}
                            className="avatar"
                        />
                        <strong>{selectedMessage.user.first_name} {selectedMessage.user.last_name}</strong>
                        {/* Uncomment below to show the verified icon if needed */}
                        {/* {selectedMessage.user.isVerified && <span className="verified-icon">✔️</span>} */}
                    </div>

                    {/* Loop through and display the list of messages */}
                    <div className="message-list">
                        {selectedMessage.messages.map((message, index) => (
                            <div className="message-bubble received" key={index}>
                                <div className="message-content">
                                    <div className="message-header">
                                        <small className="timestamp">{moment(message.timestamp).fromNow()}</small>
                                    </div>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Admin Reply (Received) */}
                {adminMessages.map((message, index) => (
                    <div key={index} className="whatsapp-chat sent">
                        <div className="message-bubble sent">
                            <img
                                src={message.user.image}
                                alt={message.user.name}
                                className="avatar"
                            />
                            <div className="message-content">
                                <div className="message-header">
                                    <strong>{message.user.name}</strong>
                                    {/* {adminMessage.user.isVerified && <span className="verified-icon">✔️</span>} */}
                                    <small className="timestamp">{moment(parseInt(message.timestamp)).fromNow()}</small>
                                </div>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div className='container-2mda3'>
            {/* START - main left */}
            <div className='left-menu-8nkajbc' id="sidebar">


                {/* START - server list */}
                <div className="sidebar-3marlva">
                    <Link href={'/settings'} className="childWrapper-jb">
                        <div className="childWrapper-1j_1ub" style={{ position: 'relative' }}>
                            <Image
                                className="avatar-2mllmv4a"
                                alt="Avatar"
                                src={props.user?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.avatar) : "/assets/person.png"}
                                style={{ height: 40, width: 40, borderRadius: '50%' }}
                                width={40}
                                height={40}
                            />
                            <div style={{
                                position: 'absolute', bottom: 1, left: 1, backgroundColor: '#36d399', width: 10, height: 10,
                                borderRadius: '50%', marginRight: 6
                            }}>
                            </div>
                            <img src={"/assets/profile-king.svg"} style={{
                                position: 'absolute', bottom: 0, right: 0, height: 14, width: 14,
                                borderRadius: '50%'
                            }} />
                        </div>
                    </Link>
                    <hr className="minihr-aawlmv4a" />
                    <div className='scrollable-vertical-l0ma2c' style={{ marginTop: -9 }}>
                        {servers.map((server, index) => {
                            let isSelected = selectedServer?.uuid == server.uuid;
                            return (
                                <div key={index} style={{ position: 'relative', justifyContent: 'center' }}>
                                    <Tooltip
                                        key={index}
                                        showArrow
                                        content={server.name}
                                        color="foreground"
                                        placement='right'
                                    >
                                        <img
                                            alt="Avatar"
                                            src={isSelected ? `/assets/server${index + 1}selected.svg` : `/assets/server${index + 1}.svg`}
                                            // src={isSelected ? server.category_pic2 : server.category_pic}
                                            width={16}
                                            height={16}
                                            className="opacity-1 server-qma22ax"
                                            style={{ opacity: 1 }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                router.push('' + server.uuid);
                                            }}
                                            fetchPriority='high'
                                        />
                                    </Tooltip>
                                    {isSelected &&
                                        <div style={{ position: 'absolute', left: -5, top: '40%', backgroundColor: '#ecc879', height: 7, width: 7, borderRadius: '50%' }} />}
                                    <div style={{ position: 'absolute', zIndex: 1000, right: -4, top: -5, backgroundColor: '#dc2626', padding: '0px 2px', borderRadius: 10 }}>
                                        <p style={{ fontSize: 11, color: 'white', marginBottom: 0, fontWeight: '400' }}>{server.unread}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* END - server list */}


                {/* START - course list */}
                <div className="channels-ha3ncna">
                    <Link href={path + '/courses'} className="server-title-qmca2">
                        <HomeIcon color="var(--third-color)" size={20} />
                        <p style={{ marginLeft: 10, fontSize: 15, color: 'var(--third-color)', fontWeight: '500' }}>Courses</p>
                    </Link>
                    <div className="chgtfgF">

                        {channels.map((channel, index) => {
                            let className = channel.uuid == selectedChannel?.uuid ? 'channel-selected-1mca2' : 'channel-1mca2';
                            return (
                                <div key={index} tabIndex="-1" id="scripted" className={className} onClick={onChannelSelected(channel)}>
                                    {channel.name}
                                </div>
                            );
                        })}
                    </div>
                    <div className="account-user-39cmaz">
                        <div href={'/settings'} className='user-30cmzmc'>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', }} onClick={(e) => router.push('/settings')}>
                                <Image
                                    className="avatar-2mllmv4a"
                                    alt="Avatar"
                                    src={props.user?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.avatar) : "/assets/person.png"}
                                    style={{ height: 38, width: 38, borderRadius: '50%' }}
                                    width={38}
                                    height={38}
                                />
                                <div className="channels-footer-details-23mas">
                                    <span className="username-312c02qena">{props.user?.user?.first_name + " " + props.user?.user?.last_name + " " + (props.user?.user?.selected_emoji ?? '')}</span>
                                    <span className="tag-kla3mca2">online</span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'var(--primary-color)', padding: '5px 10px', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', }} onClick={(e) => coinModel.onOpen()}>
                                <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                                <p style={{ marginBottom: 0, marginLeft: 5, fontWeight: '600', color: '#ecc879' }}>{props.user?.user?.coin}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* END - course list  */}

            </div>
            {/* END - main left */}


            {/* START - main right */}
            <div className="vert-container-23mazz" id="chat">

                {/* START - header menu */}
                <div className="menu-23maaa">
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div id="sidebar-btn-3cjana" onClick={onMenuToggle}>
                            <MenuIcon color="var(--fourth-color)" size={20} />
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                            <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                                d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                            </path>
                        </svg>
                        <h2 className="menu-name-1mcasa">{selectedChannel.name}</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div className="flex justify-between items-center">
                            {isLoadingRandomVideoClick ?
                                <Spinner size='sm' color='default' style={{ marginRight: '2.5rem' }} />
                                :
                                <div style={{ cursor: "pointer", marginRight: '2rem' }} onClick={onRandomVideoClick}>
                                    <PlayCircleIcon size={21} className="refresh" />
                                </div>
                            }
                            {isLoadingSuitcaseClick ?
                                <Spinner size='sm' color='default' style={{ marginRight: '2.5rem' }} />
                                :
                                <div style={{ cursor: "pointer", marginRight: '2rem' }} onClick={onSuitCaseClick}>
                                    <LuggageIcon size={21} className="refresh" />
                                </div>
                            }
                            <MoonIcon size={22} className="refresh" />
                            <Switch
                                size="sm"
                                checked={mountTheme === 'light'}
                                isSelected={mountTheme === 'light'}
                                style={{ marginLeft: 7, marginRight: 0 }}
                                onChange={(e) => onChangeTheme(mountTheme === 'dark' ? 'light' : 'dark')}
                            />
                            <SunIcon size={22} className="refresh" />
                            {/* zzz */}
                            {/* <div style={{ cursor: "pointer", marginLeft: '2.5rem' }} onClick={onRefreshData}>
                                <RefreshCcw size={21} className="refresh" />
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* START - header menu */}

                {/* START - main right content */}
                <div id='chat-background' className="chat-gsdu3b">

{/* START - chat left content */}
<div style={{ width: widthBlackHole, overflowX: 'hidden', overflowY: 'hidden', position: 'relative' }}>


    {/* START - chat content */}
    <div id='chat-content' style={{ flex: 1, height: '90%', overflowX: 'hidden', overflowY: overflowBlackHole, padding: '20px 0px', backgroundColor: blackChatbackgroundColor }}>
        {selectedChannel?.type == ChannelType.raffles ? null :
            selectedChannel?.type == ChannelType.blackHole ? null :
                <div id="wrap_beginning" data-index="0" className="chat-item-wrapper will-change-transform" style={{ transform: 'translateY(0px)' }}>
                    <div style={{ margin: '20px 20px', backgroundColor: 'var(--seventh-color)', padding: '20px 20px', borderRadius: 5 }}>
                        <div style={{ color: 'var(--fourth-color)', fontSize: 18, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <svg style={{ marginRight: 5 }} width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fillRule="evenodd" clipRule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> {selectedChannel?.name}
                        </div>
                        <div style={{ color: 'var(--fourth-color)', fontSize: 15 }} className="mt-2">This is the start of your conversation.</div>
                    </div>
                </div>
        }
        <div>
            {renderMainContent()}
        </div>
        {(selectedChannel?.type == ChannelType.checkList) ? (
            <div className={`popup-modal ${isModalVisible ? 'visible' : ''}`} onMouseEnter={handleMouseEnter}>
                <div className="rectangle">
                    <div className="dot"></div>
                    <div className="rectangle-line"></div>
                </div>
                {/* <XIcon className="close-btn" onClick={handleCloseModal} /> */}
                <h3 className="modal_text_title">✅┃daily-checklist</h3>
                <div style={{ marginBottom: '42px' }}>
                    <div className='custom-checkbox-x-icon'></div>
                    <div className='custom-checkbox-icon'></div>
                </div>
               
                    <ul className="modal_body" style={{ marginTop: 20 }}>
                        {[
                            '15 secs focus on your ideal future self then review your plans to win that day',
                            'watch the morning POWER UP call of the day',
                            'Spend 10 mins reviewing your notes and/or analyzing good copy from the swipe file or Top Players',
                            'send 3-10 outreach messages OR perform 1 G work-session on client work',
                            'Train',
                            'Review your wins and losses for the day. Plan out your next day accordingly.'
                        ].map((item, index) => (
                            <li key={index}>
                                {/* Cross checkbox */}
                                <input
                                    className="custom-checkbox-x"
                                    type="radio"
                                    id={`cross${index + 1}`}
                                    name={`checkbox-group-${index}`} // Group the checkboxes
                                    checked={checkedItems[item] === 'cross'}
                                    onChange={() => handleItemCheck(item, 'cross')}
                                />
                                {/* True checkbox */}
                                <input
                                    className="custom-checkbox"
                                    type="radio"
                                    id={`list${index + 1}`}
                                    name={`checkbox-group-${index}`} // Group the checkboxes
                                    checked={checkedItems[item] === 'true'}
                                    onChange={() => handleItemCheck(item, 'true')}
                                />
                                <label className="modal_text_body" htmlFor={`list${index + 1}`}>{item}</label>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={()=>setIsModalVisible(false)} color="default" variant="ghost" className="submit-button-mdkad mr-2">
                                        <span className="next-button-text-mdkad">Cancel</span>
                                    </Button>
                <Button onClick={submitChecklist} color="default" variant="ghost" className="submit-button-mdkad ml-2">
                    <span className="next-button-text-mdkad">Submit</span>
                </Button>
            </div>
        ) : null}

    </div>
    {/* END - chat content */}


    {/* START - chat input */}
    <div style={{ height: '10%', backgroundColor: blackbackgroundColor }} className="flex flex-col">
        {(selectedChannel?.type == ChannelType.checkList) ?
            <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)' }}>
                <div className="border-base-300 flex items-center justify-center border-t px-3 pt-2">
                    {/* <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                    >
                        <ClipboardList className='clipboard-icon' size={36} />

                    </div> */}
                </div>

            </footer>
            : selectedChannel?.type == ChannelType.blackHole ?
                <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)', backgroundColor: '#000' }}>
                    <div className="border-base-300 flex items-center justify-center border-t px-3 pt-2">

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 32, borderRadius: 20, flex: 1, height: 32, }}>
                            <input type="text" name="black-hole-message"
                                className="message-input-7ajb312"
                                value={sendText}
                                onChange={(event) => { setSendText(event.target.value) }}
                            />

                            <Button className='main-button-7ajb412' size='sm' color=''
                                onClick={(e) => {
                                    sendBlackHoleMessage()
                                }}

                            >
                                Post
                            </Button>

                        </div>
                    </div>

                </footer>
                : selectedChannel?.type == ChannelType.raffles ?
                    <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)', backgroundColor: "var(--channels)" }}>
                        <div className="border-base-300 flex items-center justify-center border-t px-3 pb-3">
                            <div style={{ position: "relative", display: "inline-block", width: "250px", height: "70px" }}  >
                                <Image
                                    src="/assets/rafflenew.png"
                                    style={{ height: "100%" }}
                                    width={250}
                                    height={70}
                                    onMouseEnter={raffleSent ? showToastRaffle : sendRaffle}

                                />
                                <span style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#000", // Or any color that contrasts with the image
                                }}>
                                    Admit One
                                </span>
                            </div>
                            {/* <Image src="/assets/rafflenew.png"
                                style={{ height: "70px" }}
                                width={150}
                                height={20}
                                onMouseEnter={() => { sendRaffle() }} /> */}
                        </div>

                    </footer>
                    : (selectedChannel?.type == ChannelType.support) && selectedMessage ?
                        <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)' }}>
                            <div className="border-base-300 flex items-center justify-center border-t px-3 pt-2">

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 32, borderRadius: 20, flex: 1, height: 32, }}>
                                    <input type="text" name="support-message"
                                        className="message-input-support"
                                        value={sendMessage}
                                        onChange={(event) => { setSendMessage(event.target.value) }}
                                    />

                                    <Button className='main-button-7ajb412' size='sm' color=''
                                        onClick={(e) => {
                                            sendNewMessage()
                                        }}
                                    >
                                        Send
                                    </Button>

                                </div>
                            </div>

                        </footer>
                        : <footer className="border-grey-secondary border-t duration-keyboard w-full transition-transform" style={{ paddingBottom: 0, transform: 'translateY(0px)' }}>
                            <div className="border-base-300 flex flex-shrink-0 items-center gap-2 border-t px-3 pt-2">
                                <input accept="image/*" id="add-media-9"
                                    type="file" style={{ display: 'none' }} />
                                {selectedChannel?.type == ChannelType.polls && props.user?.user?.is_admin ?
                                    <label htmlFor="add-media" className='add-media-3ca22' onClick={(e) => onAddMedia()}>
                                        +
                                    </label>
                                    :
                                    null}
                                <div style={{ display: 'block', position: 'relative', minHeight: 32, borderRadius: 20, flex: 1, height: 32, backgroundColor: 'var(--third-color)' }}>
                                    <textarea readOnly="" id="chat-input" className="resize-none border-none bg-transparent  px-3 py-1 outline-none cursor-not-allowed" placeholder={"# " + selectedChannel?.name} style={{ height: '32px !important', fontSize: 15 }}></textarea>
                                </div>
                                {/* <form style={{ display: 'block', position: 'relative', minHeight: 32, borderRadius: 20, flex: 1, height: 32, backgroundColor: 'var(--third-color)' }}>
                    <textarea readOnly="" id="chat-input" className="resize-none border-none   bg-transparent  px-3 py-1 outline-none cursor-not-allowed" placeholder={"# " + selectedChannel?.name} style={{ height: '32px !important', fontSize: 15 }}></textarea>
                </form> */}
                            </div>
                        </footer>}
    </div>
</div>
{/* END - chat input  END - chat left content */}

{/* START - chat right content */}
{selectedChannel?.type === ChannelType.blackHole ?
    null :
    selectedChannel?.type === ChannelType.raffles ?
        null :
        <div style={{ width: '33%', overflowX: 'hidden', backgroundColor: 'var(--seventh-color)', }}>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15, marginLeft: 20 }}>
                {/* <img alt="Avatar" src={selectedServer?.category_pic} width={46} height={46} /> */}
                {/* zzz */}
                <img alt="Avatar" src={`/assets/server${selectedServer?.id}selected.svg`} width={46} height={46} />
                <div className="channels-footer-details-23mas">
                    <span className="username-312c02qena">{selectedServer?.name}</span>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ backgroundColor: '#36d399', width: 11, height: 11, borderRadius: '50%', marginRight: 6 }} />
                        <span style={{ cursor: 'pointer' }} className="tag-kla3mca2" onClick={() => onlineCountModel.onOpen()}>{selectedServer?.online_users} online</span>
                    </div>
                </div>
            </div>

            <div className="flex h-8 font-medium border-grey-400 mt-2 border-b px-2">
                {SideMenus.map((option, index) => {
                    let isSelected = selectedSideMenu.Value == option.Value;
                    return (
                        <button
                            key={index}
                            type="button"
                            className="relative flex flex-1 cursor-pointer items-center justify-center"
                            style={isSelected ? { borderBottomColor: 'var(--fifth-color)', borderBottomWidth: 3 } : {}}
                            onClick={(e) => setSelectedSideMenu(option)}
                        >
                            {option.Icon()}
                        </button >
                    );
                })}
            </div>

            <div style={{ overflowX: 'hidden', overflowY: 'scroll' }}>
                {renderSideMenuOption()}
            </div>
        </div>
}

{/* END - chat right content */}

</div>
                {/* START - main right content */}

            </div>
            {/* END - main right menu */}

            <Modal
                id="add-poll"
                isOpen={addPollModel.isOpen}
                backdrop="opaque"
                radius="md"
                onClose={() => {
                    setPollOptions(['', '']);
                    setPollQuestion('');
                }}
                onOpenChange={addPollModel.onOpenChange}
                classNames={{
                    body: "modal-mcan34",
                    header: "modal-header-mcan34 py-0",
                    // footer: "modal-footer-mcan34 py-0",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <p className='modal-title-mcan34'>Create Poll</p>
                            </ModalHeader>
                            <ModalBody>
                                <ValidatedForm
                                    rules={{
                                        pollQuestion: {
                                            required: true
                                        },
                                        pollOption_1: {
                                            required: true
                                        },
                                        pollOption_2: {
                                            required: true
                                        },
                                    }}
                                    messages={{
                                        pollQuestion: {
                                            required: "Poll question is required!",
                                        },
                                        pollOption_1: {
                                            required: "Poll option 1 is required!",
                                        },
                                        pollOption_2: {
                                            required: "Poll option 2 is required!",
                                        },
                                    }}
                                    onSubmit={() => onCreatePoll(props.user.authToken)}
                                >
                                    <form >
                                        <div className='model-body-content-82bma2'>
                                            <span className='poll-question-label-72bak'>Question:</span>
                                            <input
                                                type="text"
                                                name="pollQuestion"
                                                className="form-control-7ajb412"
                                                placeholder="Ask a question"
                                                value={pollQuestion}
                                                autoComplete="off"
                                                onChange={(event) =>
                                                    setPollQuestion(event.target.value)
                                                }
                                            />
                                            <span className='poll-options-label-72bak'>Options:</span>
                                            {pollOptions.map((option, index) => {
                                                return (
                                                    <div key={index} style={{ position: 'relative', flexDirection: 'column', justifyContent: 'center', display: 'flex' }}>
                                                        {(index >= 2 && index <= 6) &&
                                                            <XIcon
                                                                color="#EC5800"
                                                                size={20}
                                                                style={{ cursor: 'pointer', position: 'absolute', right: 10 }}
                                                                onClick={(e) => {
                                                                    let pollOptionsState = [...pollOptions];
                                                                    pollOptionsState.splice(index, 1);
                                                                    setPollOptions(pollOptionsState);
                                                                }}
                                                            />
                                                        }
                                                        <input
                                                            type="text"
                                                            name={"pollOption_" + (index + 1)}
                                                            className="form-control-7ajb412"
                                                            placeholder="+ Add"
                                                            value={pollOptions[index]}
                                                            autoComplete="off"
                                                            onChange={(event) => {
                                                                let value = event.target.value;
                                                                let pollOptionsState = [...pollOptions];
                                                                pollOptionsState[index] = value;
                                                                setPollOptions(pollOptionsState);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            })}
                                            {pollOptions.length < 6 &&
                                                <p
                                                    className='add-poll-options-72bak'
                                                    onClick={(e) => {
                                                        let pollOptionsState = [...pollOptions];
                                                        pollOptionsState.push('');
                                                        setPollOptions(pollOptionsState);
                                                    }}
                                                >
                                                    + Add New
                                                </p>
                                            }
                                        </div>
                                        <div className='modal-footer-mcan34'>
                                            <div style={{ margin: '10px 0px' }}>
                                                <Button className='side-button-7ajb412' size='lg' variant='light' onClick={onClose}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className='main-button-7ajb412'
                                                    isLoading={isLoadingAddPoll}
                                                    spinner={<Spinner color='current' size='sm' />}
                                                    size='lg'
                                                    color=''
                                                    type='submit'
                                                >
                                                    Create
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </ValidatedForm>
                            </ModalBody>
                            {/* <ModalFooter>
                                <Button className='side-button-7ajb412' size='lg' variant='light' onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className='main-button-7ajb412'
                                    isLoading={isLoadingAddPoll}
                                    spinner={<Spinner color='current' size='sm' />}
                                    size='lg'
                                    color=''
                                    type='submit'
                                >
                                    Create
                                </Button>
                            </ModalFooter> */}
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                id="coin-modal"
                isOpen={coinModel.isOpen}
                backdrop="opaque"
                radius="md"
                size='5xl'
                onClose={() => {

                }}
                onOpenChange={coinModel.onOpenChange}
                classNames={{
                    body: "coin-modal-mcan34",
                    header: "coin-modal-header-mcan34 py-0",
                    footer: "coin-modal-footer-mcan34 py-0",
                }}
                hideCloseButton
            >
                <ModalContent style={{ height: '90%' }}>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ backgroundColor: 'var(--third-color)', padding: '5px 10px', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                                        <p style={{ marginBottom: 0, marginLeft: 5, fontWeight: '600', color: '#ecc879' }}>{props.user?.user?.coin}</p>
                                    </div>
                                    <p className='coin-modal-title-mcan34'>The Coin Exchange</p>
                                </div>
                                <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => coinModel.onClose()} />
                            </ModalHeader>
                            <ModalBody>
                                <div className='coin-model-body-content-82bma2'>
                                    <p className='coin-body-title-72bak'>EXCHANGE COINS FOR POWER-UPS</p>
                                    <p className='coin-body-sub-text-72bak'>Collect coins by posting wins, completing lessons, logging in, and more.</p>
                                    <div className='coin-box-wrap-72bak'>
                                        <div className='coin-box-72bak'>
                                            <div className='coin-box-header-72bak'>
                                                <div className="coin-emoji-grid-72bak">
                                                    {SmileyFaceEmojiArray.map((emoji, index) => (
                                                        <div
                                                            key={index}
                                                            className="coin-emoji-72bak"
                                                            style={props.user?.user?.selected_emoji == emoji ? { backgroundColor: '#7d7e81', borderRadius: 6 } : {}}
                                                            onClick={(e) => onSelectEmoji(emoji)}
                                                        >
                                                            {emoji}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='coin-box-footer-72bak'>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                    <Progress
                                                        size="sm"
                                                        radius="md"
                                                        aria-label="Loading..."
                                                        value={(Math.min(props.user?.user?.coin ?? 0, IDENTITY_BOOSTER_COIN_PRICE) / IDENTITY_BOOSTER_COIN_PRICE) * 100}
                                                        style={{ marginRight: 12 }}
                                                        classNames={{
                                                            indicator: "coin-progress-72bak"
                                                        }}
                                                        color="success"
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'var(--third-color)', padding: '4px 10px 4px 10px', borderRadius: 7 }}>
                                                        {props.user?.user?.identity_booster ?
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                </svg>
                                                                <span className='coin-number-72bak'>{IDENTITY_BOOSTER_COIN_PRICE}</span>
                                                            </>
                                                            :
                                                            <>
                                                                <img alt="Avatar" src="/assets/coin.svg" width={13} height={13} />
                                                                <span className='coin-number-72bak' style={{ marginRight: 10 }}>{Math.min(props.user?.user?.coin ?? 0, IDENTITY_BOOSTER_COIN_PRICE)}/{IDENTITY_BOOSTER_COIN_PRICE}</span>
                                                            </>
                                                        }
                                                    </div>

                                                </div>
                                                <div style={{ borderTopWidth: 1, borderTopColor: 'var(--third-color)' }} />
                                                <p className='coin-body-footer-title-72bak'>IDENTITY BOOSTER</p>
                                                {props.user?.user?.identity_booster ?
                                                    <div className='main-button-7ajb412' style={{ marginLeft: 0, backgroundColor: 'var(--third-color)', color: 'var(--fourth-color)', borderRadius: 10 }}>
                                                        UNLOCKED
                                                    </div>
                                                    :
                                                    <Button
                                                        className='main-button-7ajb412'
                                                        style={{ marginLeft: 0 }}
                                                        isLoading={isLoadingPurchaseEmoji}
                                                        spinner={<Spinner color='current' size='sm' />}
                                                        size='md'
                                                        color=''
                                                        onClick={(e) => {
                                                            purchaseIdentityBooster(props.user.authToken);
                                                        }}
                                                    >
                                                        UNLOCK FOR {IDENTITY_BOOSTER_COIN_PRICE} COINS
                                                        <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                        <div className='coin-box-72bak'>
                                            <div className='coin-box-header-72bak' style={{ padding: '20px 20px 0px 20px' }}>
                                                <img
                                                    src='https://assets.therealworld.ag/attachments/ABMdrlEDDOeRE7DWbU_fTqdgNUAWzUzOAaJqOie53n?max_side=256'
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                    }}
                                                />
                                            </div>
                                            <div className='coin-box-footer-72bak'>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                    <Progress
                                                        size="sm"
                                                        radius="md"
                                                        aria-label="Loading..."
                                                        value={100}
                                                        style={{ marginRight: 12 }}
                                                        classNames={{
                                                            indicator: "coin-progress-72bak"
                                                        }}
                                                        color="success"
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'var(--third-color)', padding: '4px 10px 4px 10px', borderRadius: 7 }}>
                                                        {false ?
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-success">
                                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                </svg>
                                                                <span className='coin-number-72bak'>1,200</span>
                                                            </>
                                                            :
                                                            <>
                                                                <img alt="Avatar" src="/assets/coin.svg" width={13} height={13} />
                                                                <span className='coin-number-72bak' style={{ marginRight: 10 }}>1,200/1,200</span>
                                                            </>
                                                        }
                                                    </div>

                                                </div>
                                                <div style={{ borderTopWidth: 1, borderTopColor: 'var(--third-color)' }} />
                                                <p className='coin-body-footer-title-72bak'>VOICE NOTES</p>
                                                {/* currently we just show OUT OF STOCKS */}
                                                <div className='main-button-7ajb412' style={{ marginLeft: 0, backgroundColor: 'var(--third-color)', color: 'var(--fourth-color)', borderRadius: 10 }}>
                                                    OUT OF STOCKS
                                                </div>
                                            </div>
                                        </div>
                                        <div className='coin-box-72bak'>
                                            <div className='coin-box-header-72bak'>
                                                <img
                                                    src='https://assets.therealworld.ag/attachments/wsxTCArOqcb0oqgC3c3uSPx6Z5GqfbVA-zbyulWBVQ?max_side=256'
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                    }}
                                                />
                                            </div>
                                            <div className='coin-box-footer-72bak'>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                    <Progress
                                                        size="sm"
                                                        radius="md"
                                                        aria-label="Loading..."
                                                        value={(Number(props.user?.user?.coin ?? 0) / 10000) * 100}
                                                        style={{ marginRight: 12 }}
                                                        classNames={{
                                                            indicator: "coin-progress-72bak"
                                                        }}
                                                        color="success"
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'var(--third-color)', padding: '4px 10px 4px 10px', borderRadius: 7 }}>
                                                        {false ?
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-success">
                                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                </svg>
                                                                <span className='coin-number-72bak'>10,000</span>
                                                            </>
                                                            :
                                                            <>
                                                                <img alt="Avatar" src="/assets/coin.svg" width={13} height={13} />
                                                                <span className='coin-number-72bak' style={{ marginRight: 10 }}>{props.user?.user?.coin}/10,000</span>
                                                            </>
                                                        }
                                                    </div>

                                                </div>
                                                <div style={{ borderTopWidth: 1, borderTopColor: 'var(--third-color)' }} />
                                                <p className='coin-body-footer-title-72bak'>CREATE A CLAN</p>
                                                {/* currently we just show OUT OF STOCKS */}
                                                <div className='main-button-7ajb412' style={{ marginLeft: 0, backgroundColor: 'var(--third-color)', color: 'var(--fourth-color)', borderRadius: 10 }}>
                                                    OUT OF STOCKS
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                id="suitcase-modal"
                isOpen={suitcaseModel.isOpen}
                backdrop="opaque"
                radius="md"
                size='2xl'
                onClose={() => {
                    setIsChooseBackground(false);
                    setIsChooseSoundClick(false);
                }}
                onOpenChange={suitcaseModel.onOpenChange}
                classNames={{
                    body: "suitcase-modal-mcan34",
                    header: "suitcase-modal-header-mcan34 py-0",
                    footer: "suitcase-modal-footer-mcan34 py-0",
                }}
                hideCloseButton
            >
                <ModalContent style={{ height: '75%' }}>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {isChooseBackground &&
                                        <>
                                            <ArrowLeftIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => setIsChooseBackground(false)} />
                                            <p className='suitcase-modal-title-mcan34'>Choose a background</p>
                                        </>
                                    }
                                    {isChooseSoundClick &&
                                        <>
                                            <ArrowLeftIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => setIsChooseSoundClick(false)} />
                                            <p className='suitcase-modal-title-mcan34'>Choose a tune</p>
                                        </>
                                    }
                                    {!isChooseBackground && !isChooseSoundClick &&
                                        <p className='suitcase-modal-title-mcan34'>Choose option</p>
                                    }
                                </div>
                                <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { suitcaseModel.onClose(); setIsChooseBackground(false); setIsChooseSoundClick(false); }} />
                            </ModalHeader>
                            <ModalBody>
                                <div className='suitcase-model-body-content-82bma2'>
                                    {/* <p className='suitcase-body-title-72bak'>EXCHANGE COINS FOR POWER-UPS</p>
                                    <p className='suitcase-body-sub-text-72bak'>Collect coins by posting wins, completing lessons, logging in, and more.</p> */}
                                    {isChooseBackground ?
                                        <>
                                            <div className='suitcase-box-wrap-72bak'>
                                                <div className="suitcase-bgimage-grid-72bak">
                                                    <div style={{
                                                        height: 350,
                                                        width: '100%',
                                                        maxWidth: 280,
                                                        minWidth: 280,
                                                        // zzz
                                                        flexDirection: 'column',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <div
                                                            className='suitcase-bgimage-72bak'
                                                            style={{
                                                                backgroundColor: 'var(--third-color)',
                                                                height: 300,
                                                                borderWidth: 1,
                                                                borderColor: 'var(--fourth-color)',
                                                                width: '100%',
                                                                maxWidth: 280,
                                                                minWidth: 280,
                                                            }}
                                                        >
                                                        </div>
                                                        {chatBackgroundImage == "" ?
                                                            <Button className='main-button-7ajb412' style={{ cursor: 'unset', marginLeft: 0, backgroundColor: 'var(--seventh-color)', color: 'var(--fourth-color)' }} disabled size='sm' color='' >
                                                                Default Selected
                                                                <CheckCircleIcon color='var(--fourth-color)' strokeWidth={2.8} size={14} />
                                                            </Button>
                                                            :
                                                            <Button
                                                                className='main-button-7ajb412'
                                                                style={{ marginLeft: 0, minWidth: 280, maxWidth: 280 }}
                                                                size='sm'
                                                                color=''
                                                                onClick={(e) => {
                                                                    changeWallpaper(props.user.authToken, chatBackgroundWallpapers[0], true);
                                                                }}
                                                            >
                                                                APPLY DEFAULT
                                                            </Button>
                                                        }
                                                    </div>
                                                    {chatBackgroundWallpapers.map((bgImage, index) => (
                                                        <div key={index}
                                                            style={{ height: 350, width: '100%', maxWidth: 280, flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                                            <img src={encodeURI(apiURL.slice(0, -1) + bgImage.wallpaper)} className='suitcase-bgimage-72bak' style={{ height: 300, width: '100%' }} />
                                                            {!bgImage.is_purchase ?
                                                                <Button
                                                                    className='main-button-7ajb412'
                                                                    style={{ marginLeft: 0 }}
                                                                    size='sm'
                                                                    color=''
                                                                    isLoading={isLoadingChangeWallpaper.itemId == bgImage.uuid ? isLoadingChangeWallpaper.isLoading : false}
                                                                    spinner={<Spinner color='current' size='sm' />}
                                                                    onClick={(e) => {
                                                                        purchaseWallpaper(props.user.authToken, bgImage);
                                                                    }}
                                                                >
                                                                    UNLOCK FOR {bgImage.price} COINS
                                                                    <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                                                                </Button>
                                                                :
                                                                bgImage.selected ?
                                                                    <Button className='main-button-7ajb412' style={{ cursor: 'unset', marginLeft: 0, backgroundColor: 'var(--seventh-color)', color: 'var(--fourth-color)' }} disabled size='sm' color='' >
                                                                        Selected
                                                                        <CheckCircleIcon color='var(--fourth-color)' strokeWidth={2.8} size={14} />
                                                                    </Button>
                                                                    :
                                                                    <Button
                                                                        className='main-button-7ajb412'
                                                                        style={{ marginLeft: 0 }}
                                                                        isLoading={isLoadingChangeWallpaper.itemId == bgImage.uuid ? isLoadingChangeWallpaper.isLoading : false}
                                                                        spinner={<Spinner color='current' size='sm' />}
                                                                        size='sm'
                                                                        color=''
                                                                        onClick={(e) => {
                                                                            changeWallpaper(props.user.authToken, bgImage);
                                                                        }}
                                                                    >
                                                                        APPLY
                                                                    </Button>
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                        :
                                        null
                                    }

                                    {isChooseSoundClick ?
                                        <>
                                            <div className='suitcase-box-wrap-72bak'>
                                                <div className="suitcase-bgimage-grid-72bak">
                                                    {soundClickData.map((tune, index) => (
                                                        <div key={index}
                                                            style={{ height: 350, width: 250, flexDirection: 'column', display: 'flex', justifyContent: 'center' }}>
                                                            <div
                                                                className='suitcase-bgimage-72bak'
                                                                style={{
                                                                    height: 300, width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--seventh-color)', alignItems: 'center', justifyContent: 'center'
                                                                }}
                                                            >

                                                                {playedSoundClick?.itemId == tune.uuid ?
                                                                    <PauseCircleIcon
                                                                        color='var(--fourth-color)'
                                                                        size={100}
                                                                        strokeWidth={1}
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            setPlayedSoundClick({ itemId: null });
                                                                        }}
                                                                    />
                                                                    :
                                                                    <PlayCircleIcon
                                                                        color='var(--fourth-color)'
                                                                        size={100}
                                                                        strokeWidth={1}
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={(e) => {
                                                                            setPlayedSoundClick({ itemId: tune.uuid });
                                                                            const soundUrl = '/audio/' + tune.tune + '.mp3';
                                                                            const audio = new Audio(soundUrl);
                                                                            audio.play();
                                                                            audio.addEventListener('ended', () => {
                                                                                setPlayedSoundClick({ itemId: null });
                                                                            })
                                                                        }}
                                                                    />
                                                                }
                                                                <p style={{ color: 'var(--fourth-color)', fontSize: 16, marginTop: 10 }}>Tune {index + 1}</p>
                                                            </div>

                                                            {!tune.is_purchased ?
                                                                <Button
                                                                    className='main-button-7ajb412'
                                                                    style={{ marginLeft: 0 }}
                                                                    size='sm'
                                                                    color=''
                                                                    isLoading={isLoadingChangeSoundClick.itemId == tune.uuid ? isLoadingChangeSoundClick.isLoading : false}
                                                                    spinner={<Spinner color='current' size='sm' />}
                                                                    onClick={(e) => {
                                                                        purchaseTune(props.user.authToken, tune);
                                                                    }}
                                                                >
                                                                    UNLOCK FOR {tune.price} COINS
                                                                    <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                                                                </Button>
                                                                :
                                                                tune.selected ?
                                                                    <Button className='main-button-7ajb412' style={{ cursor: 'unset', marginLeft: 0, backgroundColor: 'var(--seventh-color)', color: 'var(--fourth-color)' }} disabled size='sm' color='' >
                                                                        Selected
                                                                        <CheckCircleIcon color='var(--fourth-color)' strokeWidth={2.8} size={14} />
                                                                    </Button>
                                                                    :
                                                                    <Button
                                                                        className='main-button-7ajb412'
                                                                        style={{ marginLeft: 0 }}
                                                                        isLoading={isLoadingChangeSoundClick.itemId == tune.uuid ? isLoadingChangeSoundClick.isLoading : false}
                                                                        spinner={<Spinner color='current' size='sm' />}
                                                                        size='sm'
                                                                        color=''
                                                                        onClick={(e) => {
                                                                            changeTune(props.user.authToken, tune);
                                                                        }}
                                                                    >
                                                                        APPLY
                                                                    </Button>
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                        :
                                        null
                                    }

                                    {!isChooseBackground && !isChooseSoundClick ?
                                        <div className='suitcase-box-wrap-72bak'>
                                            <div className='suitcase-box-72bak'>
                                                <div className='suitcase-box-header-72bak' style={{ padding: '20px 20px 10px 20px' }}>
                                                    <img
                                                        src='/assets/sound_effect_onclick.jpg'
                                                        style={{
                                                            height: '100%',
                                                            width: 'auto',
                                                        }}
                                                    />
                                                </div>
                                                <div className='suitcase-box-footer-72bak'>
                                                    <div style={{ borderTopWidth: 1, borderTopColor: 'var(--third-color)' }} />
                                                    <p className='suitcase-body-footer-title-72bak'>Sound Effect</p>
                                                    <Button className='main-button-7ajb412' style={{ marginLeft: 0 }} size='sm' color='' onClick={(e) => setIsChooseSoundClick(true)}>
                                                        Choose
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='suitcase-box-72bak'>
                                                <div className='suitcase-box-header-72bak' style={{ padding: '20px 20px 10px 20px' }}>
                                                    <img
                                                        src='/assets/background.jpg'
                                                        style={{
                                                            height: '100%',
                                                            width: 'auto',
                                                        }}
                                                    />
                                                </div>
                                                <div className='suitcase-box-footer-72bak'>
                                                    <div style={{ borderTopWidth: 1, borderTopColor: 'var(--third-color)' }} />
                                                    <p className='suitcase-body-footer-title-72bak'>Background Wallpaper</p>
                                                    <Button className='main-button-7ajb412' style={{ marginLeft: 0 }} size='sm' color='' onClick={(e) => setIsChooseBackground(true)}>
                                                        Choose
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }


                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                id="onlineCount-modal"
                isOpen={onlineCountModel.isOpen}
                backdrop="opaque"
                radius="md"
                size='2xl'
                onClose={() => {

                }}
                onOpenChange={onlineCountModel.onOpenChange}
                classNames={{
                    body: "online-count-modal-mcan34",
                    header: "online-count-modal-header-mcan34 py-0",
                    footer: "online-count-modal-footer-mcan34 py-0",
                }}
                hideCloseButton
            >
                <ModalContent style={{ height: '65%' }}>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <p className='online-count-modal-title-mcan34'>Online users</p>
                                </div>
                                <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { onlineCountModel.onClose(); setIsChooseBackground(false); setIsChooseSoundClick(false); }} />
                            </ModalHeader>
                            <ModalBody>
                                <div className='online-count-model-body-content-82bma2'>
                                    <p className='online-count-body-title-72bak'>{selectedServer?.online_users} users currently online</p>

                                    <div className='online-count-box-wrap-72bak'>
                                        <div className='online-count-box-72bak'>
                                            <div className='online-count-box-header-72bak'>
                                                <AvatarGroup
                                                    isBordered
                                                    color='default'
                                                    size='lg'
                                                    max={Math.min((selectedServer?.online_users ?? 0), 10)}
                                                    total={selectedServer?.online_users ?? 0}
                                                    renderCount={(count) => (
                                                        count > 10 && <p style={{ marginLeft: 20, width: 44, marginBottom: 0, fontSize: 15, color: 'white', textAlign: 'right' }}>+{count} users</p>
                                                    )}
                                                >
                                                    {[...categoryUsers].filter(c => c.is_online).map((value, index) => {
                                                        return (
                                                            <Avatar key={index} src={value.avatar ? value.avatar : '/assets/person.png'} />
                                                        );
                                                    })}
                                                </AvatarGroup>
                                            </div>
                                        </div>
                                        <div className='online-count-box-72bak'>
                                            <div className='online-count-box-header-72bak' style={{ justifyContent: 'center' }}>
                                                <AvatarGroup
                                                    isBordered
                                                    color='default'
                                                    size='lg'
                                                    max={4}
                                                    renderCount={(count) => null}
                                                >
                                                    {[...categoryUsers].filter(c => c.is_online).map((value, index) => {
                                                        return (
                                                            <Avatar key={index} src={value.avatar ? value.avatar : '/assets/person.png'} />
                                                        );
                                                    })}
                                                </AvatarGroup>

                                                <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ArrowLeftIcon color='var(--fourth-color)' size={40} />
                                                </div>

                                                <Avatar src={"https://i.pravatar.cc/150?u=a04258114e29026702d"} size='lg' color='default' isBordered />
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                id="media-contract-modal"
                isOpen={mediaContractModel.isOpen}
                backdrop="opaque"
                radius="md"
                size='2xl'
                onClose={() => {

                }}
                onOpenChange={mediaContractModel.onOpenChange}
                classNames={{
                    body: "online-count-modal-mcan34",
                    header: "online-count-modal-header-mcan34 py-0",
                    footer: "online-count-modal-footer-mcan34 py-0",
                }}
                hideCloseButton
            >
                <ModalContent style={{ height: '67%' }}>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <p className='online-count-modal-title-mcan34'>Media Channel Agreement</p>
                                </div>
                                <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { mediaContractModel.onClose() }} />
                            </ModalHeader>
                            <ModalBody onMouseEnter={() => setIsDrawing(false)}>
                                <div className='online-count-model-body-content-82bma2'>
                                    <p className='online-count-body-title-72bak-media'>I Will Keep My Posts ...</p>
                                    <ul className="modal_body-media" style={{ marginTop: 10 }}>
                                        {[
                                            'Short and sweet',
                                            'About progression',
                                            'About victories',
                                            'About inspiration',
                                            'Or about anything relating to our values',
                                        ].map((item, index) => (
                                            <li key={index}>
                                                {/* True checkbox */}
                                                <input
                                                    className="custom-checkbox-modal"
                                                    type="checkbox"
                                                    id={`list${index + 1}`}
                                                    name={`checkbox-group-${index}`} // Group the checkboxes
                                                    checked={checkedMediaRules[item] === 'true'}
                                                    onChange={() => handleMediaRulesCheck(item, 'true')}
                                                />
                                                <label className="modal_text_body" htmlFor={`list${index + 1}`}>{item}</label>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="signature-box" style={{ marginTop: 20 }}>
                                        <p className="signature-title">Sign Here:</p>
                                        <canvas
                                            ref={canvasRef}

                                            width={400}
                                            height={70}
                                            style={{ border: '1px solid var(--fourth-color)', borderRadius: 4, color: "var(--fourth-color)" }}
                                        />
                                        <Button onClick={clearSignature} color="default" variant="ghost" className="clear-button-mdkad" style={{ marginTop: 10 }}>
                                            <span className="next-button-text-mdkad">Clear</span>
                                        </Button>
                                        <Button onClick={saveSignature} color="default" variant="ghost" className="clear-button-mdkad" style={{ marginTop: 10, marginLeft: 20 }}>
                                            <span className="next-button-text-mdkad">Continue</span>
                                        </Button>
                                        {/* <button onClick={saveSignature} style={{ marginTop: 10 ,color:"var(--fourth-color)"}}>Save Signature</button> */}
                                    </div>

                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default connect(Chat);