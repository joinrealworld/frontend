"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip, Image as NUImage } from "@nextui-org/react";
import connect from '@/components/ConnectStore/connect';
import { useDispatch } from 'react-redux';
import { MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import $ from 'jquery';

import './styles.css';

const Servers = [
    { id: '1', name: 'My server 1', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491513073389568/50df2e1bb1c06dbf33d0df5ae6a804f7.jpg" },
    { id: '2', name: 'My server 2', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491513333432360/52a0db3a1ec6abab2966c3cfdf9bab42.jpg" },
    { id: '3', name: 'My server 3', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491514239402064/b04101854afeba4a4678e63b55d2b06d.jpg" },
    { id: '4', name: 'My server 4', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491514579144756/fa6203843b2d4ad9a38fcd0b7b51a2ff.jpg" },
    { id: '5', name: 'My server 5', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491512414883840/0f34e3e19bdaa674cbe1e63c591f7d30.jpg" },
    { id: '6', name: 'My server 6', image: "https://cdn.discordapp.com/attachments/1035612834190590043/1088491512695894057/7d439cb65436be32ba475b9a38edfa1c.jpg" },
]

const Channels = [
    {
        channel_id: '1143365275656405013',
        channel_name: '🍼┃tutorials',
        messages: require("@/channels/🍼┃tutorials/messages.json").sections
    },
    {
        channel_id: '1075432486705827982',
        channel_name: '🌞┃trading-analysis',
        messages: require("@/channels/🌞┃trading-analysis/messages.json").sections
    },
    {
        channel_id: '1148594800765972490',
        channel_name: '🌱┃lawn-mowing-course',
        messages: require("@/channels/🌱┃lawn-mowing-course/messages.json").sections
    },
]

function Chat(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [selectedServer, setSelectedServer] = useState(Servers[0]);
    const [selectedChannel, setSelectedChannel] = useState(Channels[0]);

    const onLogoutClick = (e) => {
        e.preventDefault();
        dispatch(props.actions.userLogout());
        router.replace('/');
    }

    const onChannelSelected = (channel) => () => {
        setSelectedChannel(channel);
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

    return (
        // <>
        //     <div className='flex flex-col items-center' style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        //         <h1 className="mt-[20%] text-center text-[60px] font-bold text-black">Welcome</h1>
        //         <h2 className="mt-[20px] text-center text-[25px] font-bold text-black">Login Successfully!</h2>
        //         <Link href="#" onClick={onLogoutClick}>
        //             <button className="btn btn-primary" style={{ width: 'fit-content', alignSelf: 'center' }} type="submit">Logout</button>
        //         </Link>
        //     </div>
        // </>
        <div className='container-2mda3'>
            <div className='left-menu-8nkajbc' id="sidebar">
                <div className="sidebar-3marlva">
                    <Link href={'/settings'} className="childWrapper-jb">
                        <div className="childWrapper-1j_1ub">
                            <Image className="avatar-2mllmv4a" alt="Avatar" src="/assets/hp.jpg" width={46} height={46} />
                        </div>
                    </Link>
                    <hr className="minihr-aawlmv4a" />
                    <div className='scrollable-vertical-l0ma2c' style={{ marginTop: -9 }}>
                        {Servers.map((server, index) => {
                            return (
                                <Tooltip
                                    key={index}
                                    showArrow={true}
                                    content={server.name}
                                    color="success"
                                    placement='right'
                                    classNames={{
                                        base: [
                                            // arrow color
                                            "before:bg-neutral-400 dark:before:bg-white",
                                        ],
                                        content: [
                                            "rounded-full",
                                            "py-1 px-3",
                                            "bg-black text-white"
                                        ],
                                    }}
                                >
                                    <NUImage
                                        classNames={{
                                            img: `opacity-1 server-qma22ax ${selectedServer.id == server.id ? "selected-e21ax" : undefined}`,
                                        }}
                                        style={{ opacity: 1 }}
                                        src={server.image}
                                        width={46}
                                        height={46}
                                        onClick={() => setSelectedServer(server)}
                                        fetchPriority='high'
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>

                <div className="channels-ha3ncna">
                    <div className="server-title-qmca2">
                        <p>traphausemansion</p>
                    </div>
                    <div className="chgtfgF">

                        {/* <details className="category" open>
                        <summary tabindex="0" id="category">
                            <svg className="arrow-2HswgU icon-3zI3d2" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path>
                            </svg>
                            <span className='category-name'>shitni</span>
                        </summary>

                        <div tabindex="-1" id="scripted" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> different-drugz
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> dover-street-market
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> diamonds-and-foreigns
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> margiela-man
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" className="icon-2W8DHg">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M33 34.5833V7.49998H35V36.6666H9C6.791 36.6666 5 34.801 5 32.5V7.49998C5 5.19894 6.791 3.33331 9 3.33331H31V30.4166H9C7.8955 30.4166 7 31.3485 7 32.5C7 33.6515 7.8955 34.5833 9 34.5833H33ZM23.9718 9.99998L15.8889 17.9915L12.7086 14.8441L10 17.5058L15.8885 23.3333L26.6667 12.6669L23.9718 9.99998Z">
                                </path>
                            </svg> rules
                        </div>
                    </details>
                    <br />

                    <details className="category" open>
                        <summary><svg className="arrow-2HswgU icon-3zI3d2" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path>
                        </svg> text
                        </summary>

                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> crystlsctles
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> tiktoci-and-shitni
                        </div>
                    </details>
                    <br />

                    <details className="category" open>
                        <summary><svg className="arrow-2HswgU icon-3zI3d2" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path>
                        </svg> archives
                        </summary>

                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> pimi-archived
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> blackrazor-archived
                        </div>
                        <div tabindex="0" className="channel">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                </path>
                            </svg> discordian-archived
                        </div>
                    </details>
                    <br />

                    <details className="category" open>
                        <summary><svg className="arrow-2HswgU icon-3zI3d2" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path>
                        </svg> vc
                        </summary>

                        <div tabindex="0" className="channel">
                            <svg className="icon-2W8DHg" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z"
                                    aria-hidden="true"></path>
                            </svg> mollywrld
                        </div>
                    </details> */}

                        {Channels.map((channel, index) => {
                            return (
                                <div key={index} tabindex="-1" id="scripted" className="channel-1mca2" onClick={onChannelSelected(channel)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="icon-2W8DHg" aria-hidden="true" role="img">
                                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                            d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z">
                                        </path>
                                    </svg> {channel.channel_name}
                                </div>
                            );
                        })}

                    </div>

                    <div className="account-user-39cmaz">
                        <Link href={'/settings'} className='user-30cmzmc'>
                            <Image className="avatar-2mllmv4a" alt="Avatar" src="/assets/hp.jpg" width={46} height={46} />
                            <div className="channels-footer-details-23mas">
                                <span className="username-312c02qena">Harsh Patel</span>
                                <span className="tag-kla3mca2">hp120</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="vert-container-23mazz" id="chat">

                <div className="menu-23maaa">
                    <div id="sidebar-btn-3cjana" onClick={onMenuToggle}>
                        <MenuIcon color='white' size={20} />
                    </div>
                    <h2 className="menu-name-1mcasa">{selectedChannel.channel_name}</h2>
                </div>

                <div className="chat-gsdu3b">

                    {selectedChannel.messages.map((message, index) => {
                        if (message.content) {
                            return (
                                <div key={index} tabindex="-1" className="message-ac2s2">
                                    {message.content}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

export default connect(Chat);