"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { last, groupBy, keys, sortBy, find } from "lodash";
import { Button, Popover } from "antd";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { EUserType as EStudentType, IMyRegister } from "../../../api/types";
import Tabs from "../../../components/Tabs";
import Loading from "../../../components/Loading";
import RegisterModal from "../../../components/RegisterModal";
import { useDeviceDetect } from "../../../hooks";
import { RoleNameMap, USER_INFO_STORAGE_KEY } from "../../../constants";
import { BASE_URL } from "@/utils/request";
import { getStudentOfCourse, getReplayOfCourse, getCourse } from "../../../api";
import StudentList from "./StudentList";
import ReplayList from "./ReplayList";

// import "./index.scss";
import { Modal } from "antd-mobile";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { Utils } from "@/common/Utils";
import Icon from "@/components/Icon";

const Share = observer((props: { courseInfo: any; isMobile?: boolean }) => {
  const store = useStore();
  let currentUser = store.user.currentUser;
  let myRegisters = store.myRegisters.myRegisters;
  const { id: courseId } = useParams<{ id: string }>();
  const shareAreaRef = useRef<HTMLImageElement>(null);
  const qrcodeRef = useRef<any>(null);
  const [pageLink, setPageLink] = useState("");

  let miniQRPath: string = "";
  if (currentUser?.phone) {
    const registerCourse = find(
      myRegisters,
      (course) => course.courseId === courseId
    );
    let path = "";
    if (!!registerCourse) {
      path = encodeURIComponent(
        `pages/room/room?userId=${registerCourse.phone}-m&roomId=${props.courseInfo.roomId
        }&role=${RoleNameMap[registerCourse.status] || "student"}&username=${registerCourse.name
        }-m`
      );
    } else {
      path = encodeURIComponent(
        `pages/index/index?roomId=${props.courseInfo.roomId}`
      );
    }
    miniQRPath = `${BASE_URL}/seller/api/room/path.jpg?path=${path}`;
  }

  useEffect(() => {
    if (qrcodeRef.current) {
      const svg = qrcodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      shareAreaRef.current!.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  }, [qrcodeRef.current]);
  useEffect(() => {
    setPageLink(location.href)
  }, [])

  return (
    <>
      <QRCode
        ref={qrcodeRef}
        style={{
          display: "none",
          height: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
        value={pageLink}
        fgColor="#3db477"
        viewBox={`0 0 256 256`}
      />
      <div className="share-box">
        <span>
          <Icon symbol="icon-share" />
          分享二维码
        </span>
        <span style={{ marginBottom: 10 }}>邀请好友加入课堂</span>
        <div
          className={`share-imgs ${props.isMobile ? "share-imgs-mobile" : ""}`}
        >
          <img ref={shareAreaRef} alt="share-course" className="qr-code" />
          {miniQRPath && <img src={miniQRPath} alt="mini" />}
        </div>
      </div>
    </>
  );
});
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
            verify === "1"
              ? Utils.course.enterCourse(props.courseInfo, myRegisters)
              : Modal.alert({
                content: "报名信息审核通过即可进入教室",
                closeOnMaskClick: true,
              });
          }}
        >
          已报名，进入教室
        </button>
      ) : (
        <RegisterModal {...props} /> //报名
      );
    }
    return (
      <button className="btn" onClick={openLoginDialog}>
        登录
      </button>
    );
  }
);
const CourseDetail = ({ data }: any) => {
  const [courseInfo, setCourseInfo] = useState<any>({ ...data });
  const [students, setStudents] = useState<any[]>([]);
  const md = useDeviceDetect();
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

  // const [loading, setLoading] = useState(true);
  //分步加载introduction,减小打包后静态页面的体积
  // const loadIntroduction = () => {
  //   getCourse(courseInfo.courseId, courseInfo.clientId).then((res) => {
  //     setCourseInfo({ ...courseInfo, introduction: res.introduction })
  //   });
  // }

  const loadData = useCallback(async () => {
    // if (courseId) {
    // const courseInfo = await getCourse(courseId);
    // 课程报名成员信息
    const studentResult = data.studentResult;
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
    const courseResult = data.courseResult;
    detailRef.current.replayList = courseResult;
    detailRef.current.validReplayList = sortBy(
      courseResult.filter(({ status }: any) => status == 1) || [],
      (c) => c.startAt
    );
    // loadIntroduction();
    // setLoading(false);
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);

  // if (loading) {
  //   return <Loading />;
  // }


  const tabs = [
    {
      key: "intro",
      title: "课程介绍",
      content:
        courseInfo.introduction ? <div className="ql-snow ql-editor" dangerouslySetInnerHTML={{ __html: courseInfo.introduction }} /> : <Loading className="course-loading" />
    },
    {
      key: "student",
      title: `报名成员(${students?.length || 0})`,
      content: <StudentList data={students} />,
    },
    {
      key: "replay",
      title: `课堂回放(${detailRef.current.validReplayList?.length || 0})`,
      content: <ReplayList data={detailRef.current.validReplayList} />,
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
        <img
          src={courseInfo.coverUrl}
          alt="coverUrl"
          className="course-cover"
        />

        <div className="course-main-info">
          {!!md?.mobile() ? (
            <>
              <div className="course-title">{courseInfo.title}</div>
              <div className="course-info">
                <div className="course-info-item">
                  <span className="course-info-item-label">任课教师: </span>
                  {detailRef.current.teacher?.name}
                </div>
                <div className="course-info-item">
                  <span className="course-info-item-label">学生人数: </span>
                  {detailRef.current.applyStudents?.length} 人
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
                  <span className="course-info-item-label">任课教师: </span>
                  {detailRef.current.teacher?.name}
                </div>
                <div className="course-info-item">
                  <span className="course-info-item-label">学生人数: </span>
                  {detailRef.current.applyStudents?.length} 人
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
