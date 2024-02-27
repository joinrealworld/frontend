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

function Profile(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [firstName, setFirstName] = useState(props.user?.user?.first_name ?? '');
    const [lastName, setLastName] = useState(props.user?.user?.last_name ?? '');
    const [bio, setBio] = useState(props.user?.user?.bio ?? '');
    const [profilePic, setProfilePic] = useState(props.user?.user?.avatar ? props.user?.user?.avatar : "/assets/hp.jpg");
    const [profileCover, setProfileCover] = useState(props.user?.user?.cover ? props.user?.user?.cover : "/assets/hp.jpg"); // zzz

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            // get data
        }
    }, []);

    console.log(firstName);
    console.log(lastName);

    const onSubmitClick = () => {

    }

    const changeAvatar = (e) => {
        const binaryData = [e.target.files[0]];
        setProfilePic(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
    }

    const changeCover = (e) => {
        const binaryData = [e.target.files[0]];
        setProfileCover(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })));
    }

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("visible");
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

                    <b className="info-title-mczw72b">Profile</b>

                    <div className='profile-info-nzk3awd'>
                        <label htmlFor="user-cover" className='user-cover-ca2q3'>
                            <div class="cover-overlay-cn32ad"></div>
                            <Image
                                className='cover-image-34qnzcmbw'
                                src={profileCover}
                                alt="Cover"
                                width={46}
                                height={46}
                            />
                            <div class="cover-edit-zcjn3a fadeIn-top">
                                <input accept="image/*" className='cover-edit-zcjn3a fadeIn-top' id="user-cover" type='file' style={{ display: 'none' }} onChange={changeCover} />
                                <Edit3Icon color='white' />
                            </div>
                        </label>



                        <label htmlFor="user-avatar" className='user-profile-ca2q3'>
                            <div class="avatar-overlay-cn32ad"></div>
                            <Image
                                className="avatar-343nasj"
                                alt="Avatar"
                                src={profilePic}
                                width={46}
                                height={46}
                            />
                            <div class="avatar-edit-zcjn3a">
                                <input accept="image/*" className='avatar-edit-zcjn3a fadeIn-top' id="user-avatar" type='file' style={{ display: 'none', }} onChange={changeAvatar} />
                                <Edit3Icon color='white' />
                            </div>
                        </label>
                    </div>

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
                                    }}
                                    messages={{
                                        firstName: {
                                            required: "First name is required!"
                                        },
                                        lastName: {
                                            required: "Last name is required!"
                                        },
                                    }}
                                    onSubmit={onSubmitClick}
                                >
                                    <form >
                                        <div style={{ position: 'relative', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '100%' }}>
                                                <span style={{ color: 'var(--eighth-color)', fontSize: 12 }}>First Name</span>
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
                                                <span style={{ color: 'var(--eighth-color)', fontSize: 12 }}>Last Name</span>
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
                                            <span style={{ color: 'var(--eighth-color)', fontSize: 12 }}>Bio</span>
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
