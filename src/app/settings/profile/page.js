"use client";

import { useEffect, useState } from 'react'
import { Edit3Icon, MenuIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Button, CircularProgress, Spinner } from '@nextui-org/react';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import { apiURL, handleAPIError } from '@/constant/global';

function Profile(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [user, setUser] = useState(props.user?.user);

    const [firstName, setFirstName] = useState(props.user?.user?.first_name ?? '');
    const [lastName, setLastName] = useState(props.user?.user?.last_name ?? '');
    const [bio, setBio] = useState(props.user?.user?.bio ?? '');
    const [profilePic, setProfilePic] = useState(props.user?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.avatar) : "/assets/hp.jpg");
    const [isProfilePicLoading, setIsProfilePicLoading] = useState(false);
    const [profileCover, setProfileCover] = useState(props.user?.user?.background ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.background) : "/assets/hp.jpg"); // zzz
    const [isProfileCoverLoading, setIsProfileCoverLoading] = useState(false);
    const [userStatus, setUserStatus] = useState(props.user?.user?.status ?? '');
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [isBioLoading, setIsBioLoading] = useState(false);

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            // get data
            getProfile(props.user.authToken);
        }
    }, []);

    const getProfile = async (authToken) => {
        const response = await fetch(apiURL + 'api/v1/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            }
        });
        console.log("response --------------------------------");
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload && rsp.payload?.id) {
                setUser(rsp.payload);
                setFirstName(rsp.payload?.first_name);
                setLastName(rsp.payload?.last_name);
                setBio(rsp.payload?.bio);
                setUserStatus(rsp.payload?.status);
                setProfilePic(rsp.payload?.avatar ? encodeURI(apiURL.slice(0, -1) + rsp.payload?.avatar) : "/assets/hp.jpg");
                setProfileCover(rsp.payload?.background ? encodeURI(apiURL.slice(0, -1) + rsp.payload?.background) : "/assets/hp.jpg");
                dispatch(props.actions.setUser({
                    user: rsp.payload
                }));
            } else {
                if (rsp.message && typeof rsp.message === 'string') {
                    toast(rsp.message);
                } else {
                    toast("Something went wrong!");
                }
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                toast("Something went wrong!");
            }
        }
    }

    const changeAvatar = (e) => {
        setIsProfilePicLoading(true);
        const binaryData = [e.target.files[0]];
        setProfilePic(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
        let formData = new FormData();
        formData.append('avatar', e.target.files[0]);
        onChangeProfilePic(props.user.authToken, formData);
    }

    const changeCover = (e) => {
        setIsProfileCoverLoading(true);
        const binaryData = [e.target.files[0]];
        setProfileCover(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
        let formData = new FormData();
        formData.append('background', e.target.files[0]);
        onChangeProfileCover(props.user.authToken, formData);
    }

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("invisible");
        $('#setting-menu').toggleClass("visible");
    }

    const onChangeUserStatusClick = (e) => {
        if (userStatus && userStatus != props.user?.user?.status) {
            setIsStatusLoading(true);
            onChangeUserStatus(props.user.authToken, JSON.stringify({ status: userStatus }));
        }
    }

    const onRemoveUserStatusClick = (e) => {
        setIsStatusLoading(true);
        onChangeUserStatus(props.user.authToken, JSON.stringify({ status: '' }));
    }

    const onChangeBioClick = (e) => {
        e.preventDefault();
        setIsBioLoading(true);
        onChangeBio(props.user.authToken);
    }

    const onChangeBio = async (authToken) => {
        const response = await fetch(apiURL + 'api/v1/user/change_bio', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                bio: bio,
            })
        });
        const rsp = await response.json();
        console.log("rsp.payload --------------------------------");
        console.log(rsp);
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                toast("Bio updated successfully!");
                getProfile(authToken);
                setIsBioLoading(false);
            } else {
                handleAPIError(rsp);
                setIsBioLoading(false);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
                setIsBioLoading(false);
            }
        }
    }

    const onChangeUserStatus = async (authToken, data) => {
        const response = await fetch(apiURL + 'api/v1/user/change_status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: data
        });
        const rsp = await response.json();
        console.log("rsp.payload --------------------------------");
        console.log(rsp);
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                toast("Status changed successfully!");
                getProfile(authToken);
                setIsStatusLoading(false);
            } else {
                handleAPIError(rsp);
                setIsStatusLoading(false);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                setIsStatusLoading(false);
                handleAPIError(rsp);
            }
        }
    }

    const onChangeProfilePic = async (authToken, data) => {
        const response = await fetch(apiURL + 'api/v1/user/change_avatar', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: data
        });
        const rsp = await response.json();
        console.log("rsp.payload --------------------------------");
        console.log(rsp);
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                toast("Profile Picture changed successfully!");
                getProfile(authToken);
                setIsProfilePicLoading(false);
            } else {
                handleAPIError(rsp);
                setIsProfilePicLoading(false);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
                setIsProfilePicLoading(false);
            }
        }
    }

    const onChangeProfileCover = async (authToken, data) => {
        const response = await fetch(apiURL + 'api/v1/user/change_background', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: data
        });
        const rsp = await response.json();
        console.log("rsp.payload --------------------------------");
        console.log(rsp);
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                toast("Cover changed successfully!");
                getProfile(authToken);
                setIsProfileCoverLoading(false);
            } else {
                handleAPIError(rsp);
                setIsProfileCoverLoading(false);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
                setIsProfileCoverLoading(false);
            }
        }
    }

    return (
        <div className='container-kab38c'>
            <SettingsMenu {...props} />

            <div className='right-side-8cnac'>
                <div className='w-full align-left' id="menu-icon">
                    <MenuIcon
                        color="var(--fourth-color)"
                        style={{ marginBottom: 20, cursor: 'pointer', marginLeft: '5%', textAlign: 'left' }}
                        onClick={onToggleMenu}
                    />
                </div>
                <div className='content-3mcnaj3zcs' >

                    <b className="info-title-mczw72b">Profile Picture</b>

                    <div className='profile-info-nzk3awd'>
                        <label htmlFor="user-cover" className='user-cover-ca2q3'>
                            {isProfileCoverLoading ?
                                <div style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex', borderRadius: 12, position: 'absolute', backgroundColor: 'rgba(0,0,0,0.6)', alignSelf: 'center' }}>
                                    <div style={{ marginTop: 6 }}>
                                        <CircularProgress color='warning' />
                                    </div>
                                </div>
                                :
                                <div className="cover-overlay-cn32ad"></div>
                            }
                            <Image
                                className='cover-image-34qnzcmbw'
                                src={profileCover}
                                alt="Cover"
                                width={46}
                                height={46}
                            />
                            {!isProfileCoverLoading &&
                                <div className="cover-edit-zcjn3a fadeIn-top">
                                    <input accept="image/*" className='cover-edit-zcjn3a fadeIn-top' id="user-cover" type='file' style={{ display: 'none' }} onChange={changeCover} />
                                    <Edit3Icon color='white' />
                                </div>
                            }
                        </label>

                        <label htmlFor="user-avatar" className='user-profile-ca2q3'>
                            {isProfilePicLoading ?
                                <div style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center', display: 'flex', borderRadius: '50%', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.6)', alignSelf: 'center' }}>
                                    <div>
                                        <CircularProgress color='warning' />
                                    </div>
                                </div>
                                :
                                <div className="avatar-overlay-cn32ad"></div>
                            }
                            <Image
                                className="avatar-343nasj"
                                alt="Avatar"
                                src={profilePic}
                                width={46}
                                height={46}
                            />
                            {!isProfilePicLoading &&
                                <div className="avatar-edit-zcjn3a">
                                    <input accept="image/*" className='avatar-edit-zcjn3a fadeIn-top' id="user-avatar" type='file' style={{ display: 'none', }} onChange={changeAvatar} />
                                    <Edit3Icon color='white' />
                                </div>
                            }
                        </label>
                    </div>

                    <b className="info-title-mczw72b" style={{ marginTop: 40 }}>Status</b>
                    <input
                        type="text"
                        name="status"
                        className="user-input-3mac82n"
                        placeholder="Enter status"
                        autoComplete="off"
                        value={userStatus}
                        onChange={(event) =>
                            setUserStatus(event.target.value)
                        }
                    />
                    <div style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Button className='main-button-4ajb312' isLoading={isStatusLoading} spinner={<Spinner color='current' size='sm' />} radius='sm' size='lg' color='' onClick={onChangeUserStatusClick}>
                            Change
                        </Button>
                        <Button className='side-button-7ajb312' style={{ marginLeft: 30 }} radius='sm' size='lg' color='' onClick={onRemoveUserStatusClick}>
                            Remove
                        </Button>
                    </div>

                    <b className="info-title-mczw72b" style={{ marginTop: 40 }}>Bio</b>

                    <textarea
                        type="text"
                        name="bio"
                        className="user-input-3mac82n"
                        style={{ height: 100 }}
                        aria-multiline
                        placeholder="Enter The Bio"
                        autoComplete="off"
                        value={bio}
                        onChange={(event) =>
                            setBio(event.target.value)
                        }
                    />

                    <Button className="main-button-4ajb312" isLoading={isBioLoading} spinner={<Spinner color='current' size='sm' />} radius='sm' size='lg' type="submit" disabled={bio == '' || bio == (props.user?.user?.bio + "")} color='' onClick={onChangeBioClick}>
                        Update
                    </Button>

                </div>
            </div>
        </div>
    );
}

export default connect(Profile);
