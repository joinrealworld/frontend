"use client";

import React, { useState, useEffect } from "react";
import connect from '@/components/ConnectStore/connect';
import { useRouter } from 'next/navigation';
import { User, Progress, Button } from "@nextui-org/react";
import Link from "next/link";
import $ from "jquery";

import './styles.css';
import { ArrowLeft, ChevronRight, ChevronRightIcon, HeartIcon, } from 'lucide-react';
import Loading from "@/components/Loading";
import { apiURL } from "@/constant/global";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Sections = {
  video: 'video',
  summary: 'summary',
  quiz: 'quiz',
  attachment: 'attachment',
  general: 'general',
}

function CoursesByCategory(props) {

  const [category, setCategory] = useState(props.params.category);
  const [isCoursesFetch, setIsCoursesFetch] = useState(false);
  const [isCourseDataFetch, setIsCourseDataFetch] = useState(false);
  const [isQuizFetch, setIsQuizFetch] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(-1);
  // const [selectedLesson, setSelectedLesson] = useState(null);

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
    if (props?.searchParams?.cid && Number(props?.searchParams?.cid) && Number(props?.searchParams?.cid) != selectedMessageIndex) {
      getCourseDataById(Number(props?.searchParams?.cid));
    }
  }, [props?.searchParams?.cid]);

  useEffect(() => {
    if (props?.searchParams?.mi && Number(props?.searchParams?.mi) && Number(props?.searchParams?.mi) != selectedMessageIndex) {
      setSelectedMessageIndex(Number(props?.searchParams?.mi));
    }
  }, [props?.searchParams?.mi]);

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
          setIsCoursesFetch(true);
          if (props?.searchParams?.cid && rsp.payload.some(c => (c.id + "") === (props?.searchParams?.cid + ""))) {
            getCourseDataById(props?.searchParams?.cid);
          } else {
            getCourseDataById(rsp.payload[0].id);
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

  const getCourseDataById = async (courseId) => {
    const response = await fetch(apiURL + 'api/v1/channel/fetch/course/' + courseId + "/data", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.user.authToken
      }
    });
    if (response.status >= 200 && response.status < 300) {
      const rsp = await response.json();
      if (rsp.payload && rsp.payload?.id) {
        setSelectedCourse(rsp.payload);
        setIsCourseDataFetch(true);
        if (props?.searchParams?.mi && Number(props?.searchParams?.mi) > -1) {
          setSelectedMessageIndex(Number(props?.searchParams?.mi));
        } else {
          setSelectedMessageIndex(0);
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
    setIsCourseDataFetch(false);
    if (item.id !== selectedCourse?.id) {
      router.push('?cid=' + item.id + '&mi=' + 0);
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

  const onToggleFavorite = () => {
    var selectedCourseTemp = { ...selectedCourse };
    selectedCourseTemp.is_favorite = !selectedCourse?.is_favorite;
    setSelectedCourse(selectedCourseTemp);

    var courseData = [...courses];
    var index = courseData.findIndex(c => c.id === selectedCourse?.id);
    if (index !== -1) {
      courseData[index].is_favorite = courses[index].is_favorite
      setCourses(courseData);
    }
  }

  const onNextStep = (e) => {
    let newIndex = Math.min(selectedMessageIndex + 1, selectedCourse?.data?.length);
    if (selectedCourse && selectedCourse?.id) {
      router.push('?cid=' + selectedCourse?.id + '&mi=' + newIndex);
    } else {
      router.push('?mi=' + newIndex);
    }
  }

  const onPreStep = (e) => {
    let newIndex = Math.max(selectedMessageIndex - 1, 0);
    if (selectedCourse && selectedCourse?.id) {
      router.push('?cid=' + selectedCourse?.id + '&mi=' + newIndex);
    } else {
      router.push('?mi=' + newIndex);
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

  const renderCourseContent = () => {
    if (isCourseDataFetch) {
      if (selectedCourse) {
        const currentMessage = selectedCourse.data[selectedMessageIndex];
        let content = `${currentMessage?.content}`;
        // content = content.replace(/\*\*(.*?)\*\*/g, `<b>$1</b>`);
        // // Replace \n with <br>
        // content = content.replace(/\n/g, `<br />`);

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
                onClick={(e) => onToggleFavorite()} // zzz
              />
            </div>
            <div className="lesson-content-mdak32">

              {(currentMessage.section == Sections.video && currentMessage?.section_url) &&
                <>
                  <div className="lesson-video-3naksn">
                    <iframe
                      src={getVimeoPlayerURL(currentMessage?.section_url)}
                      width="640"
                      height="360"
                      frameborder="0"
                      allowfullscreen
                      allow="autoplay; encrypted-media"
                    >
                    </iframe>
                  </div>
                  {/* <span className="lesson-video-description-mcajn2">
                                {content}
                            </span> */}
                  <span dangerouslySetInnerHTML={{ __html: content }} className="lesson-video-description-mcajn2">
                  </span>
                </>
              }

              {(currentMessage.section !== Sections.video && currentMessage?.content) &&
                <>
                  <span className="lesson-video-description-mcajn2">
                    {content}
                  </span>
                </>
              }
              <div style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                {selectedMessageIndex > 0 &&
                  <Button color="default" variant="ghost" className="next-button-mdkad" onClick={onPreStep}>
                    <span className="next-button-text-mdkad">Previous</span>
                  </Button>
                }

                {selectedMessageIndex > 0 &&
                  <div style={{ width: '10%' }} />
                }

                <Button color="default" variant="ghost" className="next-button-mdkad" onClick={onNextStep}>
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
                    onClick={(e) => onToggleFavorite()} // zzz
                  />
                </>
              }
            </div>
            <div style={{ padding: 30, paddingTop: 100, display: 'flex', justifyContent: 'center', height: '100%', }}>
              <h4 className="text-white">No course content available!</h4>
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
          const isSelected = selectedCourse?.id == course.id;
          return (
            <div key={index} className="course-item-k3bda">
              <div className={`course-item-header-acnk3 ${isSelected ? "active" : undefined}`} onClick={(e) => onSelectCourse(course)}>
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <User
                    name={course.name}
                    description={course.completed + "% completed"}
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
                  {/* {isSelected ?
                                            <ChevronDownIcon color="white" />
                                            :
                                            <ChevronRightIcon color="white" />
                                        } */}
                </div>
                <Progress
                  size="sm"
                  radius="sm"
                  aria-label="Loading..."
                  value={course.completed}
                  style={{ marginTop: 12 }}
                  classNames={{
                    indicator: "course-progress-983bzs",
                  }}
                  color="success"
                />
                <div style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', display: 'flex', alignSelf: 'flex-start' }}>
                  <span className="course-value-nja72b">{course.data?.filter(x => x.section == 'video')?.length}</span>
                  <span className="course-label-nja72b">Video</span>
                  <span className="course-desc-divider-nja72b">|</span>
                  <span className="course-value-nja72b">{course.data?.filter(x => x.section == 'quiz')?.length}</span>
                  <span className="course-label-nja72b">Questions</span>
                </div>
              </div>
              {/* {isSelected &&
                                    <div className="course-lessons-38cjwd">
                                        {renderModules(courses)}
                                    </div>
                                } */}
            </div>
          );
        });
      } else {
        return (
          <div style={{ padding: 30, paddingTop: 100, display: 'flex', justifyContent: 'center', height: '100%', }}>
            <h4 className="text-white">No courses available!</h4>
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
          <Link href={'/courses'} className="back-icon-nw3rf">
            <ArrowLeft style={{ color: "var(--fourth-color)" }} />
          </Link>
          <div className="course-navigation-cnaw34">
            <Link href={'/courses'} style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', marginLeft: 20 }}>
              <img
                src={"https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg?size=626&ext=jpg"}
                className="category-img-9ama2f"
                alt="..."
              />
              <span className="nav-category-zc62n">Cryptocurrency Investing Learning Center</span>
            </Link>
            {selectedCourse &&
              <>
                <ChevronRight size={15} style={{ marginLeft: 10, color: "var(--fourth-color)" }} />
                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', cursor: 'pointer', marginLeft: 12 }}>
                  <img
                    src={selectedCourse?.course_pic ? (apiURL + selectedCourse?.course_pic) : null}
                    className="category-img-9ama2f"
                    alt="..."
                  />
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