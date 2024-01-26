"use client";

import React, { useEffect, useState } from 'react';
import connect from '@/components/ConnectStore/connect';
import { useRouter } from 'next/navigation';

import './styles.css';
import Loading from "@/components/Loading";
import { RefreshCcw } from 'lucide-react';
import { User } from '@nextui-org/react';
import { apiURL } from '@/constant/global';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const tabValues = {
    categories: 1,
    inProgress: 2,
    favorites: 3,
}

const Tabs = [
    { Text: 'Categories', Value: tabValues.categories },
    { Text: 'In Progress', Value: tabValues.inProgress },
    { Text: 'Favorites', Value: tabValues.favorites },
]

function Courses(props) {

    const [selectedTab, setSelectedTab] = useState(Tabs[0]);
    const [channels, setChannels] = useState([]);
    const [favChannels, setFavChannels] = useState([]);
    const [isFetch, setIsFetch] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!props.user.isLoggedIn) {
            router.push('/login');
        } else {
            getCategoryData();
        }
    }, []);

    const getCategoryData = async () => {
        const response = await fetch(apiURL + 'api/v1/channel/fetch/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.user.authToken
            }
        });
        if (response.status >= 200 && response.status < 300) {
            const rsp = await response.json();
            if (rsp.payload && rsp.payload?.length > 0) {
                setChannels(rsp.payload);
                setIsFetch(true);
                // // zzz
                // setFavChannels(rsp.payload.filter(c => c.is_favorite));
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

    const onProfileClick = () => {
        router.push('/settings/account');
    }

    const onSelectTab = (tab) => {
        setSelectedTab(tab);
    }

    const onSelectCategory = (category) => {
        router.push('/courses/' + category.id);
    }

    const renderChannelContent = () => {
        if (selectedTab.Value == tabValues.categories) {
            if (channels.length > 0) {
                return channels.map((item, index) => {
                    return (
                        <div key={index} className="col" onClick={(e) => onSelectCategory(item)}>
                            <div className="card-9ama2f card">
                                <img src={item.category_pic} className="card-img-9ama2f card-img-top" alt="..." />
                                <div className="card-body-9ama2f card-body">
                                    <h5 className="card-name-9ama2f card-title">{item.name}</h5>
                                    <p className="card-description-9ama2f card-text">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                });
            } else {
                return (
                    <div className="w-full">
                        <h3 className='text-center text-white fs-5 mt-5'>No categories found!</h3>
                    </div>
                );
            }
        }
        else if (selectedTab.Value == tabValues.inProgress) {
            return (
                <div className="w-full">
                    <h3 className='text-center text-white fs-5 mt-5'>Working in progress!</h3>
                </div>
            );
        }
        else if (selectedTab.Value == tabValues.favorites) {
            return (
                <div className="w-full">
                    <h3 className='text-center text-white fs-5 mt-5'>Working in progress!</h3>
                </div>
            );
        }
    }

    const onRefreshData = (e) => {
        setIsFetch(false);
        setChannels([]);

        getCategoryData();
    }

    return (
        <div className='container-93ca2aw'>
            <div className='header-m32aaw'>
                <div>
                    <User
                        name={props.user?.user?.first_name + " " + props.user?.user?.last_name}
                        description={props.user?.user?.username}
                        avatarProps={{
                            src: props.user?.user?.avatar ? props.user?.user?.avatar : "/assets/hp.jpg"
                        }}
                        classNames={{
                            base: 'user-info-mc2nw',
                            wrapper: 'user-name-info-mc2nw',
                            name: 'user-name-9qncq6',
                            description: 'user-description-9qncq6'
                        }}
                        style={{ cursor: 'pointer' }}
                        onClick={onProfileClick}
                    />

                </div>
                <div style={{ cursor: 'pointer' }} onClick={onRefreshData}>
                    <RefreshCcw color='white' />
                </div>
            </div>
            <div className='content-92acn3a'>
                <h2 className='title-mzj3dam'>Cryptocurrency Investing Learning Center</h2>

                <div className='tab-nav-n38can'>
                    {Tabs.map((tab, index) => {
                        const isSelected = selectedTab.Value == tab.Value;
                        return (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', cursor: 'pointer', textAlign: 'center' }} onClick={(e) => onSelectTab(tab)}>
                                <div className='tab-bar-button-zsmk73'>
                                    <span className={isSelected ? 'active' : undefined}>{tab.Text}</span>
                                </div>
                                {isSelected && <div className='bottom-line-38cah' />}
                            </div>
                        );
                    })}
                </div>

                <div className="cards-row-82ncaj23 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" >

                    {isFetch ?
                        renderChannelContent()
                        :
                        <div style={{ width: '100%' }}>
                            <Loading />
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default connect(Courses);