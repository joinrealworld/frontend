"use client";

import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import $ from 'jquery';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from '@/components/ValidatedForm';
import { apiURL } from '@/constant/global';
import { toast } from 'react-toastify';

function Profile(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [firstName, setFirstName] = useState(props.user?.user?.first_name ?? '');
    const [lastName, setLastName] = useState(props.user?.user?.last_name ?? '');
    const [bio, setBio] = useState(props.user?.user?.bio ?? '');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        }
    }, []);

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("visible");
    }

    const onSubmitFeedbackClick = () => {
        onSubmitFeedback(props.user.authToken);
    }

    const onSubmitFeedback = async (authToken) => {
        const response = await fetch(apiURL + 'api/v1/user/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                message: message
            })
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            console.log("rsp.payload --------------------------------");
            console.log(rsp.payload);
            if (rsp.payload) {
                toast("Your feedback submitted successfully!");
                setMessage('');
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

                    <b className="info-title-23qq2e">Provide Feedback</b>

                    <div className='account-info-23qq2e'>
                        <div className="info-cards-23qq2e">
                            <div className="info-card-23qq2e">

                                <ValidatedForm
                                    rules={{
                                        feedback: {
                                            required: true,
                                        }
                                    }}
                                    messages={{
                                        feedback: {
                                            required: "Message is required!"
                                        },
                                    }}
                                    onSubmit={onSubmitFeedbackClick}
                                >
                                    <form >
                                        <div style={{ width: '100%' }}>
                                            <span style={{ color: 'gray', fontSize: 12 }}>Email</span>
                                            <input
                                                type="text"
                                                className="user-input-23qq2e"
                                                disabled
                                                value={props.user?.user?.email}
                                            />
                                        </div>
                                        <div style={{ marginTop: 20, width: '100%' }}>
                                            <span style={{ color: 'gray', fontSize: 12 }}>Message</span>
                                            <textarea
                                                type="text"
                                                name="feedback"
                                                className="user-input-23qq2e"
                                                style={{ height: 100 }}
                                                aria-multiline
                                                placeholder="Enter your feedback"
                                                autoComplete="off"
                                                maxLength={300}
                                                value={message}
                                                onChange={(event) =>
                                                    setMessage(event.target.value)
                                                }
                                            />
                                        </div>

                                        <button className="main-button-23qq2e" type="submit">
                                            Submit
                                        </button>
                                    </form>
                                </ValidatedForm>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect(Profile);
