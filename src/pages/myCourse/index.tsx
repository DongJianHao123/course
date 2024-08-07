"use client";
import { getMyCourses } from "@/api";
import U from "@/common/U";
import { Utils } from "@/common/Utils";
import { ELayoutType, layoutPrifix } from "@/components/Course/components/CourseList";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import { USER_INFO_STORAGE_KEY, WEB_HOST } from "@/constants";
import { useDeviceDetect, useLogout } from "@/hooks";
import { useStore } from "@/store";
import { Empty } from "antd";
import { Button, Modal } from "antd-mobile";
import { map } from "lodash";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ETabs } from "..";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

function MyCourse() {
  const router = useRouter();
  const store = useStore();

  // const { myCourses, total } = props
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [layout, setLayout] = useState("");
  const myRegisters = store.myRegisters.myRegisters || [];
  const { t } = useTranslation()

  const logout = useLogout(
    () => {
      store.user.checkLogined()
      store.homeTab.setHomeTab(ETabs.INDEX)
    }
  );

  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();

  const loadMyCourses = async (phone: string) => {
    getMyCourses(phone, 0).then((res) => {
      const { courseList, totalNum } = res;
      if (courseList) {
        setMyCourses(courseList);
        setTotal(totalNum);
      }
      setLoading(false)
    });

  };
  useEffect(() => {
    setLoading(true)
    const _phone = localStorage.getItem(USER_INFO_STORAGE_KEY)
    if (!_phone) {
      store.homeTab.setHomeTab(ETabs.INDEX);
      router.push("/")
    } else {
      if (isMobile) {
        store.homeTab.setHomeTab(ETabs.USER);
      }

      loadMyCourses(_phone || "");
      setLayout(localStorage.getItem(layoutPrifix) || ELayoutType.LIST);
    }
  }, []);

  const isGrid = layout === ELayoutType.GRID;

  const changeLayout = () => {
    const layout = isGrid ? ELayoutType.LIST : ELayoutType.GRID;
    setLayout(layout);
    localStorage.setItem(layoutPrifix, layout);
  };


  return (
    <div>
      <div className="mycourse-list-wrapper">
        <Head>
          <title>{`我的课程 - ${WEB_HOST}`}</title>
        </Head>
        <header>
          <div className="title">{t('my_course.page.title')}</div>
          <div className="totol-register-count">
            {t('my_course.page.total_course')}  : <strong>{total}</strong>
          </div>
        </header>
        {loading ? <Loading /> : myCourses.length < 1 ? <Empty description={t('my_course.page.empty')} /> :
          <div
            className={`mycourse-list ${isGrid ? "mycourse-list-layout-grid" : "mycourse-list-layout-list"
              }`}
          >
            <span className="layout-icon" onClick={changeLayout}>
              <Icon symbol={isGrid ? 'icon-listgrid' : 'icon-list'} />
            </span>
            {map(myCourses, (course: any, index) => (
              <div
                key={course.id + course.courseIndex + course.title + index}
                className="course-item"
                onClick={() => window.open(`/course/${course.courseId}`, "_blank")}
              >
                <img
                  className="course-item-cover"
                  src={course.coverUrl}
                  alt="cover"
                />
                <div className="course-item-content">
                  <div>
                    <h3>{course.title}</h3>
                    <div className="summary">{course.summary}</div>
                  </div>
                  <div className="room">
                    <span>{t('my_course.course.room_id')}: {course.roomId} </span>
                    <button
                      className="btn enter-class-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        Utils.course.enterCourse(course, myRegisters);
                      }}
                    >
                    {isMobile?t('my_course.course.enter_classroom_h5'):t('my_course.course.enter_classroom')}  
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        <div className="clearfix"></div>
      </div>

      {
        isMobile && !loading &&
        <Button className="loginout-btn" size="small" color="danger" onClick={() => {
          // store.homeTab.setHomeTab(ETabs.INDEX)
          logout();
        }}>{t('my_course.course.loginout')}</Button>
      }
    </div>
  );
}

export default observer(MyCourse)