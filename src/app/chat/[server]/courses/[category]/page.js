"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Progress, Button, RadioGroup, useRadio, cn, VisuallyHidden, Spinner } from "@nextui-org/react";
import Link from "next/link";
import $ from "jquery";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ArrowLeft, CheckIcon, ChevronRight, ChevronRightIcon, HeartIcon, XIcon, } from 'lucide-react';

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

function CoursesByCategory(props) {

  const serverId = props.params?.server;

  const { get } = useSearchParams();
  const searchParams = {
    cid: get('cid'),
    lid: get('lid'),
  }

  const [category, setCategory] = useState(props.params.category);
  const [isCoursesFetch, setIsCoursesFetch] = useState(false);
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

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.user.isLoggedIn) {
      getCoursesByCategory();
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

  const getCoursesByCategory = async () => {
    if (category) {
      const response = await fetch(apiURL + 'api/v1/channel/fetch/course/' + category, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.user.authToken
        }
      });
      if (response.status >= 200 && response.status < 300) {
        const rsp = await response.json();
        if (rsp?.payload && typeof rsp?.payload == 'object') {
          setCourses(rsp.payload);
          setOriginalCourses(rsp.payload);
          setIsCoursesFetch(true);
          if (!searchParams?.cid) {
            router.replace('?cid=' + rsp.payload?.[0]?.uuid);
          }
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
  }

  const getCourseDataById = async (courseId, isNavigateToLesson = true) => {
    const response = await fetch(apiURL + 'api/v1/channel/fetch/course/' + courseId + "/data", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.payload && rsp.payload?.uuid) {
        setSelectedCourse(rsp.payload);
        setIsCourseDataFetch(true);

        if (isNavigateToLesson) {
          let lesson = rsp.payload?.data?.[0];
          if (searchParams?.lid && rsp.payload?.data?.some(c => c.uuid === searchParams?.lid)) {
            lesson = rsp.payload?.data?.find(c => c.uuid === searchParams?.lid);
          } else {
            let index = Math.min(rsp.payload?.data?.findIndex(c => c.uuid === rsp.payload?.last_checked) + 1, rsp.payload?.data?.length - 1);
            if (index > -1 && rsp.payload?.data?.[index] != null) {
              lesson = rsp.payload?.data?.[index];
            }
          }
          router.replace('?cid=' + courseId + '&lid=' + lesson?.uuid);
        }

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

  const onToggleFavorite = async () => {
    var selectedCourseTemp = { ...selectedCourse };
    selectedCourseTemp.is_favorite = !selectedCourse?.is_favorite;
    setSelectedCourse(selectedCourseTemp);

    var courseData = [...courses];
    var index = courseData.findIndex(c => c.uuid === selectedCourse?.uuid);
    if (index !== -1) {
      courseData[index].is_favorite = courses[index].is_favorite
      setCourses(courseData);
    }
    const response = await fetch(apiURL + 'api/v1/channel/change/favourite/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        course_id: selectedCourse?.uuid, // selected course uuid
      })
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        if (selectedCourseTemp.is_favorite) {
          toast(selectedCourse?.name + ' course added as a Favorites!');
        } else {
          toast(selectedCourse?.name + ' course removed from Favorites!');
        }
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

  const onNextStep = async (e) => {

    if (selectedLesson?.section == Sections.quiz) {
      if (selectedQuizAnswer.length == 0 || selectedQuizAnswer.length != currentQuiz.length) {
        setSelectedQuizAnswerError('Select any one answer!');
        return;
      } else {
        setSelectedQuizAnswer([]);
        setSelectedQuizAnswerError(null);
      }
    }

    setIsNextLoading(true);
    const response = await fetch(apiURL + 'api/v1/channel/mark/complete/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        course_id: selectedCourse?.uuid, // selected course uuid
        content_id: selectedLesson?.uuid,  // selected course's content uuid
      })
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        let selectedLessonIndex = selectedCourse?.data?.findIndex(c => c.uuid === selectedLesson?.uuid);
        let newIndex = Math.min(selectedLessonIndex + 1, selectedCourse?.data?.length - 1);
        let newLesson = selectedCourse?.data?.[newIndex];
        if (selectedCourse && selectedCourse?.uuid) {
          router.push('?cid=' + selectedCourse?.uuid + '&lid=' + newLesson?.uuid);
        } else {
          if (originalCourses?.length > 0) {
            router.push('?cid=' + originalCourses?.[0]?.uuid);
          }
        }
        setIsNextLoading(false);
        getCourseDataById(selectedCourse?.uuid, false);
      } else {
        handleAPIError(rsp);
        setIsNextLoading(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
        setIsNextLoading(false);
      }
    }
  }

  const onPreStep = async (e) => {
    let selectedLessonIndex = selectedCourse?.data?.findIndex(c => c.uuid === selectedLesson?.uuid);
    let newIndex = Math.max(selectedLessonIndex - 1, 0);
    let newLesson = selectedCourse?.data?.[newIndex];
    if (selectedCourse && selectedCourse?.uuid) {
      router.push('?cid=' + selectedCourse?.uuid + '&lid=' + newLesson?.uuid);
    } else {
      if (originalCourses?.length > 0) {
        router.push('?cid=' + originalCourses?.[0]?.uuid);
      }
    }
    // setIsPreviousLoading(true);
    // const response = await fetch(apiURL + 'api/v1/channel/mark/complete/course', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + props.user.authToken
    //   },
    //   body: JSON.stringify({
    //     course_id: selectedCourse?.uuid, // selected course uuid
    //     content_id: selectedLesson?.uuid,  // selected course's content uuid
    //   })
    // });
    // const rsp = await response.json();
    // if (response.status >= 200 && response.status < 300) {
    //   if (rsp.payload) {
    //     let selectedLessonIndex = selectedCourse?.data?.findIndex(c => c.uuid === selectedLesson?.uuid);
    //     let newIndex = Math.max(selectedLessonIndex - 1, 0);
    //     let newLesson = selectedCourse?.data?.[newIndex];
    //     if (selectedCourse && selectedCourse?.uuid) {
    //       router.push('?cid=' + selectedCourse?.uuid + '&lid=' + newLesson?.uuid);
    //     } else {
    //       if (courses?.length > 0) {
    //         router.push('?cid=' + courses?.[0]?.uuid);
    //       }
    //     }
    //     setIsPreviousLoading(false);
    //   } else {
    //     handleAPIError(rsp);
    //     setIsPreviousLoading(false);
    //   }
    // } else {
    // if (response.status == 401) {
    //   dispatch(props.actions.userLogout());
    // } else {
    //   handleAPIError(rsp);
    //   setIsPreviousLoading(false);
    // }
    // }
  }

  const getQuizFromId = async (courseId, quizId, onSuccess = () => { }) => {
    const response = await fetch(`${apiURL}api/v1/channel/fetch/course/${courseId}/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp?.payload && typeof rsp?.payload == 'object' && rsp.payload?.data) {
        setCurrentQuiz(rsp.payload?.data);
        setIsQuizFetch(true);
        onSuccess();
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
                thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
                icons={defaultLayoutIcons}
              />
            </MediaPlayer>
          </div>
          <span dangerouslySetInnerHTML={{ __html: currentMessage?.content }} className="lesson-description-mcajn2">
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
              <>
                <span key={i} className="lesson-description-mcajn2">
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
              </>
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

  const renderCourseContent = () => {
    if (isCourseDataFetch) {
      if (selectedCourse) {

        let currentMessage = { ...selectedLesson };

        // currentMessage.content = currentMessage?.content.replace(/\*\*(.*?)\*\*/g, `<b>$1</b>`);
        // // Replace \n with <br>
        // currentMessage.content = currentMessage?.content.replace(/\n/g, `<br />`);

        if (Math.round(selectedCourse?.completed).toString() == '100') {
          return (
            <>
              <div className="lesson-header-23maaa">
                <ArrowLeft
                  id="sidebar-btn-nack3"
                  style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                  onClick={onOpenSideMenu}
                />
                {selectedCourse &&
                  <>
                    <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
                    <HeartIcon
                      fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                      style={{ position: "absolute", right: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                      onClick={(e) => onToggleFavorite()}
                    />
                  </>
                }
              </div>
              <div style={{ padding: 30, paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', }}>
                <h5 style={{ color: "var(--fourth-color)" }}>Successfully 100% completed!</h5>
                <Button color="default" variant="ghost" className="next-button-mdkad" onClick={goToNextCourse}>
                  <span className="next-button-text-mdkad">Go To Next</span>
                </Button>
              </div>

            </>
          );
        }
        return (
          <>
            <div className="lesson-header-23maaa">
              <ArrowLeft
                id="sidebar-btn-nack3"
                style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                onClick={onOpenSideMenu}
              />
              <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
              <HeartIcon
                fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                style={{ position: "absolute", right: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                onClick={(e) => onToggleFavorite()}
              />
            </div>
            <div className="lesson-content-mdak32">

              {renderCourseContentBySection(currentMessage)}

              <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                {selectedCourse?.data?.findIndex(c => c?.uuid == selectedLesson?.uuid) > 0 &&
                  <Button color="default" isLoading={isPreviousLoading} variant="ghost" className="next-button-mdkad" onClick={onPreStep}>
                    <span className="next-button-text-mdkad">Previous</span>
                  </Button>
                }

                {selectedCourse?.data?.findIndex(c => c?.uuid == selectedLesson?.uuid) > 0 &&
                  <div style={{ width: '10%' }} />
                }

                <Button spinner={<Spinner color='current' size='sm' />} color="default" isLoading={isNextLoading} variant="ghost" className="next-button-mdkad" onClick={onNextStep}>
                  <span className="next-button-text-mdkad">Next</span>
                </Button>
              </div>

            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="lesson-header-23maaa">
              <ArrowLeft
                id="sidebar-btn-nack3"
                style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                onClick={onOpenSideMenu}
              />
              {selectedCourse &&
                <>
                  <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
                  <HeartIcon
                    fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                    style={{ position: "absolute", right: "5%", cursor: "pointer", color: "var(--fourth-color)", }}
                    onClick={(e) => onToggleFavorite()}
                  />
                </>
              }
            </div>
            <div style={{ padding: 30, paddingTop: 100, display: 'flex', justifyContent: 'center', height: '100%', }}>
              <h5 className="var(--fourth-color)">No course content available!</h5>
            </div>
          </>
        );
      }
    } else {
      return (
        <Loading />
      );
    }
  }

  const renderCourseList = () => {
    if (isCoursesFetch) {
      if (courses.length > 0) {
        return courses.map((course, index) => {
          const isSelected = selectedCourse?.uuid == course.uuid;
          return (
            <div key={index} className="course-item-k3bda">
              <div className={`course-item-header-acnk3 ${isSelected ? "active" : undefined}`} onClick={(e) => onSelectCourse(course)}>
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <User
                    name={course.name}
                    description={(isSelected ? selectedCourse?.completed : course.completed) + "% completed"}
                    avatarProps={{
                      src: course.course_pic ? (apiURL + course.course_pic) : ''
                    }}
                    classNames={{
                      base: 'course-info-mc2nw',
                      wrapper: 'course-name-info-mc2nw',
                      name: 'course-name-9qncq6',
                      description: 'course-description-9qncq6'
                    }}
                    style={{ cursor: 'pointer' }}
                  />

                  <ChevronRightIcon style={{ color: "var(--fourth-color)" }} />

                </div>
                <Progress
                  size="sm"
                  radius="sm"
                  aria-label="Loading..."
                  value={isSelected ? selectedCourse?.completed : course.completed}
                  style={{ marginTop: 12 }}
                  classNames={{
                    indicator: "course-progress-983bzs",
                  }}
                  color="success"
                />
                <div style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center', display: 'flex', alignSelf: 'flex-start' }}>
                  {/* <span className="course-value-nja72b">{(course.completed * course.lessons) / 100} / {course.lessons}</span> */}
                  <span className="course-value-nja72b">{course.lessons}</span>
                  <span className="course-label-nja72b">Lessons</span>
                  {/* <span className="course-desc-divider-nja72b">|</span>
                  <span className="course-value-nja72b">{selectedCourse.data?.filter(x => x.section == 'video')?.length}</span>
                  <span className="course-label-nja72b">Videos</span> */}
                </div>
              </div>
            </div>
          );
        });
      } else {
        return (
          <div style={{ padding: 30, paddingTop: 100, display: 'flex', justifyContent: 'center', height: '100%', }}>
            <h4 style={{ color: 'var(--fourth-color)' }}>No courses available!</h4>
          </div>
        );
      }
    } else {
      return (
        <Loading />
      );
    }
  }
  return (
    <div className='container-93ca2aw'>
      <div className='header-3m32aaw'>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
          <Link href={'/chat/' + serverId + '/courses/'} className="back-icon-nw3rf">
            <ArrowLeft style={{ color: "var(--fourth-color)" }} />
          </Link>
          <div className="course-navigation-cnaw34">
            <Link href={'/chat/' + serverId + '/courses/'} style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginLeft: 20 }}>
              {/* <img
                src={"https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?size=626&ext=jpg"}
                className="category-img-9ama2f"
                alt="..."
              /> */}
              <span className="nav-category-zc62n">Cryptocurrency Investing Learning Center</span>
            </Link>
            {selectedCourse &&
              <>
                <ChevronRight size={20} style={{ marginLeft: 20, marginRight: 10, color: "var(--fourth-color)" }} />
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', cursor: 'pointer', marginLeft: 12 }}>
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
        <span className="title-cnaw34">Learning Center</span>
      </div>

      <div className='content-92a233a'>

        <div className='left-menu-6k2zzc' id="course-sidebar">

          <div className="search-course-o38ca3">
            <input
              type="text"
              name="search"
              className="search-input-7ajb312"
              placeholder="Search course..."
              value={searchText}
              autoComplete="off"
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
              size={20}
              style={{ cursor: 'pointer', position: 'absolute', top: 22, right: 10 }}
              onClick={(e) => {
                setSearchText('');
                setCourses(originalCourses);
              }}
            />
          </div>

          {renderCourseList()}

        </div>

        <div className="right-content-83mzvcj3" id="course-content">

          {isCoursesFetch ? renderCourseContent() : null}

        </div>
      </div>
    </div>
  );
}

export default connect(CoursesByCategory);