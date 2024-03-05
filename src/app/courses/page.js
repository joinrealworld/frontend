"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon, MoonIcon, RefreshCcw, SunIcon, Trash2Icon } from 'lucide-react';
import { Accordion, AccordionItem, Avatar, Progress, User } from '@nextui-org/react';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import Loading from "@/components/Loading";
import { apiURL, handleAPIError } from '@/constant/global';
import { darkTheme } from "@/themes/darkTheme";
import { lightTheme } from "@/themes/lightTheme";

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

  const [selectedTab, setSelectedTab] = useState(null);
  const [channels, setChannels] = useState([]);
  const [isFetchChannels, setIsFetchChannels] = useState(false);
  const [favChannels, setFavChannels] = useState([]);
  const [isFetchFavChannels, setIsFetchFavChannels] = useState(false);
  const [inprogressChannels, setInprogressChannels] = useState([]);
  const [isFetchInProgressChannels, setIsFetchInProgressChannels] = useState(false);

  const [mountTheme, setMountTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) || "dark"
  );

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
          getCategoryData(isFetchChannels);
        }
        else if (Number(props.searchParams?.tab) == tabValues.favorites) {
          getFavoriteData(isFetchFavChannels);
        }
        else if (Number(props.searchParams?.tab) == tabValues.inProgress) {
          getInProgressData(isFetchInProgressChannels);
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
        getCategoryData(isFetchChannels);
      }
      else if (Number(props.searchParams?.tab) == tabValues.favorites) {
        getFavoriteData(isFetchFavChannels);
      }
      else if (Number(props.searchParams?.tab) == tabValues.inProgress) {
        getInProgressData(isFetchInProgressChannels);
      }
    }
  }, [props.searchParams?.tab]);

  const getCategoryData = async (isFetch = isFetchChannels) => {
    if (isFetch) return;
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
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log(rsp);
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
    console.log(response);
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      console.log(rsp);
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
    router.push('?tab=' + tab?.Value);
  }

  const onSelectCategory = (category) => {
    router.push('/courses/' + category.uuid);
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
    console.log("rsp --------------------------------");
    console.log(response);
    console.log(rsp);
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
          <div className="w-full">
            <h3 style={{ color: 'var(--fourth-color)' }} className='text-center fs-5 mt-5'>No categories found!</h3>
          </div>
        );
      }
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
          <div className="w-full">
            <h3 className='text-center text-white fs-5 mt-5'>No in-progress categories!</h3>
          </div>
        );
      }
      return (
        <Accordion selectionMode="none" variant="splitted" >
          {inprogressChannels.map((item, index) => {
            return (
              <AccordionItem
                className='accordion-93asnc'
                classNames={{
                  title: 'light'
                }}
                onClick={(e) => {
                  router.push('/courses/' + item?.uuid + '?cid=' + item?.uuid)
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
          <div className="w-full">
            <h3 style={{ color: 'var(--fourth-color)' }} className='text-center fs-5 mt-5'>No favorite categories!</h3>
          </div>
        );
      }
      return (
        <Accordion selectionMode="multiple" variant="splitted" >
          {favChannels.map((item, index) => {
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
                    console.log("course?.pic", course?.pic);
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
      )
    }
  }

  const onRefreshData = (e) => {
    if (selectedTab?.Value == tabValues.categories) {
      setIsFetchChannels(false);
      setChannels([]);
      getCategoryData(false);
    }
    else if (selectedTab?.Value == tabValues.favorites) {
      setIsFetchFavChannels(false);
      setFavChannels([]);
      getFavoriteData(false);
    }
    else if (selectedTab?.Value == tabValues.inProgress) {
      setIsFetchInProgressChannels(false);
      setInprogressChannels([]);
      getInProgressData(false);
    }
  }

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(mountTheme));
  }, [mountTheme]);

  const onChangeTheme = (theme) => {
    if (theme == 'light') {
      setMountTheme("light");
      lightTheme();
    } else {
      setMountTheme("dark");
      darkTheme();
    }
    changeTheme(props.user.authToken, theme);
  }

  const changeTheme = async (authToken, theme) => {
    const response = await fetch(apiURL + 'api/v1/user/theme', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({
        theme: theme
      })
    });
    const rsp = await response.json();
    console.log("rsp --------------------------------");
    console.log(response);
    console.log(rsp);
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        if (theme == 'dark') {
          toast("Dark Mode applied!");
        } else {
          toast("Light Mode applied!");
        }
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      }
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
              src: props.user?.user?.avatar ? encodeURI(apiURL.slice(0, -1) + props.user?.user?.avatar) : "/assets/hp.jpg"
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

        <div className="flex justify-between items-center" >
          {
            mountTheme === "dark" ?
              <div style={{ cursor: "pointer" }} onClick={(e) => onChangeTheme('light')}>
                <MoonIcon className="refresh" />
              </div>
              :
              <div style={{ cursor: "pointer" }} onClick={(e) => onChangeTheme('dark')}>
                <SunIcon className="refresh" />
              </div>
          }
          <div style={{ cursor: "pointer", marginLeft: '2rem' }} onClick={onRefreshData}>
            <RefreshCcw className="refresh" />
          </div>
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

        <div className="cards-row-82ncaj23 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" >

          {renderChannelContent()}

        </div>
      </div>
    </div>
  );
}

export default connect(Courses);