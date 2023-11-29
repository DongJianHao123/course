/* eslint-disable @next/next/no-img-element */
import Loading from "../../../Loading";
import { useTranslation } from "react-i18next";
import { ICourse } from "@/api/types";
import { ActionType } from "@/constants";
import { FireOutlined } from "@ant-design/icons";
import { Utils } from "@/common/Utils";
import { useStore } from "@/store";
import { useClientContext } from "@/store/context";
import Link from "next/link";

import pcStyles from './index.module.scss';
import h5Styles from './h5.module.scss';
import QRCode from "../QRCode";


const LivingCourseList = ({ courses }: { courses: ICourse[] }) => {
    const { t } = useTranslation()
    const data = courses
    const { myRegisters } = useStore();
    const { isLogin, isMobile } = useClientContext();
    const styles = isMobile ? h5Styles : pcStyles
    if (!courses) {
        return <Loading />;
    }

    return (
        <ul className={styles['living-course-list']}>
            {data.map((item, index) => {
                const canEnterClassroom = isLogin && (myRegisters.myRegisters!.findIndex((register) => register.courseId === item.courseId) > -1)
                return <li key={index} className={styles['living-course-item']}>
                    <div className={styles["course-cover-wrap"]}>
                        <span className={styles["living-icon"]}>
                            {item.classStatus === ActionType.START_CLASS && t('course.status.living')}
                            {item.classStatus === ActionType.BOOK_CLASS && t('course.status.upcoming')}
                        </span>
                        <img className={styles["course-cover"]} src={item.coverUrl} alt="coverUrl" />
                    </div>
                    <div className={styles["course-info"]}>
                        <div className={styles['title']}>{item.title}</div>
                        <div className={styles['teacher']}>{t('course.info.instructor')}: {item.teacher}</div>
                        <div className={styles["student-num"]}>{t('course.info.student_number')}: {item.applyCount}</div>
                        <div className={styles["extra"]}>
                            {canEnterClassroom ?
                                <button className={styles['join-btn']} onClick={() => Utils.course.enterCourse(item, myRegisters.myRegisters!)}>{t('home_page.living.enter_classroom')}</button>
                                :
                                <Link target="_blank" href={`/${item.courseId}`}>
                                    <button className={styles['join-btn']}>{t('common.button.view_detail')}</button>
                                </Link>
                            }
                            {item.classStatus === ActionType.START_CLASS && <div className={styles["status-living"]}><FireOutlined /> {t('course.status.living')}</div>}
                            {item.classStatus === ActionType.BOOK_CLASS && <div className={styles["status-book"]}>{t('course.status.upcoming_time', { date: item.startAt })}</div>}
                        </div>
                    </div>
                    {!isMobile && <div className={styles['qrcode-wrap']}>
                        <div className={styles['item']}>
                            <QRCode fgColor="#3db477" value={location.href + `/${item.courseId}`} className={styles['qrcode']} />
                            <span>{t('course.qrcode.view_course')}</span>
                        </div>
                        {canEnterClassroom && <div className={styles['item']}>
                            <QRCode fgColor="#3db477" value={Utils.course.getClassroomUrl(item, myRegisters.myRegisters!)} className={styles['qrcode']} />
                            <span>{t('course.qrcode.enter_classroom')}</span>
                        </div>}
                    </div>}

                </li>
            })
            }
        </ul >
    );
};

export default LivingCourseList;
