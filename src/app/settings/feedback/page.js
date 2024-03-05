"use client";

import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';

import './../styles.css';
import './styles.css';
import SettingsMenu from "@/components/SettingsMenu";
import connect from '@/components/ConnectStore/connect';
import ValidatedForm from '@/components/ValidatedForm';
import { apiURL, handleAPIError } from '@/constant/global';

function Profile(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [firstName, setFirstName] = useState(props.user?.user?.first_name ?? '');
    const [lastName, setLastName] = useState(props.user?.user?.last_name ?? '');
    const [bio, setBio] = useState(props.user?.user?.bio ?? '');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        }
    }, []);

    const onToggleMenu = (e) => {
        $('#setting-menu').toggleClass("invisible");
        $('#setting-menu').toggleClass("visible");
    }

    const onSubmitFeedbackClick = () => {
        setIsLoading(true);
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
        const rsp = await response.json();
        console.log("rsp.payload --------------------------------");
        console.log(rsp.payload);
        if (response.status >= 200 && response.status < 300) {
            if (rsp.payload) {
                toast("Your feedback submitted successfully!");
                setMessage('');
                setIsLoading(false);
            } else {
                handleAPIError(rsp);
                setIsLoading(false);
            }
        } else {
            if (response.status == 401) {
                dispatch(props.actions.userLogout());
            } else {
                handleAPIError(rsp);
                setIsLoading(false);
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

                    <b className="info-title-23qq2e">Provide a Feedback</b>

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
                                        <div style={{ marginTop: 10, width: '100%' }}>
                                            <span style={{ color: 'gray', fontSize: 12 }}>Message</span>
                                            <textarea
                                                type="text"
                                                name="feedback"
                                                className="user-input-23qq2e"
                                                style={{ height: 100 }}
                                                aria-multiline
                                                placeholder="Enter your feedback message"
                                                autoComplete="off"
                                                maxLength={300}
                                                value={message}
                                                onChange={(event) =>
                                                    setMessage(event.target.value)
                                                }
                                            />
                                        </div>

                                        <Button className='main-button-23qq2e' isLoading={isLoading} spinner={<Spinner color='current' size='sm' />} radius='sm' size='lg' type="submit" color=''>
                                            Submit
                                        </Button>

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
