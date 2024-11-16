"use client";


import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Progress, Button, RadioGroup, useDisclosure, useRadio, cn, VisuallyHidden, Spinner, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/react";
import Link from "next/link";
import $ from "jquery";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ArrowLeft, CheckIcon, ChevronRight, ChevronRightIcon, HeartIcon, XIcon, SearchIcon, Plus, Home, Search, MessageCircle, Bell, UserRound, ListOrdered, Send, Bookmark, Grid, Settings, Image, ListChecks } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import './styles.css';
import connect from '@/components/ConnectStore/connect';
import Loading from "@/components/Loading";
import { apiURL, handleAPIError, transformVimeoUrl } from "@/constant/global";

const Sections = {
  video: 'video',
  summary: 'summary',
  quiz: 'quiz',
  attachment: 'attachment',
  general: 'general',
}

function MediaPage(props) {

  const serverId = props.chat?.serverList[0].uuid;

  const { get } = useSearchParams();
  const searchParams = {
    cid: get('cid'),
    lid: get('lid'),
  }
  const [category, setCategory] = useState(props.params.category);
  const [isMediaFetch, setIsMediaFetch] = useState(false);
  const [isCourseDataFetch, setIsCourseDataFetch] = useState(false);
  const [isQuizFetch, setIsQuizFetch] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState([]);
  const [selectedQuizAnswerError, setSelectedQuizAnswerError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isPreviousLoading, setIsPreviousLoading] = useState(false);

  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [medias, setMedias] = useState([]);
  const [originalMedias, setOriginalMedias] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isSubmitVisible, setIsSubmitVisible] = useState(false);

  const [signatureData, setSignatureData] = useState('');
  const [mediaRules, setMediaRules] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const [userEmail,setUserEmail] = useState("");
  const [userFirstName,setUserFirstName] = useState("");
  const [userLastName,setUserLastName] = useState("");
  const [userName,setUserName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const addmediaModel = useDisclosure({
    id: 'add-media-poll',
  });

  const notificationModel = useDisclosure({
    id: 'notification-model',
  });

  const profileModel = useDisclosure({
    id: 'profile-model',
  });

  const mediaContractModel = useDisclosure({
    id: 'media-contract-modal',
  });

  const rightContentRef = useRef(null);

  const scrollToTop = () => {
    if (rightContentRef.current) {
      rightContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = () => {
    scrollToTop();
    setIsSearchVisible(!isSearchVisible);
  };

  const messagePage = () => {
    toast("Under Construction");
  }

  useEffect(() => {
    if (props.user.isLoggedIn) {

    }
  }, []);

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      // get data
      getProfile(props.user.authToken);
  }
  }, [props.user.isLoggedIn]);

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
            setUserEmail(rsp.payload.email)
            setUserFirstName(rsp.payload.first_name)
            setUserLastName(rsp.payload.last_name)
            setUserName(rsp.payload.username)
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

  useEffect(() => {
    if (searchParams?.cid && searchParams?.cid != selectedCourse?.uuid) {
      getCourseDataById(searchParams?.cid);
    }
  }, [searchParams?.cid]);

  useEffect(() => {
    const savedSignature = localStorage.getItem('signature');
    const mediaRules = localStorage.getItem('mediaRules');
    if (savedSignature) {
      setSignatureData(savedSignature);
      setMediaRules(JSON.parse(mediaRules));
    }
  }, []);

  const getMediaData = async (page=1) => {
    setIsMediaFetch(true);
    try {
      const response = await fetch(`https://joinrealworld-backend.onrender.com/api/v1/media/fetch/message?page=${page}`);
      const data = await response.json();
      setMedias(data.results);
      setOriginalMedias(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setTotalCount(data.count);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching media:', error);
      // Optionally set an error state here
    } finally {
      setIsMediaFetch(false);
    }
    // const response = await fetch(apiURL + 'api/v1/media/fetch/message?page=3', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + props.user.authToken
    //   }
    // });
    // if (response.status >= 200 && response.status < 300) {
    //   const rsp = await response.json();
    //   if (rsp.results) {
    //     const reverseArray = rsp.results.reverse();
    //     setMedias(rsp.results);
    //     setOriginalMedias(reverseArray);
    //     setIsMediaFetch(true);
    //   }
    // } else {
    //   toast("Error while fetching data!");
    // }
  }

  const handleNextPage = () => {
    if (nextPage) {
      const urlParams = new URLSearchParams(nextPage.split('?')[1]);
      const nextPageNumber = urlParams.get('page');
      if (nextPageNumber && nextPageNumber !== 'null') {
        getMediaData(nextPageNumber);
      }
    }
  };
  
  const handlePrevPage = () => {
    if (prevPage) {
      const urlParams = new URLSearchParams(prevPage.split('?')[1]);
      let prevPageNumber = urlParams.get('page');
  
      // Set default page number if prevPageNumber is null
      if (!prevPageNumber || prevPageNumber === 'null') {
        prevPageNumber = '1'; // Set this as per your pagination logic or requirement
      }
      getMediaData(prevPageNumber);
    }
  };

  const getNotificationsData = async () => {
    const response = await fetch(apiURL + 'api/v1/media/notifications', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + props.user.authToken
        }
    });
    const rsp = await response.json();

    if (response.status >= 200 && response.status < 300) {
        console.log(rsp.payload);
    } else {
        if (response.status == 401) {
            dispatch(props.actions.userLogout());
        } else {
            toast("Error while fetching data!");
        }
    }
}
  
  
  

  const getInitData = async () => {
    getMediaData();
    getNotificationsData();
  }

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    } else {
      // get data
      getInitData();
    }
  }, []);


  useEffect(() => {
    if (searchParams?.lid && searchParams?.lid != selectedLesson?.uuid) {
      let lesson = selectedCourse?.data?.[0];
      if (searchParams?.lid && selectedCourse?.data?.some(c => c.uuid === searchParams?.lid)) {
        lesson = selectedCourse?.data?.find(c => c.uuid === searchParams?.lid);
      } else {
        let index = Math.min(selectedCourse?.data?.findIndex(c => c.uuid === selectedCourse?.last_checked) + 1, selectedCourse?.data?.length - 1);
        if (index > -1 && selectedCourse?.data?.[index] != null) {
          lesson = selectedCourse?.data?.[index];
        }
      }
      if (lesson?.section == Sections.quiz) {
        getQuizFromId(selectedCourse?.uuid, lesson?.quiz_id, () => {
          setSelectedLesson(lesson);
        });
      } else {
        setCurrentQuiz(null);
        setIsQuizFetch(false);
        setSelectedLesson(lesson);
      }
    }
  }, [searchParams?.lid, selectedCourse?.uuid]);


  useEffect(() => {
    if (props.params.category != category) {
      setCategory(props.params.category);
    }
  }, [props.params.category]);

  const onSelectCourse = (item) => {
    if (item.uuid !== selectedCourse?.uuid) {
      setIsCourseDataFetch(false);
      router.push('?cid=' + item.uuid);
    }
    $('#course-sidebar').toggleClass("visible");
    $('#course-content').toggleClass("visible");
    $('.header-3m32aaw').toggleClass("visible");
  }

  // const onSelectLesson = (lesson) => {
  //     if (lesson.id !== selectedLesson?.id) {
  //         setSelectedLesson(lesson);
  //     }
  // }

  const onOpenSideMenu = (e) => {
    e.preventDefault();
    $('#course-sidebar').toggleClass("visible");
    $('#course-content').toggleClass("visible");
    $('.header-3m32aaw').toggleClass("visible");
  }


  // const renderLessonItem = (lessons) => {
  //     return lessons.map((lesson) => {
  //         const isSelected = selectedLesson?.id == lesson.id;
  //         return (
  //             <div className="lesson-item-k3bda">
  //                 <div className={`lesson-item-header-acnk3 ${isSelected ? "active" : undefined}`} onClick={(e) => onSelectLesson(lesson)}>
  //                     <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
  //                         <User
  //                             name={lesson.name}
  //                             description={
  //                                 <div style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', display: 'flex', alignSelf: 'flex-start' }}>
  //                                     <span className="lesson-value-nja72b">{lesson.module}</span>
  //                                     <span className="lesson-label-nja72b">Module</span>
  //                                     <span className="lesson-desc-divider-nja72b">|</span>
  //                                     <span className="lesson-value-nja72b">{lesson.lessons}</span>
  //                                     <span className="lesson-label-nja72b">Lessons</span>
  //                                 </div>
  //                             }
  //                             avatarProps={{
  //                                 src: "https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?w=1480&t=st=1705685175~exp=1705685775~hmac=407c26b368ba7a2e78e36075483057d661a603d4cf9a812a8e7dd7262c1a44a3"
  //                             }}
  //                             classNames={{
  //                                 base: 'lesson-info-mc2nw',
  //                                 wrapper: 'lesson-name-info-mc2nw',
  //                                 name: 'lesson-name-9qncq6',
  //                                 description: 'lesson-description-9qncq6'
  //                             }}
  //                             style={{ cursor: 'pointer' }}
  //                         />

  //                         <ChevronRightIcon color="white" size={17} />
  //                     </div>

  //                 </div>
  //             </div>
  //         );
  //     });
  // }

  // const renderModules = (modules) => {
  //     return modules.map((module, index) => {
  //         if (index !== 0) {
  //             return null;
  //         }
  //         return (
  //             <div key={index} className="module-item-cznj3ad">
  //                 <span className="module-title-cznj3ad">Module {index + 1}</span>
  //                 {renderLessonItem(courses)}
  //             </div>
  //         );
  //     });
  // }

  const getVimeoPlayerURL = (url) => {
    const regex = /vimeo\.com\/(\d+\/[a-f0-9]+)\b/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const vimeoData = match[1].split('/');
      return `https://player.vimeo.com/video/${vimeoData[0]}?h=${vimeoData[1]}&vimeo_logo=0`;
    }
    return null;
  }

  const renderCourseContentBySection = (currentMessage) => {
    if (currentMessage.section == Sections.video && currentMessage?.section_url) {
      return (
        <>
          <div className="lesson-video-3naksn">
            {/* <iframe
              // src={getVimeoPlayerURL(currentMessage?.section_url)}
              src={"https://player.vimeo.com/video/856230447?h=553ef6e21b&vimeo_logo=0"}
              // src={"https://drive.google.com/uc?id=1JOZBkMwOllSNg7ameXnAj1dlagusMeux/preview"}
              width="640"
              height="360"
              frameborder="0"
              allowfullscreen
              allow="autoplay; encrypted-media"
            >
            </iframe> */}

            <MediaPlayer
              // src={`https://drive.google.com/file/d/1uYMjUoyQpt0c14DGCEGFp_pTk5I4Q9Ka/preview`}
              src={transformVimeoUrl(currentMessage?.section_url)}
              viewType='video'
              streamType='on-demand'
              logLevel='warn'
              crossOrigin
            // playsInline
            // title='Sprite Fight'
            // poster='https://drive.google.com/thumbnail?id=1JOZBkMwOllSNg7ameXnAj1dlagusMeux&sz=w1000'
            >
              <MediaProvider>
                <Poster className="vds-poster" />
              </MediaProvider>
              <DefaultVideoLayout
                icons={defaultLayoutIcons}
              />
            </MediaPlayer>
          </div>
          <span dangerouslySetInnerHTML={{ __html: currentMessage?.content }} className="lesson-description1-mcajn2">
          </span>
        </>
      )
    }
    else if ((currentMessage.section == Sections.summary || currentMessage.section == Sections.general) && currentMessage?.content) {
      return (
        <>
          <span className="lesson-description-mcajn2">
            {currentMessage?.content}
          </span>
        </>
      );
    }
    else if (currentMessage.section == Sections.attachment && currentMessage?.image_path) {
      return (
        <>
          <img
            src={currentMessage?.image_path ? (apiURL + currentMessage?.image_path) : "/assets/image.png"}
            className="lesson-image-mcajn2"
            alt="..."
            onError={(e) => {
              e.currentTarget.setAttribute('src', '/assets/image.png')
            }}
          />
        </>
      );
    }
    else if (currentMessage.section == Sections.quiz && currentQuiz) {
      return (
        <>
          {currentQuiz.map((quiz, i) => {
            return (
              <div key={i}>
                <span className="lesson-description-mcajn2">
                  {i + 1}. {quiz?.question}
                </span>
                <RadioGroup
                  style={{ marginTop: 20, marginBottom: 20, width: '100%', alignItems: 'center' }}
                  onChange={(e) => {
                    let selectedQuizAnswers = [...selectedQuizAnswer];
                    let index = selectedQuizAnswers.findIndex(c => c?.question == quiz?.question);
                    if (index > -1) {
                      selectedQuizAnswers[index] = { ...quiz, selectedAnswer: e.target.value };
                      setSelectedQuizAnswer([...selectedQuizAnswers]);
                    } else {
                      setSelectedQuizAnswer([...selectedQuizAnswers, { ...quiz, selectedAnswer: e.target.value }]);
                    }

                    setSelectedQuizAnswerError(null);
                  }}>
                  {Object.keys(quiz.options).map((option, qi) => {
                    return (
                      <CustomRadio key={qi} value={option} question={quiz?.question} correctAns={quiz.answer}>
                        <span className="quiz-option-mcajn2"><b>{option.toUpperCase()}:</b> {Object.values(quiz.options)[qi]}</span>
                      </CustomRadio>
                    )
                  })}
                </RadioGroup>
                {selectedQuizAnswerError && !selectedQuizAnswer.some(c => c?.question == quiz?.question) ? <span className="option-error-ncka2nx">{selectedQuizAnswerError}</span> : null}
              </div>
            );
          })}

        </>
      );
    }
  }

  const CustomRadio = (props) => {
    const {
      Component,
      children,
      isSelected,
      description,
      getBaseProps,
      getWrapperProps,
      getInputProps,
      getLabelProps,
      getLabelWrapperProps,
      getControlProps,
    } = useRadio(props);

    return (
      <Component
        {...getBaseProps()}
        className={cn(
          "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between tap-highlight-transparent",
          "cursor-pointer border-1 border-default rounded-lg gap-1",
          "data-[selected=true]:border-primary",
        )}
        style={{ width: 'auto', maxWidth: '100%', minWidth: 200, borderRadius: 20, padding: '8.5px 18px', }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <span {...getWrapperProps()}>
            <span {...getControlProps()} />
          </span>
          <div {...getLabelWrapperProps()}>
            {children && <span {...getLabelProps()}>{children}</span>}
          </div>
        </div>
        <div style={{ width: 30, justifyContent: 'flex-end', display: 'flex' }}>
          {selectedQuizAnswer?.length > 0 && selectedQuizAnswer?.find(x => x.question == props.question)?.selectedAnswer == props.value ?
            selectedQuizAnswer?.find(x => x.question == props.question)?.selectedAnswer == props.correctAns ?
              <CheckIcon color="#24c223" size={20} />
              :
              <XIcon color="#EC5800" size={20} />
            :
            // <XIcon color="#EC5800" size={20} />
            null
          }
        </div>
      </Component>
    );
  };

  const purchaseIdentityBooster = async (authToken) => {
    let formData = new FormData();
    formData.append('coin', 200);
    const response = await fetch(apiURL + 'api/v1/user/purches/identity_booster', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      body: formData
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.status == 1) {
        toast("Create New Post Plan purchased successfully!");
        setIsSubmitVisible(true);
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

  function timeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    const seconds = diffInSeconds % 60;
    const minutes = Math.floor(diffInSeconds / 60) % 60;
    const hours = Math.floor(diffInSeconds / 3600) % 24;
    const days = Math.floor(diffInSeconds / 86400);

    if (days > 1) return `${days} Days ago`;
    if (days === 1) return `1 Day ago`;
    if (hours > 1) return `${hours} Hours ago`;
    if (hours === 1) return `1 Hour ago`;
    if (minutes > 1) return `${minutes} Minutes ago`;
    if (minutes === 1) return `1 Minute ago`;
    return `${seconds} Seconds ago`;
  }

  useEffect(() => {
    const intervalIds = [];

    const updateLikesForMedia = (index) => {
      setMedias((prevMedias) => {
        const newMedias = [...prevMedias];
        // Increment this media's likes by a random number between 1 and 5
        const incrementValue = Math.floor(Math.random() * 5) + 1;
        newMedias[index] = { ...newMedias[index], likes_count: newMedias[index].likes_count + incrementValue };
        return newMedias;
      });
    };

    medias.forEach((_, index) => {
      const interval = setInterval(() => {
        if (Math.random() < 0.5) {
          updateLikesForMedia(index); // Randomly decide to update likes for this media
        }
      }, Math.floor(Math.random() * 2000) + 2000); // Random interval between 2 and 4 seconds
      intervalIds.push(interval);
    });

    return () => {
      // Cleanup all intervals when the component unmounts
      intervalIds.forEach((id) => clearInterval(id));
    };
  }, [medias]);

  const renderMediaContent = () => {
    if (isMediaFetch) {
      return <Loading />;
    } else {
      return (
        <>
          <div className="media-posts">
            {/* Search Bar */}
            <div className={`search-post-o38ca3 ${isSearchVisible ? 'visible' : ''}`} >
              <SearchIcon
                color="var(--fifth-color)"
                size={17}
                className="search-icon"
                style={{ position: 'absolute', top: 21, left: 8 }}
              />
              <input
                type="text"
                name="search"
                className="search-input-7ajb312"
                placeholder="Search ..."
                value={searchText}
                autoComplete="off"
                style={{ paddingLeft: '40px' }}
                onChange={(event) => {
                  let searchTextValue = event.target.value.trim().toLowerCase();
                  setSearchText(searchTextValue);
                  const filteredMedias = searchTextValue
                    ? originalMedias.filter(asset => {
                      return (
                        asset?.message?.toLowerCase().includes(searchTextValue) ||
                        asset?.user?.toLowerCase().includes(searchTextValue)
                      );
                    })
                    : medias;
                  console.log(searchTextValue);
                  setMedias(filteredMedias);
                }}
              />
              <XIcon
                color="var(--fifth-color)"
                size={24}
                className="close-icon-search"
                style={{ cursor: 'pointer', position: 'absolute', top: 17.5, right: 8 }}
                onClick={() => {
                  setSearchText('');
                  setMedias(originalMedias);
                }}
              />
            </div>

            {/* Media Posts */}
            {medias?.length > 0 ? (
              medias.map((media, index) => (
                <div key={media.uuid || index} className="post">
                  <div className="info2">
                    <div className="user">
                      <div className="profile-pic">
                        <img
                          src='/assets/person.png'
                          alt={`${media.user}'s profile`}
                          style={{ height: 36, width: 36, borderRadius: '50%' }}
                        />
                      </div>
                      <p className="username">{media.user}</p>
                    </div>
                    {media.content && (
                      <div style={{ marginLeft: 'auto' }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ cursor: "pointer", color: "var(--fourth-color)" }}
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-ellipsis"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Media Content */}
                  {media.content && media.content.type_of_content === 'image' ? (
                    <img
                      src={"/assets/media/post1.webp"}
                      className="post-image"
                      alt={media.message}
                    />
                  ) : null}

                  {/* Message Content */}
                  {media.content === null && (
                    <p className="description-text">{media.message}</p>
                  )}

                  {/* Post Actions */}
                  <div className="post-content">
                    <div className="reaction-wrapper">
                      <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10px' }}
                        fill={media.likes_count > 0 ? "var(--fourth-color)" : "transparent"}
                        onClick={() => onToggleFavorite(media)}
                      />
                      <Send
                        className="send-icon"
                        onClick={messagePage}
                        style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10px' }}
                      />
                      {media.content && (
                        <Bookmark
                          className="send-icon"
                          onClick={messagePage}
                          style={{ cursor: "pointer", color: "var(--fourth-color)", marginLeft: 'auto' }}
                        />
                      )}
                    </div>
                    <p className="likes">{media.likes_count} Likes</p>
                    {media.content && (
                      <p className="description">{media.message}</p>
                    )}
                    {/* <p className="post-time">{timeAgo(media.timestamp)}</p> */}
                  </div>
                </div>
              ))
            ) : (
              <p>No media posts found.</p>
            )}

            {/* Pagination Controls */}
            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <button
                onClick={handlePrevPage}
                disabled={!prevPage}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  cursor: prevPage ? 'pointer' : 'not-allowed',
                  backgroundColor: prevPage ? 'var(--primary-color)' : 'grey',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Previous
              </button>
              <span style={{ alignSelf: 'center', color:"var(--fourth-color)" }}>
                Page {currentPage} of {Math.ceil(totalCount / 10)} {/* Adjust 10 based on your page size */}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!nextPage}
                style={{
                  padding: '10px 20px',
                  marginLeft: '10px',
                  cursor: nextPage ? 'pointer' : 'not-allowed',
                  backgroundColor: nextPage ? 'var(--primary-color)' : 'grey',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      );
    }
  };

  const renderMedia1Content = () => {
    if (isMediaFetch) {
      return (
        <>
          <div className="media-posts">
            <div className={`search-post-o38ca3 ${isSearchVisible ? 'visible' : ''}`} >
              <SearchIcon
                color="var(--fifth-color)"
                size={17}
                className="search-icon"
                style={{ position: 'absolute', top: 21, left: 8 }}
              />
              <input
                type="text"
                name="search"
                className="search-input-7ajb312"
                placeholder="Search ..."
                value={searchText}
                autoComplete="off"
                style={{ paddingLeft: '40px' }} // Adjust padding to make space for the search icon
                onChange={(event) => {
                  let searchTextValue = event.target.value.trim().toLowerCase();
                  setSearchText(searchTextValue);
                  const filteredMedias = searchTextValue
                    ? originalMedias.filter(asset => {
                      return (
                        asset?.message?.toLowerCase().includes(searchTextValue) ||
                        asset?.user?.toLowerCase().includes(searchTextValue)
                      );
                    })
                    : medias;
                  console.log(searchTextValue);
                  setMedias(filteredMedias);
                }}
              />
              <XIcon
                color="var(--fifth-color)"
                size={24}
                className="close-icon-search"
                style={{ cursor: 'pointer', position: 'absolute', top: 17.5, right: 8 }}
                onClick={(e) => {
                  setSearchText('');
                  setMedias(originalMedias);
                }}
              />
            </div>
            {medias.map((media, index) => {
              return (
                <>
                  {media.content == null ?
                    <div className="post">
                      <div className="info2">
                        <div className="user">
                          <div className="profile-pic"><img
                            src='/assets/person.png'
                            style={{ height: 36, width: 36, borderRadius: '50%' }}
                          /></div>
                          <p className="username">{media.user}</p>

                        </div>
                        <div style={{ marginLeft: 'auto' }}>

                        </div>
                      </div>
                      <p className="description-text">{media.message}</p>
                      <div className="post-content">
                        <div className="reaction-wrapper">
                          <HeartIcon
                            className="heart-icon"
                            style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10' }}
                            fill={(media.likes_count > 0) ? "var(--fourth-color)" : "transparent"}
                            onClick={() => onToggleFavorite(media)}
                          />
                          <Send className="send-icon" onClick={messagePage} style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10' }} />
                          <Bookmark className="send-icon" onClick={messagePage} style={{ cursor: "pointer", color: "var(--fourth-color)", marginLeft: 'auto' }} />
                        </div>
                        <p className="likes">{media.likes_count} Likes</p>
                        {/* <p className="post-time">{timeAgo(media.timestamp)}</p> */}
                      </div>
                    </div>
                    : <div className="post">
                      <div className="info2">
                        <div className="user">
                          <div className="profile-pic"><img
                            src='/assets/person.png'
                            style={{ height: 36, width: 36, borderRadius: '50%' }}
                          /></div>
                          <p className="username">{media.user} </p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer", color: "var(--fourth-color)" }} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </div>
                      </div>
                      <img src="/assets/media/post1.webp" className="post-image" alt="" />
                      <div className="post-content">
                        <div className="reaction-wrapper">
                          <HeartIcon
                            className="heart-icon"
                            style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10' }}
                            fill={(media.likes_count > 0) ? "var(--fourth-color)" : "transparent"}
                            onClick={() => onToggleFavorite(media)}
                          />
                          <Send className="send-icon" onClick={messagePage} style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10' }} />
                          <Bookmark className="send-icon" onClick={messagePage} style={{ cursor: "pointer", color: "var(--fourth-color)", marginLeft: 'auto' }} />

                        </div>
                        <p className="likes">{media.likes_count} Likes</p>
                        <p className="description">{media.message}</p>
                        {/* <p className="post-time">{timeAgo(media.timestamp)}</p> */}
                      </div>
                    </div>}
                  {/* <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">samwilson</p>
                    </div>
                    
                </div>
                <img src="/assets/media/post1.webp" className="post-image" alt="" />
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)",marginRight:'10' }}
                        
                      />
                       <p className="likes">1,112 likes</p>
                    </div>
                    <p className="description">This is a sample text. @mention friends and add #hastags with the links https://products.com.</p>
                    <p className="post-time">2 minutes ago</p>
                </div>
                
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">user1</p>
                    </div>
                    
                </div>
                <p className="description-text">This is a sample Message. @mention friends and add #hastags with the links https://products.com.</p>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)",marginRight:'10'  }}
                        
                      />
                       <p className="likes">1,112 likes</p>
                    </div>
                 <p className="post-time">2 minutes ago</p>
                </div>
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">Zeoob</p>
                    </div>
                </div>
                <img src="/assets/media/post2.png" class="post-image" alt=""/>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight:'10' }}
                        
                      />
                       <p className="likes">146,934 likes</p>
                    </div>
                   
                    <p className="description">This is a sample text. Add Hashtags and your desired text.</p>
                    <p className="post-time">5 minutes ago</p>
                </div>
                
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">user2</p>
                    </div>
                    
                </div>
                <p className="description-text">This is a sample Message. @mention friends and add #hastags with the links https://products.com.</p>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)",marginRight:'10'  }}
                        
                      />
                      <p className="likes">1,112 likes</p>
                    </div>
                    <p className="post-time">2 minutes ago</p>
                </div>
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">modern_web_channel</p>
                    </div>
                </div>
                <img src="/assets/media/emptypost.webp" class="post-image" alt=""/>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight:'10' }}
                        
                      />
                      <p className="likes">939 likes</p>
                    </div>
                    <p className="description">This is a sample post text. @mentions, #hashtags, https://links.com are all automatically converted.</p>
                    <p className="post-time">10 minutes ago</p>
                </div>
                
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">user3</p>
                    </div>
                    
                </div>
                <p className="description-text">This is a sample Message. @mention friends and add #hastags with the links https://products.com.</p>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight:'10' }}
                        
                      />
                      <p className="likes">1,112 likes</p>
                    </div>        
                    <p className="post-time">2 minutes ago</p>
                </div>
            </div>
            <div className="post">
                <div className="info2">
                    <div className="user">
                        <div className="profile-pic"><img
                                              src='/assets/person.png'
                                              style={{ height: 36, width: 36, borderRadius: '50%' }}
                                          /></div>
                        <p className="username">user4</p>
                    </div>
                    
                </div>
                <p className="description-text">This is a sample Message. @mention friends and add #hastags with the links https://products.com.</p>
                <div className="post-content">
                    <div className="reaction-wrapper">
                    <HeartIcon
                        className="heart-icon"
                        style={{ cursor: "pointer", color: "var(--fourth-color)",marginRight:'10'  }}
                        
                      />
                      <p className="likes">1,112 likes</p>
                    </div>
                    <p className="post-time">2 minutes ago</p>
                </div>
            </div> */}
                </>
              );
            })}

          </div>

        </>
      )
    } else {
      return (
        <Loading />
      );
    }


  }

  const renderSideMenu = () => {
    return (
      <>

        <div className='course-box' onClick={scrollToTop}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Home</div>
            </div>
            <Home style={{ color: "var(--fourth-color)" }} size={20} />
          </div>
        </div>
        <div className='course-box' onClick={handleSearch}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Search</div>
            </div>
            <Search style={{ color: "var(--fourth-color)" }} size={20} />
          </div>
        </div>
        <div className='course-box' onClick={messagePage}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Messages</div>
            </div>
            <MessageCircle style={{ color: "var(--fourth-color)" }} size={20} />
          </div>
        </div>
        <div className='course-box' onClick={() => notificationModel.onOpen()}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Notifications</div>
            </div>
            <Bell style={{ color: "var(--fourth-color)" }} size={20} />
          </div>
        </div>
        <div className='course-box' onClick={() => addmediaModel.onOpen()}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Create New Post</div>
            </div>
            <Plus style={{ color: "var(--fourth-color)" }} ssize={22} />
          </div>
        </div>
        <div className='course-box' onClick={() => profileModel.onOpen()}>
          <div className="course-info-mc2nw">
            <div className="course-text-info">
              <div className="course-name-9qncq6">Profile</div>
            </div>
            <UserRound style={{ color: "var(--fourth-color)" }} size={20} />
          </div>
        </div>

      </>
    )
  }

  const handleClose = () => {
    router.replace('/chat/' + serverId); // This navigates back to the previous page in history
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onToggleFavorite = async (media) => {
    const response = await fetch(apiURL + 'api/v1/media/like/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        message_uuid: media?.uuid, // selected course uuid
      })
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp) {
        getInitData();
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

  const handleCloseMediaModal = () => {
    addmediaModel.onClose();
    setContent("");
    setImage("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (image == '') {
      const response = await fetch(apiURL + 'api/v1/media/send/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        },
        body: JSON.stringify({
          message: content, // selected course uuid
        })
      });
      const rsp = await response.json();
      if (response.status >= 200 && response.status < 300) {
        if (rsp) {
          getInitData();
          addmediaModel.onClose();
          toast('"' + content + '" post has been successfully published');
          scrollToTop();
          setContent('');
          setImage('');
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
    } else {
      console.log(image);
      const imageName = image.name.substring(image.name.lastIndexOf('/') + 1);
      const responseImage = await fetch(image);
      const blob = await responseImage.blob();
      const extension = imageName.split('.').pop();
      const formData = new FormData();
      formData.append('content', blob, imageName);
      formData.append('channel_type', 'media');
      formData.append('type_of_content', 'image');
      formData.append('extension', extension);
      const response = await fetch(apiURL + 'api/v1/content/upload', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        },
        body: formData,
      });
      const rsp = await response.json();
      const response2 = await fetch(apiURL + 'api/v1/media/send/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        },
        body: JSON.stringify({
          content_id: rsp.data.id,
          message: content, // selected course uuid
        })
      });
      const rsp2 = await response2.json();

      if (response2.status >= 200 && response2.status < 300) {
        if (rsp2) {
          getInitData();
          addmediaModel.onClose();
          toast('"' + content + '" post has been successfully published');
          scrollToTop();
          setContent('');
          setImage('');
        } else {
          handleAPIError(rsp2);

        }
      } else {
        if (response2.status == 401) {
          dispatch(props.actions.userLogout());
        } else {
          handleAPIError(rsp2);
        }
      }
    }
  };

  return (
    <div className='container-93ca2aw'>
      <div className='header-3m32aaw'>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
          <Link href={'/chat/' + serverId} className="back-icon-nw3rf">
            <ArrowLeft className="arrow-left-header" style={{ color: "var(--fourth-color)", fontWeight: "600" }} />
          </Link>
          <div className="course-navigation-cnaw34">
            <Link href="#" style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginLeft: 18 }}>
              {/* <img
                src={"https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?size=626&ext=jpg"}
                className="category-img-9ama2f"
                alt="..."
              /> */}
              <span className="nav-category-zc62n">📱| media</span>
            </Link>
            {selectedCourse &&
              <>
                <ChevronRight size={10} style={{ marginLeft: 8, marginRight: 8, color: "var(--fourth-color)" }} />
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', cursor: 'pointer', marginLeft: 2 }}>
                  {/* <Image
                    src={selectedCourse?.pic ? (apiURL + selectedCourse?.pic) : null}
                    className="category-img-9ama2f"
                    alt="..."
                    width={24}
                  /> */}
                  <span className="nav-category-zc62n">{selectedCourse?.name}</span>
                </div>
              </>
            }
          </div>
        </div>
        <ListChecks onClick={() => mediaContractModel.onOpen()} className="modal-contract" />
        <XIcon className="close-icon" onClick={handleClose} />
      </div>

      <div className='content-92a233a'>

        <div className='left-menu-6k2zzc' id="course-sidebar">
          {renderSideMenu()}
        </div>

        <div className="right-content-83mzvcj3" ref={rightContentRef} style={{ position: "relative" }}>

          {renderMediaContent()}
          <div className="bottom-navigation-bar">
            <Home className="home-click-animation" style={{ color: "var(--fourth-color)" }} size={24} onClick={scrollToTop} />
            <Search className="home-click-animation" style={{ color: "var(--fourth-color)" }} size={24} onClick={handleSearch} />
            {/* <MessageCircle style={{ color: "var(--fourth-color)" }} size={20} />
          <Bell style={{ color: "var(--fourth-color)" }} size={20} /> */}
            <Plus className="home-click-animation" style={{ color: "var(--fourth-color)" }} size={26} onClick={() => addmediaModel.onOpen()} />
            <Bell className="home-click-animation" style={{ color: "var(--fourth-color)" }} size={24} onClick={() => notificationModel.onOpen()} />
            <UserRound className="home-click-animation" style={{ color: "var(--fourth-color)" }} size={24} onClick={() => profileModel.onOpen()} />
          </div>
          <Modal
            id="add-media-poll"
            isOpen={addmediaModel.isOpen}
            backdrop="opaque"
            radius="md"
            size='xl'
            onClose={() => {

            }}
            onOpenChange={addmediaModel.onOpenChange}
            classNames={{
              body: "suitcase-modal-mcan34",
              header: "suitcase-modal-header-mcan34 py-0",
              footer: "suitcase-modal-footer-mcan34 py-0",
            }}
            hideCloseButton
          >
            <ModalContent className="modal-content" style={{ height: '60%' }}>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'var(--fourth-color)' }}>
                      Create New Post
                    </div>
                    <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={handleCloseMediaModal} />
                  </ModalHeader>
                  <ModalBody>
                    <div className='suitcase-model-body-content-82bma2'>
                      <form onSubmit={handleSubmit}>
                        <div className="post_image">
                          <label htmlFor="post-image" className="suitcase-body-title-72bak">Upload an image or video (optional):</label>
                          <div className="upload-box" onClick={() => document.getElementById('post-image').click()}>
                            {!image ? (
                              <div className="upload-placeholder">
                                <Image size="50" />
                              </div>
                            ) : (
                              <div className="uploaded-media">
                                {image?.type && image.type.startsWith('image/') ? (
                                  <img src={URL.createObjectURL(image)} alt="Uploaded preview" className="uploaded-image" />
                                ) : (
                                  <video src={URL.createObjectURL(image)} className="uploaded-video" controls />
                                )}
                              </div>
                            )}
                          </div>
                          <input
                            id="post-image"
                            type="file"
                            onChange={handleImageUpload}
                            className="input-file"
                            accept="image/*, video/*"
                            style={{ display: 'none' }} // Hide the actual input element
                          />
                        </div>

                        <div className="post_image">
                          <label htmlFor="post-content" className="suitcase-body-title-72bak">What's on your mind?</label>
                          <textarea
                            id="post-content"
                            placeholder="Share your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="post-textarea"
                          />
                        </div>

                        <div>
                          {isSubmitVisible ? <Button type="submit" color="default" variant="ghost" className="submit-button-mdkad">
                            <span className="next-button-text-mdkad">Submit</span>
                          </Button> :
                            <Button
                              className='submit-button-mdkad'
                              style={{ marginLeft: 0 }}
                              spinner={<Spinner color='current' size='sm' />}
                              size='md'
                              color=''
                              onClick={(e) => {
                                purchaseIdentityBooster(props.user.authToken);
                              }}
                            >
                              Post FOR 200 COINS
                              <img alt="Avatar" src="/assets/coin.svg" width={16} height={16} />
                            </Button>
                          }


                        </div>
                      </form>


                    </div>

                  </ModalBody>

                </>
              )}
            </ModalContent>

          </Modal>
          <Modal
            id="notification-model"
            isOpen={notificationModel.isOpen}
            backdrop="opaque"
            radius="md"
            size='xl'
            onClose={() => {

            }}
            onOpenChange={notificationModel.onOpenChange}
            classNames={{
              body: "suitcase-modal-mcan34",
              header: "suitcase-modal-header-mcan34 py-0",
              footer: "suitcase-modal-footer-mcan34 py-0",
            }}
            hideCloseButton
          >
            <ModalContent className="modal-content" style={{ height: '50%' }}>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'var(--fourth-color)' }}>
                      Notifications
                    </div>
                    <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { notificationModel.onClose(); }} />
                  </ModalHeader>
                  <ModalBody>
                    <div className='suitcase-model-body-content-82bma2'>

                      <ul className="modal_body">
                        <li><div className="modal_text_body_div"><div className="profile-pic" style={{ marginRight: '20px' }}><img
                          src='/assets/person.png'
                          style={{ height: 30, width: 30, borderRadius: '50%' }}
                        /></div>
                          <div className="modal_text_div"><p>Sam Wilson, Peter, user3 and 7 others liked your photo.</p></div>
                          <img src="/assets/media/post1.webp" className="notification-image-info" alt="Post Image 1" /></div></li>
                        <li><div className="modal_text_body_div"><div className="profile-pic" style={{ marginRight: '20px' }}><img
                          src='/assets/person.png'
                          style={{ height: 30, width: 30, borderRadius: '50%' }}
                        /></div>
                          <div className="modal_text_div"><p >User1, Zeoob, user3 and 10 others liked your photo.</p></div>
                          <img src="/assets/media/post2.png" className="notification-image-info" alt="Post Image 2" /></div></li>

                      </ul>



                    </div>

                  </ModalBody>

                </>
              )}
            </ModalContent>

          </Modal>
          <Modal
            id="profile-model"
            isOpen={profileModel.isOpen}
            backdrop="opaque"
            radius="md"
            size='xl'
            onClose={() => {

            }}
            onOpenChange={profileModel.onOpenChange}
            classNames={{
              body: "suitcase-modal-mcan34",
              header: "suitcase-modal-header-mcan34 py-0",
              footer: "suitcase-modal-footer-mcan34 py-0",
            }}
            hideCloseButton
          >
            <ModalContent className="modal-content" style={{ height: '70%' }}>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'var(--fourth-color)' }}>
                      User Profile
                    </div>
                    <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { profileModel.onClose(); }} />
                  </ModalHeader>
                  <ModalBody>
                    <div className='suitcase-model-body-content-82bma2'>
                      <div className="user-info">
                        <div className="profile-pic" style={{ marginRight: '20px' }}><img
                          src='/assets/person.png'
                          style={{ height: 84, width: 84, borderRadius: '50%' }}
                        /></div>
                        <div style={{ marginLeft: '20px' }}> <p className="username1" >{userName}
                          <Button className="edit-profile-button username2" >Edit Profile</Button></p>
                          <p className="username1" style={{ fontSize: '14px' }}>4 posts
                            <span className="username2" > {userEmail}</span></p>
                          <p className="username1" > {userFirstName} {userLastName}</p></div>



                      </div>

                      <div className="post-info">
                        <div className="grid-head">
                          <Grid size={18} style={{ marginRight: '10px' }} />
                          Posts
                        </div>
                        <div className="post-grid">
                          <img src="/assets/media/post1.webp" className="post-image-info" alt="Post Image 1" />
                          <img src="/assets/media/post2.png" className="post-image-info" alt="Post Image 2" />
                          <img src="/assets/media/emptypost.webp" className="post-image-info" alt="Post Image 3" />
                          <img src="/assets/media/emptypost.webp" className="post-image-info" alt="Post Image 4" />
                        </div>
                      </div>
                    </div>

                  </ModalBody>

                </>
              )}
            </ModalContent>

          </Modal>

          <Modal
            id="media-contract-modal"
            isOpen={mediaContractModel.isOpen}
            backdrop="opaque"
            radius="md"
            size='2xl'
            onClose={() => {

            }}
            onOpenChange={mediaContractModel.onOpenChange}
            classNames={{
              body: "online-count-modal-mcan34",
              header: "online-count-modal-header-mcan34 py-0",
              footer: "online-count-modal-footer-mcan34 py-0",
            }}
            hideCloseButton
          >
            <ModalContent style={{ height: '67%' }}>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <p className='online-count-modal-title-mcan34'>Media Channel Agreement</p>
                    </div>
                    <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { mediaContractModel.onClose() }} />
                  </ModalHeader>
                  <ModalBody >
                    <div className='online-count-model-body-content-82bma2'>
                      <p className='online-count-body-title-72bak-media'>I Will Keep My Posts ...</p>
                      <ul className="modal_body-media" style={{ marginTop: 10 }}>
                        {[
                          'Short and sweet',
                          'About progression',
                          'About victories',
                          'About inspiration',
                          'Or about anything relating to our values',
                        ].map((item, index) => (
                          <li key={index}>
                            {/* True checkbox */}
                            <input
                              className="custom-checkbox-modal"
                              type="checkbox"
                              id={`list${index + 1}`}
                              name={`checkbox-group-${index}`} // Group the checkboxes
                            checked={mediaRules[item] === 'true'}
                            // onChange={() => handleMediaRulesCheck(item, 'true')}
                            />
                            <label className="modal_text_body" htmlFor={`list${index + 1}`}>{item}</label>
                          </li>
                        ))}
                      </ul>
                      <div className="signature-box" style={{ marginTop: 20 }}>
                        <p className="signature-title">Sign:-</p>
                        {signatureData ? (
                          <div style={{ border: '1px solid var(--fourth-color)',width:400,height:70, borderRadius: 4, color: "var(--fourth-color)" }}>
                          <img src={signatureData} alt="Signature" />
                          </div>
                        ) : (
                          <p>No signature available</p>
                        )}
                        {/* <canvas
                          // ref={canvasRef}
                          width={400}
                          height={70}
                          style={{ border: '1px solid var(--fourth-color)', borderRadius: 4, color: "var(--fourth-color)" }}
                        /> */}
                        {/* <Button  onClick={clearSignature} color="default" variant="ghost" className="clear-button-mdkad" style={{marginTop:10}}>
                                              <span className="next-button-text-mdkad">Clear</span>
                                                 </Button>
                                            <Button  onClick={saveSignature} color="default" variant="ghost" className="clear-button-mdkad" style={{marginTop:10,marginLeft:20}}>
                                              <span className="next-button-text-mdkad">Continue</span>
                                                 </Button> */}
                        {/* <button onClick={saveSignature} style={{ marginTop: 10 ,color:"var(--fourth-color)"}}>Save Signature</button> */}
                      </div>

                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

      </div>
    </div>
  );
}

export default connect(MediaPage);