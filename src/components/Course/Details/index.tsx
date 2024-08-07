/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { last, groupBy, keys, sortBy, find } from "lodash";
import { Popover } from "antd";
import { EUserType as EStudentType, ICourse, IMyRegister } from "../../../api/types";
import Tabs from "../../../components/Tabs";
import Loading from "../../../components/Loading";
import RegisterModal, { verify_rules } from "../../../components/RegisterModal";
import { useDeviceDetect } from "../../../hooks";
import StudentList from "../components/StudentList";
import ReplayList from "../components/ReplayList";

import { Modal } from "antd-mobile";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Utils } from "@/common/Utils";
import Icon from "@/components/Icon";
import { useTranslation } from "react-i18next";
import Share from "../components/Share";


const Action = observer(
  (props: {
    courseInfo: any;
    onRegisterCourse?: (newCourse: IMyRegister) => void;
  }) => {
    const store = useStore();
    let currentUser = store.user.currentUser;
    let myRegisters = store.myRegisters.myRegisters || [];
    const openLoginDialog = () => {
      store.login.setLoginDialogVisible(true);
    };
    const { t } = useTranslation()

    if (currentUser?.phone) {

      const registerCourse = find(
        myRegisters,
        (course) => course.courseId == props.courseInfo.courseId
      );


      return !!registerCourse ? (
        <button
          className="btn"
          onClick={() => {
            let { verify } = registerCourse;
            [verify_rules.ALL_RIGNHT, verify_rules.ONLY_ROOM].includes(verify)
              ? Utils.course.enterCourse(props.courseInfo, myRegisters)
              : Modal.alert({
                content: t('course.verify.disable_enter_class'),
                closeOnMaskClick: true,
              });
          }}
        >
          {t('register.action.enter_class')}
        </button>
      ) : (
        <RegisterModal {...props} /> //报名
      );
    }
    return (
      <button className="btn" onClick={openLoginDialog}>
        {t('login.login_form.submit')}
      </button>
    );
  }
);
const CourseDetail = ({ data }: { data: ICourse }) => {
  const [courseInfo, setCourseInfo] = useState<any>({ ...data });
  const [students, setStudents] = useState<any[]>([]);
  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();
  const detailRef = useRef<
    Partial<{
      applyStudents: any[];
      // applyMember: any[]
      teacher: any;
      if_teacher: boolean;
      replayList: any[];
      validReplayList: any[];
    }>
  >({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = async () => {
    const studentResult = data.students;
    const studentCategories = groupBy(studentResult, "status");
    const teacher = studentCategories[EStudentType.TEACHER] || [];
    const tutors = studentCategories[EStudentType.TUTOR] || [];
    const admins = studentCategories[EStudentType.ADMIN] || [];
    let students: any[] = [];
    keys(studentCategories)
      .filter(
        (key) =>
          ![
            EStudentType.TEACHER,
            EStudentType.TUTOR,
            EStudentType.ADMIN,
          ].includes(key as EStudentType)
      )
      .forEach((key) => {
        students = students.concat(studentCategories[key]);
      });

    detailRef.current.applyStudents = students; // 排除 老师，助教，管理员, 剩下的才认为是学生
    detailRef.current.teacher = last(teacher);
    const allStudents = teacher.concat(tutors, admins, students);
    setStudents(allStudents);
    detailRef.current.if_teacher = !detailRef.current.teacher;

    // 课程回放数据
    const courseResult = data.replayList;
    detailRef.current.replayList = courseResult;
    detailRef.current.validReplayList = sortBy(
      courseResult?.filter(({ status }: any) => status == 1) || [],
      (c) => c.startAt
    );
  };
  useEffect(() => {
    loadData();
  }, []);

  const { t } = useTranslation()

  const tabs = [
    {
      key: "intro",
      title: t('course.tabs.introduction'),
      content:
        courseInfo.introduction ? <div className="ql-snow ql-editor" dangerouslySetInnerHTML={{ __html: courseInfo.introduction }} /> : <Loading className="course-loading" />
    },
    {
      key: "student",
      title: `${t('course.tabs.registered_members')}(${students.length || 0})`,
      content: <StudentList data={students} setData={setStudents} isMobile={isMobile} />,
    },
    {
      key: "replay",
      title: `${t('course.tabs.classroom_replay')}(${detailRef.current.validReplayList?.length || 0})`,
      content: <ReplayList isMobile={isMobile} data={detailRef.current.validReplayList || []} course={courseInfo} />,
    },
  ];
  const handleRegister = (newCourse: any) => {
    setStudents((students || []).concat(newCourse));
    detailRef.current.applyStudents = (
      detailRef.current.applyStudents || []
    ).concat(newCourse);
  };

  return (
    <div className="course-detail-wrapper">

      <section className="main-content">
        <img src={courseInfo.coverUrl} alt="coverUrl" className="course-cover" />
        <div className="course-main-info">
          {isMobile ? (
            <>
              <div className="course-title">{courseInfo.title}</div>
              <div className="course-info">
                <div className="course-info-item">
                  <span className="course-info-item-label">{t('course.info.teacher')}: </span>
                  {courseInfo.teacher && courseInfo.teacher.trim() ? courseInfo.teacher : detailRef.current.teacher?.name}
                </div>
                <div style={{ display: 'flex' }}>
                  <div className="course-info-item">
                    <span className="course-info-item-label">{t('course.info.student_number')}: </span>
                    {detailRef.current.applyStudents?.length}
                  </div>
                  <span className="course-actions">
                    <span className="course-price">{"¥ " + courseInfo.price}</span>
                    <Popover
                      placement="leftTop"
                      content={<Share courseInfo={courseInfo} isMobile />}
                      trigger="click"
                    >
                      <span className="share-icon">
                        <Icon symbol="icon-share" />
                      </span>
                    </Popover>
                  </span>
                </div>

              </div>
              <Action
                courseInfo={courseInfo}
                onRegisterCourse={handleRegister}
              />
            </>
          ) : (
            <>
              <div className="course-title">{courseInfo.title}</div>
              <div className="course-info">
                <div className="course-info-item">
                  <span className="course-info-item-label">{t('course.info.teacher')}: </span>
                  {courseInfo.teacher && courseInfo.teacher.trim() ? courseInfo.teacher : detailRef.current.teacher?.name}
                </div>
                <div className="course-info-item">
                  <span className="course-info-item-label">{t('course.info.student_number')}: </span>
                  {detailRef.current.applyStudents?.length}
                </div>
              </div>
              <div className="course-actions">
                <div className="course-price"> {"¥ " + courseInfo.price}</div>
                <Action
                  courseInfo={courseInfo}
                  onRegisterCourse={handleRegister}
                />
              </div>
              <div className="share-area">
                <Share courseInfo={courseInfo} />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="course-intro">
        <Tabs items={tabs} />
      </section>
    </div>
  );
};

export default CourseDetail;
