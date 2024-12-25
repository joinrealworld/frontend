"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Progress, Button, RadioGroup, useRadio, cn, VisuallyHidden, Spinner, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, } from "@nextui-org/react";
import Link from "next/link";
import $ from "jquery";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { ArrowLeft, CheckIcon, ChevronRight, ChevronRightIcon, HeartIcon, XIcon, SearchIcon, MoveLeft, AlignLeft, ArrowLeftCircle, PanelLeft, CheckCircleIcon, CheckCircle2Icon } from 'lucide-react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react"
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import ValidatedForm from '@/components/ValidatedForm';

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

  const [isNextClick, setIsNextClick] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState('');
  const [isLoadingSubmitFeedback, setIsLoadingSubmitFeedback] = useState(false);

  const feedbackModel = useDisclosure({
    id: 'ask-feedback',
  });

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
          let coursesList = rsp.payload.filter(c => c.lessons > 0);
          setCourses(coursesList);
          setOriginalCourses(coursesList);
          setIsCoursesFetch(true);
          if (!searchParams?.cid) {
            router.replace('?cid=' + coursesList?.[0]?.uuid);
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
        let coursesList = [...courses];
        coursesList = coursesList.map(c => {
          if (c.uuid == rsp.payload?.uuid) {
            c = rsp.payload;
            c.lessons = rsp.payload?.data?.length;
          }
          return c;
        })
        setCourses(coursesList);
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
      setIsNextClick(false);
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

  const markLessonFavorite = () => {
    if (!selectedCourse?.is_favorite) {
      onToggleFavorite();
    }
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
        if (selectedLesson?.section == Sections.video && !isNextClick) {
          setIsNextClick(true);
        } else {
          onNextLessonClick();
        }
        setIsNextLoading(false);
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
    if (isNextClick) {
      setIsNextClick(false);
      return;
    }
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

  const onNextLessonClick = (onSuccess = () => { }) => {
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
    getCourseDataById(selectedCourse?.uuid, false);
    onSuccess();
  }

  const renderCourseContentBySection = (currentMessage) => {
    if (currentMessage.section == Sections.video && currentMessage?.section_url) {
      if (isNextClick) {
        return (
          <>
            <div style={{ flex: 1, width: '90%' }}>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <CheckCircle2Icon size={24} style={{ color: "var(--gold-color)", marginRight: 10 }} />
                <div className="lesson-complete-mcajn2">
                  Lesson Complete
                </div>
              </div>

              <div className="after-course-box-mcajn2" onClick={(e) => markLessonFavorite()}>
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                  <h1 className="after-course-title-mcajn2">Favorite</h1>
                  <p className="after-course-desc-mcajn2">Liked the lesson? Add it to your favorites to watch it again later.</p>
                </div>
                <button className="btn btn-sm btn-circle btn-ghost">
                  <HeartIcon
                    className="heart-icon"
                    fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                    style={{ color: "var(--fourth-color)" }}
                    size={22}
                  />
                </button>
              </div>
              <div className="after-course-box-mcajn2" onClick={(e) => feedbackModel.onOpen()}>
                <div style={{ display: 'flex', flexDirection: 'column', }}>
                  <h1 className="after-course-title-mcajn2">Feedback</h1>
                  <p className="after-course-desc-mcajn2">Share your feedback with us about this lesson.</p>
                </div>
                <button className="btn btn-sm btn-circle btn-ghost">
                  <ChevronRight size={22} style={{ color: "var(--fourth-color)" }} />
                </button>
              </div>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button isLoading={isNextLoading} variant="flat" className="next-lesson-button-mdkad" onClick={(e) => {
                  onNextLessonClick(() => {
                    setTimeout(() => {
                      setIsNextClick(false);
                    }, 2000);
                  });
                }}>
                  <span className="next-button-text-mdkad">Next Lesson</span>
                </Button>
              </div>
            </div>
          </>
        );
      }

      return (
        <>
          <div className="lesson-video-3naksn">
            {/* <iframe
              src={getVimeoPlayerURL(currentMessage?.section_url)}
              // src={"https://player.vimeo.com/video/856230447?h=553ef6e21b&vimeo_logo=0"}
              // src={"https://drive.google.com/uc?id=1JOZBkMwOllSNg7ameXnAj1dlagusMeux/preview"}
              width="640"
              height="360"
              frameborder="0"
              allowfullscreen
              allow="autoplay; encrypted-media"
            >
            </iframe> */}

            {/* <video class="relative h-full w-full"
              poster="https://assets.therealworld.ag/thumbnails/01J6AB5AM7WA0YYKS5H39VNVJ2?max_side=1600"
              playsinline=""
              src="blob:https://app.jointherealworld.com/703b6d66-4697-4464-ac7e-d1d96c285238">

            </video> */}

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

  const onSubmitFeedback = async () => {
    if (!feedbackValue) return;
    setIsLoadingSubmitFeedback(true);
    const response = await fetch(apiURL + 'api/v1/feedback/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      },
      body: JSON.stringify({
        content: selectedLesson,
        master_category: serverId,
        category: category,
        course: selectedCourse?.uuid,
        description: feedbackValue
      })
    });
    const rsp = await response.json();
    if (response.status >= 200 && response.status < 300) {
      if (rsp.payload) {
        toast("Feedback submitted successfully!");
        setIsLoadingSubmitFeedback(false);
        feedbackModel.onClose();
      } else {
        handleAPIError(rsp);
        setIsLoadingSubmitFeedback(false);
      }
    } else {
      if (response.status == 401) {
        dispatch(props.actions.userLogout());
      } else {
        handleAPIError(rsp);
        setIsLoadingSubmitFeedback(false);
      }
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
          "cursor-pointer rounded-lg gap-1",
          "data-[selected=true]:border-primary",
        )}
        style={{ width: 'auto', maxWidth: '100%', borderRadius: 9, padding: '8.5px 18px', borderWidth: 0.1, borderColor: 'rgba(255, 255, 255, 0.7)' }}
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
    setIsNextClick(false);
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
                <div style={{ height: "2rem", width: "2rem" }}></div>
                {selectedCourse &&
                  <>
                    <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
                    <HeartIcon
                      className="heart-icon"
                      fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                      style={{ cursor: "pointer", color: "var(--fourth-color)", }}
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
              {selectedCourse?.data?.findIndex(c => c?.uuid == selectedLesson?.uuid) > 0 ?
                <ArrowLeft isLoading={isPreviousLoading} className="arrow-left" onClick={onPreStep} /> :
                <div style={{ height: "2rem", width: "2rem" }}></div>
              }
              <ArrowLeft
                id="sidebar-btn-nack3"
                style={{ position: "absolute", left: "5%", cursor: "pointer", color: "var(--third-color)", }}
                onClick={onOpenSideMenu}
              />
              <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
              <HeartIcon
                className="heart-icon"
                fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                style={{ cursor: "pointer", color: "var(--fourth-color)", }}
                onClick={(e) => onToggleFavorite()}
              />
            </div>
            <div className="lesson-content-mdak32">
              {renderCourseContentBySection(currentMessage)}
              {currentMessage.section != Sections.video || (currentMessage.section == Sections.video && currentMessage?.section_url && !isNextClick) ?
                <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '90%' }} />
                  <Button spinner={<Spinner color='current' size='sm' />} color="default" isLoading={isNextLoading} variant="ghost" className="next-button-mdkad" onClick={onNextStep}>
                    <span className="next-button-text-mdkad">NEXT</span>
                  </Button>
                </div>
                :
                null
              }
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
              <div style={{ height: "2rem", width: "2rem" }}></div>
              {selectedCourse &&
                <>
                  <h2 className="lesson-title-1mcasa">{selectedCourse?.name}</h2>
                  <HeartIcon
                    className="heart-icon"
                    fill={selectedCourse.is_favorite ? "var(--fourth-color)" : "transparent"}
                    style={{ cursor: "pointer", color: "var(--fourth-color)", }}
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

  const lessonClick = (lesson) => () => {
    setIsNextClick(false);
    router.push('?cid=' + selectedCourse?.uuid + '&lid=' + lesson?.uuid);
  }

  const renderSubTextByLessonSection = (section) => {
    if (section == Sections.video) {
      return "Video";
    }
    else if (section == Sections.attachment) {
      return "Attachment";
    }
    else if (section == Sections.general || section == Sections.summary) {
      return "Text";
    }
    else if (section == Sections.quiz) {
      return "Quiz";
    }
  }

  const renderLessons = () => {
    if (selectedCourse && selectedCourse.data && selectedCourse.data.length > 0) {
      return (
        <div style={{ marginBottom: 20, backgroundColor: 'var(--primary-color)', paddingTop: 10 }}>
          {selectedCourse.data.map((lesson, index) => {
            const isSelected = selectedLesson?.uuid == lesson.uuid;
            return (
              <div key={index} className={`lesson-box-62nks ${isSelected ? 'active' : undefined}`} onClick={lessonClick(lesson)}>
                <div className="lesson-text-info">
                  <div className="lesson-name-9qncq6">{selectedCourse.name} - {"Lesson " + (index + 1)}</div>

                  <div className="lesson-description-9qncq6">{renderSubTextByLessonSection(lesson.section)}</div>
                </div>
                <ChevronRightIcon size={18} style={{ color: "var(--fourth-color)" }} />
              </div>
            )
          })}
        </div>
      )
    }
  }

  const renderCourseList = () => {
    if (isCoursesFetch) {
      if (courses.length > 0) {
        return courses.map((course, index) => {
          const isSelected = selectedCourse?.uuid == course.uuid;
          return (
            // <div key={index} className="course-item-k3bda">
            //   <div className={`course-item-header-acnk3 ${isSelected ? "active" : undefined}`} onClick={(e) => onSelectCourse(course)}>
            //     <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <>
              <div key={index} className={`course-box ${course.completed === 100 ? 'success-course-box' : 'course-box'} ${isSelected ? 'selected-course' : undefined}`} onClick={(e) => onSelectCourse(course)} >
                <div className="course-info-mc2nw">
                  <div className="course-text-info">
                    <div className="course-name-9qncq6">{course.name}</div>
                    <div className="course-name1-9qncq6">{(isSelected ? selectedCourse?.completed : course.completed)}%<span className="course-label-nja72b"> complete</span></div>

                    <Progress
                      size="sm"
                      radius="sm"
                      aria-label="Loading..."
                      value={isSelected ? selectedCourse?.completed : course.completed}
                      style={{ marginTop: 4 }}
                      classNames={{
                        indicator: "course-progress-983bzs",
                      }}
                      color="success"
                    />
                    <div style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', display: 'flex', }}>
                      {/* <span className="course-value-nja72b">{(course.completed * course.lessons) / 100} / {course.lessons}</span> */}
                      <span className="course-value-nja72b">{course.lessons}</span>
                      <span className="course-label-nja72b">Lessons</span>
                      {/* <span className="course-desc-divider-nja72b">|</span>
                  <span className="course-value-nja72b">{selectedCourse.data?.filter(x => x.section == 'video')?.length}</span>
                  <span className="course-label-nja72b">Videos</span> */}
                    </div>
                  </div>
                  <ChevronRightIcon style={{ color: "var(--fourth-color)" }} />
                  {/* <div className="course-avatar">
                <span>{(course.name).split('┃')[0]}</span>
                </div> */}
                </div>
              </div>
              {isSelected ? renderLessons() : null}
            </>
            //     </div>


            //   </div>
            // </div>
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

  const handleClose = () => {
    router.replace('/chat/' + serverId + '/courses/'); // This navigates back to the previous page in history
  };

  return (
    <div className='container-93ca2aw'>
      <div className='header-3m32aaw'>
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
          <Link href={'/chat/' + serverId + '/courses/'} className="back-icon-nw3rf">
            <ArrowLeft className="arrow-left-header" style={{ color: "var(--fourth-color)" }} />
          </Link>
          <div className="course-navigation-cnaw34">
            <Link href={'/chat/' + serverId + '/courses/'} style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginLeft: 12 }}>
              {/* <img
                src={"https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?size=626&ext=jpg"}
                className="category-img-9ama2f"
                alt="..."
              /> */}
              <span className="nav-category-zc62n">Cryptocurrency Investing Learning Center</span>
            </Link>
            {selectedCourse &&
              <>
                <ChevronRight size={18} style={{ marginLeft: 12, marginRight: 12, color: "var(--fourth-color)" }} />
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
        <span className="title-cnaw34">Learning Center</span>
        <XIcon className="close-icon" onClick={handleClose} />
      </div>

      <div className='content-92a233a'>

        <div className='left-menu-6k2zzc' id="course-sidebar">

          <div className="search-course-o38ca3" style={{ position: 'relative' }}>
            <SearchIcon
              color="var(--fifth-color)"
              size={17}
              className="search-icon"
              style={{ position: 'absolute', top: 21, left: 8 }}
            />
            <input
              type="text"
              name="search"
              className="search-input-ncka2nx"
              placeholder="Search lessons"
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
          </div>

          {renderCourseList()}

        </div>

        <div className="right-content-83mzvcj3" id="course-content">

          {isCoursesFetch ? renderCourseContent() : null}

        </div>
      </div>
      <Modal
        id="ask-feedback"
        isOpen={feedbackModel.isOpen}
        backdrop="opaque"
        radius="md"
        onOpenChange={feedbackModel.onOpenChange}
        classNames={{
          body: "py-6 modal-ncka2nx",
          header: "modal-header-ncka2nx border-b-[1px] border-[#292f46]",
          footer: "modal-ncka2nx pt-2",
        }}
        onClose={() => {
          setFeedbackValue('');
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="modal-title-ncka2nx flex flex-col gap-1">Give Feedback</ModalHeader>
              <ModalBody>
                <ValidatedForm
                  rules={{
                    feedbackvalue: {
                      required: true
                    },
                  }}
                  messages={{
                    feedbackvalue: {
                      required: "Feedback is required!"
                    }
                  }}
                  onSubmit={onSubmitFeedback}
                >
                  <form>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column' }}>
                        <span className='modal-title-ncka2nx fs-6'>Have feedback about this lesson?</span>
                        <span className='modal-title-ncka2nx fs-6'>Share it here.</span>
                      </div>
                      <textarea
                        type="text"
                        name="feedbackvalue"
                        className="form-control-ncka2nx"
                        placeholder="Share your feedback"
                        autoComplete="off"
                        style={{ height: 100 }}
                        aria-multiline
                        value={feedbackValue}
                        maxLength={120}
                        onChange={(event) =>
                          setFeedbackValue(event.target.value)
                        }
                      />
                    </div>
                  </form>
                </ValidatedForm>
              </ModalBody>
              <ModalFooter>
                <Button className='main-button-ncka2nx' style={{ width: 'fit-content', marginBottom: 0 }} spinner={<Spinner color='current' size='sm' />} isLoading={isLoadingSubmitFeedback} radius='sm' size='lg' type='submit' color='' onClick={onSubmitFeedback}>
                  SUBMIT FEEDBACK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default connect(CoursesByCategory);