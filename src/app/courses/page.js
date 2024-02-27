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
  const [inprogressChannels, setInprogressChannels] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      console.log(Number(props.searchParams?.tab));
      console.log(tabValues.categories);
      if (props.searchParams?.tab && Number(props.searchParams?.tab) > 0) {
        console.log("callled...");
        setSelectedTab(Tabs.find(d => d.Value == Number(props.searchParams?.tab)));
        if (Number(props.searchParams?.tab) == tabValues.categories) {
          getCategoryData();
        }
        else if (Number(props.searchParams?.tab) == tabValues.favorites) {
          getFavoriteData();
        }
        else if (Number(props.searchParams?.tab) == tabValues.inProgress) {
          getInProgressData();
        }
      } else {
        router.push('?tab=' + tabValues.categories);
      }
    }
  }, []);

  useEffect(() => {
    if (props.searchParams?.tab && Number(props.searchParams?.tab) > 0 && Number(props.searchParams?.tab) != selectedTab?.Value) {
      setSelectedTab(Tabs.find(d => d.Value == Number(props.searchParams?.tab)));
      if (Number(props.searchParams?.tab) == tabValues.categories) {
        getCategoryData();
      }
      else if (Number(props.searchParams?.tab) == tabValues.favorites) {
        getFavoriteData();
      }
      else if (Number(props.searchParams?.tab) == tabValues.inProgress) {
        getInProgressData();
      }
    }
  }, [props.searchParams?.tab]);

  const getCategoryData = async () => {
    const response = await fetch(apiURL + 'api/v1/channel/fetch/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log(rsp);
      if (rsp.payload && typeof rsp.payload == 'object') {
        setChannels(rsp.payload);
        setIsFetch(true);
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

  const getFavoriteData = async () => {
    const response = await fetch(apiURL + 'api/v1/channel/fetch/favourite/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log(rsp);
      if (rsp.payload && typeof rsp.payload == 'object') {
        setFavChannels(rsp.payload);
        setIsFetch(true);
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

  const getInProgressData = async () => {
    const response = await fetch(apiURL + 'api/v1/channel/fetch/inprogress/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log(rsp);
      if (rsp.payload && typeof rsp.payload == 'object') {
        setInprogressChannels(rsp.payload);
        setIsFetch(true);
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
    setIsFetch(false);
    router.push('?tab=' + tab?.Value);
  }

  const onSelectCategory = (category) => {
    router.push('/courses/' + category.uuid);
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
      if (inprogressChannels.length > 0) {
        return inprogressChannels.map((item, index) => {
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
            <h3 className='text-center text-white fs-5 mt-5'>No in-progress categories!</h3>
          </div>
        );
      }
    }
    else if (selectedTab.Value == tabValues.favorites) {
      if (favChannels.length > 0) {
        return favChannels.map((item, index) => {
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
            <h3 className='text-center text-white fs-5 mt-5'>No favorite categories!</h3>
          </div>
        );
      }
    }
  }

  const onRefreshData = (e) => {
    setIsFetch(false);
    setChannels([]);
    setFavChannels([]);
    setInprogressChannels([]);
    if (selectedTab?.Value == tabValues.categories) {
      getCategoryData();
    }
    else if (selectedTab?.Value == tabValues.favorites) {
      getFavoriteData();
    }
    else if (selectedTab?.Value == tabValues.inProgress) {
      getInProgressData();
    }
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
        <div className="flex justify-between items-center">
          <div style={{ cursor: "pointer" }} onClick={onRefreshData}>
            <RefreshCcw className="refresh" />
          </div>
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