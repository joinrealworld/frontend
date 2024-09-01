"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Progress, Button, RadioGroup, useDisclosure, useRadio, cn, VisuallyHidden, Spinner, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/react";
import Link from "next/link";
import $ from "jquery";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ArrowLeft, CheckIcon, ChevronRight, ChevronRightIcon, HeartIcon, XIcon, SearchIcon, Plus } from 'lucide-react';

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
  
  const router = useRouter();
  const dispatch = useDispatch();

  const addmediaModel = useDisclosure({
    id: 'add-media-poll',
  });

  useEffect(() => {
    if (props.user.isLoggedIn) {

    }
  }, []);

  useEffect(() => {
    if (!props.user.isLoggedIn) {
      router.push('/login');
    }
  }, [props.user.isLoggedIn]);

  useEffect(() => {
    if (searchParams?.cid && searchParams?.cid != selectedCourse?.uuid) {
      getCourseDataById(searchParams?.cid);
    }
  }, [searchParams?.cid]);

  const getMediaData = async () => {
    const response = await fetch(apiURL + 'api/v1/media/fetch/message', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.results) {
        setMedias(rsp.results);
        setIsMediaFetch(true);
      }
    } else {
      toast("Error while fetching data!");
    }
  }

  const getInitData = async () => {
    getMediaData();
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

  const goToNextCourse = (e) => {
    let index = Math.min(originalCourses.findIndex(c => c.uuid == selectedCourse?.uuid) + 1, originalCourses?.length);
    router.push('?cid=' + originalCourses?.[index]?.uuid);
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

  const renderMediaContent = () => {
    if(isMediaFetch){
      return (
        <>
          <div className="media-posts">
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
                          <p className="likes">{media.likes_count} Likes</p>
                        </div>
                        <p className="post-time">{timeAgo(media.timestamp)}</p>
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
  
                      </div>
                      <img src={(apiURL + media.content.content)} className="post-image" alt="" />
                      <div className="post-content">
                        <div className="reaction-wrapper">
                          <HeartIcon
                            className="heart-icon"
                            style={{ cursor: "pointer", color: "var(--fourth-color)", marginRight: '10' }}
                            fill={(media.likes_count > 0) ? "var(--fourth-color)" : "transparent"}
                            onClick={() => onToggleFavorite(media)}
                          />
                          <p className="likes">{media.likes_count} Likes</p>
                        </div>
                        <p className="description">{media.message}</p>
                        <p className="post-time">{timeAgo(media.timestamp)}</p>
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
    }else{
      return (
        <Loading />
      );
    }
   
    // if (isCourseDataFetch) {
    //   if (selectedCourse) {

    //     let currentMessage = { ...selectedLesson };
    //     // currentMessage.content = currentMessage?.content.replace(/\*\*(.*?)\*\*/g, `<b>$1</b>`);
    //     // // Replace \n with <br>
    //     // currentMessage.content = currentMessage?.content.replace(/\n/g, `<br />`);

    //     if (Math.round(selectedCourse?.completed).toString() == '100') {
    //       return (
    //         <>
    //           <div className="lesson-header-23maaa">
    //             <ArrowLeft
    //               id="sidebar-btn-nack3"
    //               style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
    //               onClick={onOpenSideMenu}
    //             />
    //             <div style={{ height: "2rem", width: "2rem" }}></div>
    //             {selectedCourse &&
    //               <>
    //                 <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
    //                 <HeartIcon
    //                   className="heart-icon"
    //                   fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
    //                   style={{ cursor: "pointer", color: "var(--fourth-color)", }}
    //                   onClick={(e) => onToggleFavorite()}
    //                 />
    //               </>
    //             }
    //           </div>
    //           <div style={{ padding: 30, paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', }}>
    //             <h5 style={{ color: "var(--fourth-color)" }}>Successfully 100% completed!</h5>
    //             <Button color="default" variant="ghost" className="next-button-mdkad" onClick={goToNextCourse}>
    //               <span className="next-button-text-mdkad">Go To Next</span>
    //             </Button>
    //           </div>

    //         </>
    //       );
    //     }
    //     return (
    //       <>
    //         <div className="lesson-header-23maaa">
    //           {selectedCourse?.data?.findIndex(c => c?.uuid == selectedLesson?.uuid) > 0 ?
    //             <ArrowLeft isLoading={isPreviousLoading} className="arrow-left" onClick={onPreStep} /> :
    //             <div style={{ height: "2rem", width: "2rem" }}></div>
    //           }
    //           <ArrowLeft
    //             id="sidebar-btn-nack3"
    //             style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--third-color)", }}
    //             onClick={onOpenSideMenu}
    //           />
    //           <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
    //           <HeartIcon
    //             className="heart-icon"
    //             fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
    //             style={{ cursor: "pointer", color: "var(--fourth-color)", }}
    //             onClick={(e) => onToggleFavorite()}
    //           />
    //         </div>
    //         <div className="lesson-content-mdak32">
    //           {renderCourseContentBySection(currentMessage)}
    //           <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
    //             {/* {selectedCourse?.data?.findIndex(c => c?.uuid == selectedLesson?.uuid) > 0 &&

    //             } */}
    //             <div style={{ width: '90%' }} />
    //             <Button spinner={<Spinner color='current' size='sm' />} color="default" isLoading={isNextLoading} variant="ghost" className="next-button-mdkad" onClick={onNextStep}>
    //               <span className="next-button-text-mdkad">NEXT</span>
    //             </Button>
    //           </div>
    //         </div>
    //       </>
    //     );
    //   } else {
    //     return (
    //       <>
    //         <div className="lesson-header-23maaa">
    //           <ArrowLeft
    //             id="sidebar-btn-nack3"
    //             style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
    //             onClick={onOpenSideMenu}
    //           />
    //           <div style={{ height: "2rem", width: "2rem" }}></div>
    //           {selectedCourse &&
    //             <>
    //               <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
    //               <HeartIcon
    //                 className="heart-icon"
    //                 fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
    //                 style={{ cursor: "pointer", color: "var(--fourth-color)", }}
    //                 onClick={(e) => onToggleFavorite()}
    //               />
    //             </>
    //           }
    //         </div>
    //         <div style={{ padding: 30, paddingTop: 100, display: 'flex', justifyContent: 'center', height: '100%', }}>
    //           <h5 className="var(--fourth-color)">No course content available!</h5>
    //         </div>
    //       </>
    //     );
    //   }
    // } else {
    //   return (
    //     <Loading />
    //   );
    // }
  }

  const handleClose = () => {
    router.replace('/chat/' + serverId); // This navigates back to the previous page in history
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file.name);
    }
  };

  const onToggleFavorite = async (media) => {
    console.log(media);
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if(image == ''){
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
    }else{
      const imageName = image.substring(image.lastIndexOf('/') + 1);
      const responseImage = await fetch(image);
      const blob = await responseImage.blob();
      const extension = imageName.split('.').pop();
      const formData = new FormData();
      formData.append('content', blob, imageName);
      formData.append('channel_type', 'media');
      formData.append('type_of_content', 'image');
      formData.append('extension',extension );
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
        <XIcon className="close-icon" onClick={handleClose} />
      </div>

      <div className='content-92a233a'>

        <div className='left-menu-6k2zzc' id="course-sidebar">

          {/* <div className="search-course-o38ca3" style={{ position: 'relative' }}>
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
              placeholder="Search media..."
              value={searchText}
              autoComplete="off"
              style={{ paddingLeft: '40px' }} // Adjust padding to make space for the search icon
              onChange={(event) => {
                let searchTextValue = event.target.value.trim().toLowerCase();
                setSearchText(searchTextValue);
                const filteredCourses = searchTextValue
                  ? originalCourses.filter(asset => {
                    return asset?.name?.toLowerCase().indexOf(searchTextValue) > -1;
                  })
                  : originalCourses;
                setCourses(filteredCourses);
              }}
            />
            <XIcon
              color="var(--fifth-color)"
              size={24}
              className="close-icon-search"
              style={{ cursor: 'pointer', position: 'absolute', top: 17.5, right: 8 }}
              onClick={(e) => {
                setSearchText('');
                setCourses(originalCourses);
              }}
            />
          </div> */}

          <div className='course-box' onClick={() => addmediaModel.onOpen()}>
            <div className="course-info-mc2nw">
              <div className="course-text-info">
                <div className="course-name-9qncq6">Create New Post</div>
              </div>
              <Plus style={{ color: "var(--fourth-color)" }} />
            </div>
          </div>

        </div>

        <div className="right-content-83mzvcj3" id="course-content">

          {renderMediaContent()}
          <Modal
            id="add-media-poll"
            isOpen={addmediaModel.isOpen}
            backdrop="opaque"
            radius="md"
            size='2xl'
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
            <ModalContent style={{ height: '55%' }}>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', color: 'var(--fourth-color)' }}>
                      Create New Post
                    </div>
                    <XIcon color='var(--fourth-color)' style={{ cursor: 'pointer' }} onClick={(e) => { addmediaModel.onClose(); }} />
                  </ModalHeader>
                  <ModalBody>
                    <div className='suitcase-model-body-content-82bma2'>
                      <form onSubmit={handleSubmit}>
                        <div className="post_image">
                          <label htmlFor="post-image" className='suitcase-body-title-72bak'>Upload an image (optional):</label>
                          <input
                            id="post-image"
                            type="file"
                            onChange={handleImageUpload}
                            className="input-file"
                          />
                          {image && <p className="file-name">{image}</p>}
                        </div>
                        <div className="post_image">
                          <label htmlFor="post-content" className='suitcase-body-title-72bak'>What's on your mind?</label>
                          <textarea
                            id="post-content"
                            placeholder="Share your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="post-textarea"
                          />


                        </div>
                        <div >
                          <Button type="submit" color="default" variant="ghost" className="submit-button-mdkad" >
                            <span className="next-button-text-mdkad">Submit</span>
                          </Button>
                        </div>
                      </form>
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