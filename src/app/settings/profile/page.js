"use client";

import { useEffect, useState } from 'react'
import { Edit3Icon, MenuIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import $ from 'jquery';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import Image from 'next/image';
import ValidatedForm from '@/components/ValidatedForm';
import { apiURL } from '@/constant/global';
import { toast } from 'react-toastify';

function Profile(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [user, setUser] = useState(props.user?.user);

    const [firstName, setFirstName] = useState(props.user?.user?.first_name ?? '');
    const [lastName, setLastName] = useState(props.user?.user?.last_name ?? '');
    const [bio, setBio] = useState(props.user?.user?.bio ?? '');
    const [profilePic, setProfilePic] = useState(props.user?.user?.avatar ? props.user?.user?.avatar : "/assets/hp.jpg");
    const [profileCover, setProfileCover] = useState(props.user?.user?.cover ? props.user?.user?.cover : "/assets/hp.jpg"); // zzz
    const [userStatus, setUserStatus] = useState(props.user?.user?.status ?? '');

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
                setProfilePic(rsp.payload?.avatar ?? "/assets/hp.jpg");
                setProfileCover(rsp.payload?.cover ?? "/assets/hp.jpg");
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
            toast("Something went wrong!");
        }
    }

    const changeAvatar = (e) => {
        const binaryData = [e.target.files[0]];
        setProfilePic(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
        let formData = new FormData();
        formData.append('avatar', e.target.files[0]);
        onChangeProfilePic(props.user.authToken, formData);
    }

    const changeCover = (e) => {
        const binaryData = [e.target.files[0]];
        setProfileCover(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
        let formData = new FormData();
        formData.append('background', e.target.files[0]);
        onChangeProfileCover(props.user.authToken, formData);
    }

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("visible");
    }

    const onChangeUserStatusClick = (e) => {
        if (userStatus && userStatus != props.user?.user?.status) {
            onChangeUserStatus(props.user.authToken, JSON.stringify({ status: userStatus }));
        }
    }

    const onRemoveUserStatusClick = (e) => {
        onChangeUserStatus(props.user.authToken, JSON.stringify({ status: '' }));
    }

    const onChangeUserInfoClick = () => {
        onChangeUserInfo(props.user.authToken);
    }

    const onChangeUserInfo = async (authToken) => {
        // zzz
        const response = await fetch(apiURL + 'api/v1/user/change_userinfo', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastName,
                bio: bio,
            }) // zzz
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload) {
                toast("Profile updated successfully!");
                getProfile(authToken);
            } else {
                if (rsp.message && typeof rsp.message === 'string') {
                    toast(rsp.message);
                } else {
                    toast("Something went wrong!");
                }
            }
        } else {
            toast("Something went wrong!");
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
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload) {
                toast("Status changed successfully!");
                getProfile(authToken);
            } else {
                if (rsp.message && typeof rsp.message === 'string') {
                    toast(rsp.message);
                } else {
                    toast("Something went wrong!");
                }
            }
        } else {
            toast("Something went wrong!");
        }
    }

    const onChangeProfilePic = async (authToken, data) => {
        const response = await fetch(apiURL + 'api/v1/user/change_avatar', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: data
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload) {
                toast("Profile Picture changed successfully!");
                getProfile(authToken);
            } else {
                if (rsp.message && typeof rsp.message === 'string') {
                    toast(rsp.message);
                } else {
                    toast("Something went wrong!");
                }
            }
        } else {
            toast("Something went wrong!");
        }
    }

    const onChangeProfileCover = async (authToken, data) => {
        const response = await fetch(apiURL + 'api/v1/user/change_background', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: data
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload) {
                toast("Profile Cover changed successfully!");
                getProfile(authToken);
            } else {
                if (rsp.message && typeof rsp.message === 'string') {
                    toast(rsp.message);
                } else {
                    toast("Something went wrong!");
                }
            }
        } else {
            toast("Something went wrong!");
        }
    }

    return (
        <div className='container-kab38c'>
            <SettingsMenu {...props} />

            <div className='right-side-8cnac'>
                <div className='w-full align-left' id="menu-icon">
                    <MenuIcon
                        color='white'
                        style={{ marginBottom: 20, cursor: 'pointer', marginLeft: '5%', textAlign: 'left' }}
                        onClick={onToggleMenu}
                    />
                </div>
                <div className='content-3mcnaj3zcs' style={{ paddingLeft: 30, paddingRight: 30 }}>

                    <b className="info-title-mczw72b">Profile Picture</b>

                    <div className='profile-info-nzk3awd'>
                        <label htmlFor="user-cover" className='user-cover-ca2q3'>
                            <div className="cover-overlay-cn32ad"></div>
                            <Image
                                className='cover-image-34qnzcmbw'
                                src={profileCover}
                                alt="Cover"
                                width={46}
                                height={46}
                            />
                            <div className="cover-edit-zcjn3a fadeIn-top">
                                <input accept="image/*" className='cover-edit-zcjn3a fadeIn-top' id="user-cover" type='file' style={{ display: 'none' }} onChange={changeCover} />
                                <Edit3Icon color='white' />
                            </div>
                        </label>

                        <label htmlFor="user-avatar" className='user-profile-ca2q3'>
                            <div className="avatar-overlay-cn32ad"></div>
                            <Image
                                className="avatar-343nasj"
                                alt="Avatar"
                                src={profilePic}
                                width={46}
                                height={46}
                            />
                            <div className="avatar-edit-zcjn3a">
                                <input accept="image/*" className='avatar-edit-zcjn3a fadeIn-top' id="user-avatar" type='file' style={{ display: 'none', }} onChange={changeAvatar} />
                                <Edit3Icon color='white' />
                            </div>
                        </label>
                    </div>

                    <b className="info-title-mczw72b" style={{ marginTop: 40 }}>Status</b>
                    <input
                        type="text"
                        name="status"
                        className="user-input-3mac82n"
                        placeholder="Status"
                        autoComplete="off"
                        value={userStatus}
                        onChange={(event) =>
                            setUserStatus(event.target.value)
                        }
                    />
                    <div style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <button disabled={userStatus == '' || userStatus == props.user?.user?.status} className="main-button-7ajb312" onClick={onChangeUserStatusClick}>
                            Change
                        </button>
                        <button className="side-button-7ajb312" style={{ marginLeft: 30 }} onClick={onRemoveUserStatusClick}>
                            Remove
                        </button>
                    </div>

                    <b className="info-title-mczw72b" style={{ marginTop: 40 }}>Profile Info</b>

                    <div className='account-info-kyyh2bw'>
                        <div className="info-cards-i73cas">
                            <div className="info-card-9caj46">

                                <ValidatedForm
                                    rules={{
                                        firstName: {
                                            required: true,
                                        },
                                        lastName: {
                                            required: true,
                                        },
                                        bio: {
                                            required: true,
                                        },
                                    }}
                                    messages={{
                                        firstName: {
                                            required: "First name is required!"
                                        },
                                        lastName: {
                                            required: "Last name is required!"
                                        },
                                        bio: {
                                            required: "Bio is required!"
                                        },
                                    }}
                                    onSubmit={onChangeUserInfoClick}
                                >
                                    <form >
                                        <div style={{ position: 'relative', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '100%' }}>
                                                <span style={{ color: 'gray', fontSize: 12 }}>First Name</span>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="user-input-3mac82n"
                                                    placeholder="First Name"
                                                    autoComplete="off"
                                                    value={firstName}
                                                    onChange={(event) =>
                                                        setFirstName(event.target.value)
                                                    }
                                                />
                                            </div>
                                            <div style={{ width: '8%' }} />
                                            <div style={{ width: '100%' }}>
                                                <span style={{ color: 'gray', fontSize: 12 }}>Last Name</span>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="user-input-3mac82n"
                                                    placeholder="Last Name"
                                                    autoComplete="off"
                                                    value={lastName}
                                                    onChange={(event) =>
                                                        setLastName(event.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: 20, width: '100%' }}>
                                            <span style={{ color: 'gray', fontSize: 12 }}>Bio</span>
                                            <textarea
                                                type="text"
                                                name="bio"
                                                className="user-input-3mac82n"
                                                style={{ height: 100 }}
                                                aria-multiline
                                                placeholder="Bio"
                                                autoComplete="off"
                                                value={bio}
                                                onChange={(event) =>
                                                    setBio(event.target.value)
                                                }
                                            />
                                        </div>

                                        <button className="main-button-7ajb312" type="submit">
                                            Save
                                        </button>
                                    </form>
                                </ValidatedForm>
                            </div>
                            <div className="info-card-9cajy6">

                            </div>
                        </div>

                        <div style={{ marginTop: 15 }}></div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect(Profile);
