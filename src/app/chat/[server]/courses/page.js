"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Accordion, AccordionItem, Avatar, Progress, User } from '@nextui-org/react';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import Loading from "@/components/Loading";
import { apiURL, handleAPIError } from '@/constant/global';

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

  const serverId = props.params?.server;

  const [selectedTab, setSelectedTab] = useState(Tabs[0]);
  const [channels, setChannels] = useState([]);
  const [isFetchChannels, setIsFetchChannels] = useState(false);
  const [favChannels, setFavChannels] = useState([]);
  const [isFetchFavChannels, setIsFetchFavChannels] = useState(false);
  const [inprogressChannels, setInprogressChannels] = useState([]);
  const [isFetchInProgressChannels, setIsFetchInProgressChannels] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {

      if (selectedTab?.Value == tabValues.categories) {
        getCategoryData(isFetchChannels);
      }
      else if (selectedTab?.Value == tabValues.favorites) {
        getFavoriteData(isFetchFavChannels);
      }
      else if (selectedTab?.Value == tabValues.inProgress) {
        getInProgressData(isFetchInProgressChannels);
      }

    }
  }, []);

  const getCategoryData = async (isFetch = isFetchChannels) => {
    if (isFetch) return;
    const response = await fetch(`${apiURL}api/v1/channel/fetch/category/${serverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.payload && typeof rsp.payload == 'object') {
        setChannels(rsp.payload);
        setIsFetchChannels(true);
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

  const getFavoriteData = async (isFetch = isFetchFavChannels) => {
    if (isFetch) return;
    const response = await fetch(apiURL + 'api/v1/channel/fetch/favourite/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.payload && typeof rsp.payload == 'object') {
        setFavChannels(rsp.payload);
        setIsFetchFavChannels(true);
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

  const getInProgressData = async (isFetch = isFetchInProgressChannels) => {
    if (isFetch) return;
    const response = await fetch(apiURL + 'api/v1/channel/fetch/inprogress/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.payload && typeof rsp.payload == 'object') {
        setInprogressChannels(rsp.payload);
        setIsFetchInProgressChannels(true);
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
    if (tab?.Value == tabValues.categories) {
      getCategoryData(isFetchChannels);
    }
    else if (tab?.Value == tabValues.favorites) {
      getFavoriteData(isFetchFavChannels);
    }
    else if (tab?.Value == tabValues.inProgress) {
      getInProgressData(isFetchInProgressChannels);
    }
  }

  const onSelectCategory = (category) => {
    router.push('courses/' + category.uuid);
  }

  const onRemoveFav = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    const response = await fetch(apiURL + 'api/v1/channel/change/favourite/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        course_id: item?.uuid, // selected course uuid
      })
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        getFavoriteData(false);
        toast('Course removed from Favorites!');
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

  const renderChannelContent = () => {
    if (selectedTab?.Value == tabValues.categories) {
      if (!isFetchChannels) {
        return (
          <div style={{ width: '100%' }}>
            <Loading />
          </div>
        );
      }
      if (channels.length == 0) {
        return (
          <div style={{ width: '100%', marginTop: 40 }} className="w-full">
            <h3 style={{ color: 'var(--fifth-color)' }} className='text-center'>No categories found!</h3>
          </div>
        );
      }

      return (
        <div className="cards-grid-82ncaj23 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" >
          {
            channels.map((item, index) => {
              return (
                <div key={index} className="card-9a9q792">
                  <div class="card-img-wrap-9a9q792">
                    {/* <img src={"https://assets.therealworld.ag/uploads/bmPVttVt2jZqYpg4mngSGbPrxf3Fod3hwVGmFh-IH2?max_side=500"} className="card-img-9a9q792" alt="..." /> */}
                    <img src={item.category_pic} className="card-img-9a9q792 card-img-top" alt="..." />
                    <div style={{ position: 'absolute', backgroundColor: '#92929267', borderRadius: 4, height: 44, width: '100%', bottom: 0, padding: '0px 10px' }}>
                      <p className="card-completed-9a9q792">{item.completed}% completed</p>
                      <Progress
                        size="sm"
                        radius="md"
                        aria-label="Loading..."
                        value={40}
                        classNames={{
                          indicator: "coin-progress-72bak"
                        }}
                        color="warning"
                      />
                    </div>
                  </div>
                  <div className="card-body-9a9q792">
                    <div style={{ height: '78%', display: 'flex', flexDirection: 'column' }}>
                      <h5 className="card-name-9a9q792 card-title">{item.name}</h5>
                      <p className="card-description-9a9q792 card-text">{item.description}</p>
                    </div>
                    <div style={{ backgroundColor: '#ecc870', cursor: 'pointer', padding: '6px 0px', borderRadius: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => onSelectCategory(item)}>
                      <p className="card-btn-text-9a9q792">{item.no_of_courses} Course(s)</p>
                      <ChevronRightIcon size={20} color='var(--third-color)' strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      );
    }
    else if (selectedTab?.Value == tabValues.inProgress) {
      if (!isFetchInProgressChannels) {
        return (
          <div style={{ width: '100%' }}>
            <Loading />
          </div>
        );
      }
      if (inprogressChannels.length == 0) {
        return (
          <div style={{ width: '100%', marginTop: 40 }} className="w-full">
            <h3 style={{ color: 'var(--fifth-color)' }} className='text-center'>No in-progress categories!</h3>
          </div>
        );
      }
      return (
        <div className="cards-row-82ncaj23 g-4" >
          <Accordion selectionMode="none" variant="splitted" >
            {
              inprogressChannels.map((item, index) => {
                return (
                  <AccordionItem
                    className='accordion-93asnc'
                    classNames={{
                      title: 'light',
                    }}
                    onClick={(e) => {
                      router.push('courses/' + item?.category_uuid + '?cid=' + item?.uuid)
                    }}
                    key={index}
                    aria-label={item?.name}
                    startContent={
                      <Avatar
                        radius="md"
                        size='lg'
                        src={item?.pic}
                      />
                    }
                    indicator={<ChevronRightIcon size='26' color='var(--fourth-color)' />}
                    title={item?.name}
                    subtitle={
                      <div>
                        <Progress
                          size="sm"
                          radius="sm"
                          aria-label="Loading..."
                          value={item?.completed}
                          style={{ marginTop: 4, marginBottom: 4 }}
                          classNames={{
                            indicator: "course-progress-32mksfe"
                          }}
                          color="success"
                        />
                        <span>{item?.completed + "% completed"}</span>
                      </div>
                    }
                  >
                  </AccordionItem>
                );
              })
            }
          </Accordion>
        </div>
      );
    }
    else if (selectedTab?.Value == tabValues.favorites) {
      if (!isFetchFavChannels) {
        return (
          <div style={{ width: '100%' }}>
            <Loading />
          </div>
        );
      }
      if (favChannels.length == 0) {
        return (
          <div style={{ width: '100%', marginTop: 40 }} className="w-full">
            <h3 style={{ color: 'var(--fifth-color)' }} className='text-center'>No favorite categories!</h3>
          </div>
        );
      }
      return (
        <div className="cards-row-82ncaj23 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" >
          <Accordion selectionMode="multiple" variant="splitted" >
            {
              favChannels.map((item, index) => {
                return (
                  <AccordionItem
                    className='accordion-93asnc'
                    classNames={{
                      title: 'light'
                    }}
                    key={index}
                    aria-label={item?.category?.name}
                    startContent={
                      <Avatar
                        radius="sm"
                        size='lg'
                        src={item?.category?.category_pic}
                      />
                    }
                    indicator={<ChevronRightIcon size='26' color='var(--fourth-color)' />}
                    subtitle={item?.category?.description}
                    title={item?.category?.name}
                  >
                    {item.courses && item.courses.length > 0 ?
                      item.courses.map((course, courseIndex) => {
                        return (
                          <div
                            key={courseIndex}
                            style={{ cursor: 'pointer', marginLeft: 20, marginRight: 20, flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
                            onClick={(e) => router.push('/courses/' + item?.category?.uuid + '?cid=' + course?.uuid)}
                          >
                            <User
                              name={course?.name}
                              description={course?.lessons + ' lessons | ' + course?.completed + '% completed'}
                              classNames={{
                                wrapper: 'ml-2',
                                description: 'mt-1',
                                name: 'light'
                              }}
                              slot='name'
                              avatarProps={{
                                src: course?.pic,
                                radius: 'sm'
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <Trash2Icon size={17} color='var(--fourth-color)' style={{ marginRight: 10 }} onClick={(e) => onRemoveFav(e, course)} />
                              <ChevronRightIcon size={20} color='var(--fourth-color)' />
                            </div>
                          </div>
                        );
                      })
                      :
                      null
                    }
                  </AccordionItem>
                );
              })
            }
          </Accordion>
        </div>
      );
    }
  }

  const onClosePage = () => {
    router.replace('/chat/' + serverId);
  }

  return (
    <div className='container-93ca2aw'>
      <div className='header-m32aaw'>

        <div style={{ cursor: "pointer", position: 'absolute', right: '1.5rem' }} onClick={onClosePage}>
          <XIcon className="refresh" />
        </div>

      </div>
      <div className='content-92acn3a'>
        <h2 className='title-mzj3dam'>Cryptocurrency Investing Learning Center</h2>

        <div className='tab-nav-n38can'>
          {Tabs.map((tab, index) => {
            const isSelected = selectedTab?.Value == tab.Value;
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

        {renderChannelContent()}

      </div>
    </div>
  );
}

export default connect(Courses);