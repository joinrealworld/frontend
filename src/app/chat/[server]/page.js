"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';
import { Tooltip, Switch, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Button, Spinner, Progress, AvatarGroup, Avatar } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { MenuIcon, HomeIcon, MoonIcon, SunIcon, UsersIcon, LuggageIcon, BadgeCheckIcon, XIcon, ArrowLeftIcon, CheckCircleIcon, PauseCircleIcon, PlayCircleIcon } from 'lucide-react';
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
    generalChat: 3
}

const Channels = [
    {
        uuid: 'E5E9C573-2C12-4F0D-82D0-CC4C304C65D7',
        name: '✅┃daily-checklist',
        type: ChannelType.checkList,
    },
    {
        uuid: '7DE517C0-B05F-47DB-986A-0B130638C91A',
        name: '📊┃polls',
        type: ChannelType.polls,
    },
    // do not need - so code commented for now
    // {
    //     uuid: 'C97FEF69-BB37-46A1-BE13-4B0360DE218E',
    //     name: '💬┃general-chat',
    //     type: ChannelType.generalChat,
    // },
]

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
    {
        date: moment().toDate(),
        data: [
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/4JRrQgW5keC-CVQWSpZn4kL3YKQoTv5JYilOgoe7Fr?max_side=64",
                    name: "Professor Michael G",
                    isVerified: true,
                },
                content: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
                timestamp: '1713071095885',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/tf0dRUZHDWAy0qggot0uMhMf3ere4MU7LPb8raDlyH?max_side=64",
                    name: "Professor Silard",
                    isVerified: true,
                },
                content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
                timestamp: '1713071095885',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/01HRQMEYQJ3TYMDT2M3H9WJZEH?max_side=64",
                    name: "Prof. Adam",
                    isVerified: true,
                },
                content: "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
                timestamp: '1713071095885',
            },
            {
                user: {
                    image: "https://assets.therealworld.ag/avatars/01HKK69AV9FMVG9RBGWXR11A9H?max_side=64",
                    name: "DARK-MATTER",
                    isVerified: true,
                },
                content: "Nice to meet you!",
                timestamp: '1713071095885',
            },
        ]
    }
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

    const [isPollListFetch, setIsPollListFetch] = useState(false);
    const [isPollAnswerLoading, setIsPollAnswerLoading] = useState({ uuid: null });
    const [pollList, setPollList] = useState([]);
    const [isCheckListFetch, setIsCheckListFetch] = useState(false);
    const [checkList, setCheckList] = useState([]);

    const [selectedSideMenu, setSelectedSideMenu] = useState(SideMenus[0]);
    const [searchText, setSearchText] = useState('');

    const [categoryUsers, setCategoryUsers] = useState([]);
    const [isCategoryUsersFetch, setIsCategoryUsersFetch] = useState(false);

    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [isLoadingAddPoll, setIsLoadingAddPoll] = useState(false);

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

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            // get data
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
                setPollList(groupedData);
                setIsPollListFetch(true);
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

    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(mountTheme));
    }, [mountTheme]);

    useEffect(() => {
        if (props?.params?.server && selectedServer && selectedServer?.uuid && props?.params?.server != selectedServer?.uuid) {
            setSelectedServer(servers.find(s => s.uuid == props?.params?.server));
        }
    }, [props?.params?.server]);

    const onLogoutClick = (e) => {
        e.preventDefault();
        dispatch(props.actions.userLogout());
        router.replace('/');
    }

    const onChannelSelected = (channel) => async () => {
        if (channel.uuid == selectedChannel?.uuid) return;
        setSelectedChannel(channel);
        if (channel?.type == ChannelType.checkList) {
            setIsCheckListFetch(false);
            setCheckList([]);
            await getCheckListData();
        }
        else if (channel?.type == ChannelType.polls) {
            setIsPollListFetch(false);
            setPollList([]);
            await getPollsData();
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
                handleAPIError(rsp);
            }
        } else {
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
                handleAPIError(rsp);
            }
        } else {
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
                                        {user.email_verified || user.is_admin || Math.round(Math.random()) > 0 ?
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
                                            {user.email_verified || user.is_admin && <BadgeCheckIcon color={'#9e9e9e'} size={16} />}
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

    const renderMainContent = () => {
        if (selectedChannel?.type == ChannelType.checkList) {
            return renderChecklistMessage(checkList);
        }
        else if (selectedChannel?.type == ChannelType.polls) {
            return renderPolls(pollList);
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
        if (!isPollListFetch) {
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

    const renderChecklistMessage = (checkListData) => {
        if (!isCheckListFetch) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size='md' color='default' />
                </div>
            );
        }
        if (checkListData.length == 0) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--fourth-color)', opacity: 0.7, fontSize: 15, marginTop: 30 }}>No checklists available!</p>
                </div>
            );
        }
        return checkListData?.map((cData, index) => {
            return (
                <div key={index} className='message-wrap-83nja'>
                    <div className="chat-user-icon-ac2s2">
                        {index == 0 ?
                            <div className='user-info-3kzc3'>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={cData.admin_data?.avatar ? encodeURI(apiURL.slice(0, -1) + cData.admin_data?.avatar) : "/assets/person.png"}
                                        style={{ height: 40, width: 40, borderRadius: '50%', }}
                                    />
                                    <img
                                        src={"/assets/queen.svg"}
                                        style={{ position: 'absolute', bottom: 0, right: -6, height: 14, width: 14, borderRadius: '50%' }}
                                    />
                                </div>
                            </div>
                            :
                            <div style={{ alignItems: 'center' }}>
                            </div>
                        }
                    </div>
                    <div className="message-ac2s2">
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <p className='user-name-3kzc3' style={{ color: '#f1c40f', fontWeight: '400' }}>{cData.admin_data.first_name} {cData.admin_data.last_name}</p>
                                <BadgeCheckIcon color={'#f1c40f'} size={13} style={{ marginLeft: 4 }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
                            <p className='message-text-3kzc3'>
                                {parse(cData.checklist)}
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', marginTop: 10, marginBottom: 10 }}>
                                    {cData.options.map((checklist, index) => {
                                        return (
                                            // <Tooltip
                                            //     content={
                                            //         <div style={{ width: 70, height: 100, backgroundColor: 'var(--third-color)' }}>
                                            //             {cData.checked?.[checklist]?.map?.((checklist, index) => { return checklist.user; })?.join?.(', ')}
                                            //         </div>
                                            //     }
                                            //     closeDelay={100}
                                            // >
                                            <div className='checklist-answer-923mas' key={index} style={{}} onClick={answerChecklistClick(checklist, cData)}>
                                                {checklist}
                                                <div style={{ marginLeft: 10 }}>{cData.checked?.[checklist]?.length ?? 0}</div>
                                            </div>
                                            // </Tooltip>
                                        );
                                    })}
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            );
        })
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
                    <div style={{ width: '67%', overflowX: 'hidden', overflowY: 'hidden' }}>


                        {/* START - chat content */}
                        <div id='chat-content' style={{ flex: 1, height: '90%', overflowX: 'hidden', overflowY: 'auto', padding: '20px 0px' }}>

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

                            <div>
                                {renderMainContent()}
                            </div>
                        </div>
                        {/* END - chat content */}


                        {/* START - chat input */}
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



                    </div>
                    {/* END - chat input  END - chat left content */}

                    {/* START - chat right content */}
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success">
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success">
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
        </div>
    )
}

export default connect(Chat);