"use client";

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import { apiURL } from '@/constant/global';
function Chat(props) {

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            // get server data
            const getInitData = async () => {
                getProfile();
                await getServers();
            }
            getInitData();
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

    const getServers = async () => {
        const response = await fetch(apiURL + 'api/v1/channel/fetch/master_category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            if (rsp.payload && typeof rsp.payload == 'object') {
                if (rsp.payload.length > 0) {
                    router.replace('chat/' + rsp.payload[0].uuid);
                }
            }
        }
    }


    return (
        <div className='container-3ca2e2'>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                <div className='loading-wrap-38cba'>
                    <div className="loader-38cba"></div>
                    <p className='loading-text-38cba'>Escaping the Matrix...</p>
                </div>
                <p className='des-text-38cba'>If failure makes you stronger, you can never lose.</p>
            </div>
        </div>
    )
}

export default connect(Chat);