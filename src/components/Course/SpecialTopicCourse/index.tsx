import { EUserType, ICourse, IMyRegister } from "@/api/types";
import { useDeviceDetect } from "@/hooks";
import { find, groupBy, keys, last, sortBy } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Card } from "antd";
import { ArrowRightOutlined, RightOutlined, ShareAltOutlined } from "@ant-design/icons";
import StudentList from "../Details/StudentList";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import RegisterModal, { verify_rules } from "@/components/RegisterModal";
import { Utils } from "@/common/Utils";
import { Modal } from "antd-mobile";
import { Share } from "../Details";
import pcStyles from "./index.module.scss";
import h5Styles from "./h5.module.scss";
import ReplayList from "../Details/ReplayList";
import { useTranslation } from "react-i18next";


const AVATAR_COLOR = ["#1677FF", "#129C2B", "#FF7E16"]

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

        const md = useDeviceDetect();
        const isMobile = !!md?.mobile();
        const styles = isMobile ? h5Styles : pcStyles;

        if (currentUser?.phone) {

            const registerCourse = find(
                myRegisters,
                (course) => course.courseId == props.courseInfo.courseId
            );

            return !!registerCourse ? (
                <button
                    className={styles["join-btn"]}
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
                <RegisterModal isSpecial styles={styles} {...props} /> //报名
            );
        }
        return (
            <button className={styles["join-btn"]} onClick={openLoginDialog}>
                {t('login.login_form.submit')}
            </button>
        );
    }
);

const SpecialTopicCourse = ({ data }: { data: ICourse }) => {
    const [courseInfo, setCourseInfo] = useState<any>({ ...data });
    const [students, setStudents] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<string>("1");
    const [pageHight, setPageHight] = useState<number>(0)
    const [sharedVisiable, setSharedVisiable] = useState<boolean>(true)

    const store = useStore();

    let myRegisters = store.myRegisters.myRegisters;
    const registerCourse = find(myRegisters, (course) => course.courseId === courseInfo.courseId);

    // const videosRef: RefObject<HTMLVideoElement>[] = []

    const containerRef = useRef<HTMLDivElement>(null);

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

    const md = useDeviceDetect();
    const isMobile = !!md?.mobile();
    const styles = isMobile ? h5Styles : pcStyles;

    const onMaskClick = () => {
        if (store.user.currentUser?.phone) {
            if (registerCourse) {
                let { verify } = registerCourse;
                if (![verify_rules.ALL_RIGNHT, verify_rules.ONLY_PLAYBACK].includes(verify)) {
                    Modal.alert({
                        content: "报名信息审核通过即可观看",
                        closeOnMaskClick: true,
                    })
                }
            } else {
                Modal.alert({
                    content: "请报名后观看",
                    closeOnMaskClick: true,
                });
            }
        } else {
            store.login.setLoginDialogVisible(true);
        }
    }

    const hasMask = !store.user.currentUser?.phone || !registerCourse || ![verify_rules.ALL_RIGNHT, verify_rules.ONLY_PLAYBACK].includes(registerCourse.verify)

    const handleRegister = (newCourse: any) => {
        setStudents((students || []).concat(newCourse));
        detailRef.current.applyStudents = (
            detailRef.current.applyStudents || []
        ).concat(newCourse);
    };

    const loadData = useCallback(async () => {
        const studentResult = data.students;
        const studentCategories = groupBy(studentResult, "status");
        const teacher = studentCategories[EUserType.TEACHER] || [];
        const tutors = studentCategories[EUserType.TUTOR] || [];
        const admins = studentCategories[EUserType.ADMIN] || [];
        let students: any[] = [];
        keys(studentCategories)
            .filter(
                (key) =>
                    ![
                        EUserType.TEACHER,
                        EUserType.TUTOR,
                        EUserType.ADMIN,
                    ].includes(key as EUserType)
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
    }, []);

    const resetHeight = (pageHeight?: number) => {
        const containerHight = containerRef.current?.clientHeight || 0;
        setPageHight(pageHeight ?? containerHight)
    }


    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        resetHeight();
    })
    useEffect(() => {
        setSharedVisiable(!isMobile)
    }, [isMobile])

    const { t } = useTranslation()

    const replayList_1 = detailRef.current.validReplayList?.filter((item) => item.type === 1) || []//导学课程
    const replayList_2 = detailRef.current.validReplayList?.filter((item) => item.type === 2) || []//直播课程

    const Tabs = [{
        value: "1",
        label: t('course.tabs.introduction'),
        children: <div className={styles["courses-container"]}>
            <div className="ql-snow ql-editor" style={{ height: "auto" }} dangerouslySetInnerHTML={{ __html: courseInfo.introduction }} />
            <div className={styles['clearfix']}></div>
            {replayList_1 && replayList_1.length > 0 && <div className={styles["video-wrap"]}>
                <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "550", padding: "10px 20px", borderRadius: "10px", marginTop: "-30px", background: "linear-gradient(to right, #63ce10, #3db477)", color: "white" }}>{t('course.tabs.guidance_course')}</h2>
                <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "550" }}>{t('course.tabs.guidance_course_desc')}</h2>
                <ul className={styles["video-ul"]}>
                    {replayList_1.map((item, index) => <li key={index}>
                        <p className={styles["title"]}>{item.className}</p>
                        <div className={styles["view-box"]}>
                            <video
                                src={item.choseUrl}
                                controls
                                playsInline
                                id="replay-video"
                                className={`video-js vjs-big-play-centered ${styles["video"]}`}
                                preload="auto"
                                poster={item.coverUrl ?? ''}
                            />
                            {hasMask && <div onClick={onMaskClick} className={styles["video-mask"]}></div>}
                        </div>
                    </li>
                    )}
                </ul>
            </div>
            }
        </div >
    },
    {
        value: "2",
        label: `${t('course.tabs.registered_members')}(${students.length})`,
        children: <StudentList pageChange={resetHeight} isMobile={isMobile} data={students} />
    },
    {
        value: "3",
        label: `${t('course.tabs.classroom_replay')}(${replayList_2.length})`,
        children: <ReplayList isMobile={isMobile} data={replayList_2} course={courseInfo} />
    }
    ]


    return <>
        <div ref={containerRef} className={styles["special-topic-course"]}>
            <div className={styles["course-info"]}>
                <div className={styles["info-container"]}>
                    <div className={styles["left"]}>
                        {/* <Tag>2023/8 第一期</Tag> */}
                        <div className={styles["course-title"]}>{courseInfo.title}</div>
                        <ul className={styles["light-point"]}>
                            {
                                courseInfo.summary.split(";").map((text: string, index: number) => {
                                    return <li key={index}><RightOutlined />{text}</li>
                                })
                            }
                        </ul>
                        {courseInfo.teacher && <div className={styles["teacher-wrap"]}>
                            <Avatar.Group>
                                {
                                    courseInfo.teacher.split('、').map((name: string, index: number) => {
                                        return <Avatar key={name} style={{ backgroundColor: AVATAR_COLOR[index % 3] }}>{name[0]}</Avatar>
                                    })
                                }
                            </Avatar.Group>
                            <div>
                                <span className={styles['course-info-item-label']} >{t('course.info.instructor')}: </span>
                                {courseInfo.teacher && courseInfo.teacher.trim() ? courseInfo.teacher : detailRef.current.teacher?.name}
                            </div>
                        </div>}

                        <Action courseInfo={courseInfo} onRegisterCourse={handleRegister} />
                    </div>
                    <div className={styles["right"]}>
                        <img
                            src={courseInfo.coverUrl}
                            alt="coverUrl"
                            className="course-cover"
                        />
                    </div>
                </div>
            </div>
            <div className={styles["tabs"]}>
                {Tabs.map(({ value, label }) => {
                    return <a key={value} className={currentTab === value ? styles["tab-action"] : styles["tab"]} onClick={() => setCurrentTab(value)}>{label}</a>
                })}
            </div>
            <div className={styles["tab-container"]}>
                <div className={styles["tab-content"]}>
                    {
                        Tabs.find((item) => item.value === currentTab)?.children
                    }

                </div>
            </div>
            {
                sharedVisiable ?
                    <div className={styles["shared-open"]}>
                        <Card title={<div style={{ textAlign: "center" }}>{t('course.share.title')}</div>} extra={<ArrowRightOutlined onClick={() => setSharedVisiable(false)} />}>
                            <Share courseInfo={courseInfo} isMobile={false} />
                        </Card>
                    </div>
                    :
                    <div className={styles["shared-close"]} onClick={() => setSharedVisiable(true)} >
                        <ShareAltOutlined />
                        <span>{t('course.share.title')}</span>
                    </div>
            }

        </div >
        {!isMobile && <div style={{ height: `${pageHight - 50}px`, position: "relative", zIndex: -1, transform: "all 3s" }}></div>}
    </>
}

export default observer(SpecialTopicCourse) 