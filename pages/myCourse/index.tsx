"use client";

import { getMyCourses } from "@/api";
import U from "@/common/U";
import { Utils } from "@/common/Utils";
import { ELayoutType, layoutPrifix } from "@/components/Course";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import { USER_INFO_STORAGE_KEY } from "@/constants";
import { useDeviceDetect, useLogout } from "@/hooks";
import { useStore } from "@/store";
import { Empty } from "antd";
import { Button, Modal } from "antd-mobile";
import { map } from "lodash";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { ETabs } from "..";
import { observer } from "mobx-react-lite";

// export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
//   let host = req?.headers.host || "localhost";
//   const client = Utils.client.getClientByHost(host)
//   console.log("client");
//   console.log(client);

//   const res = await getMyCourses(U.str.deciphering(query.user), 0, client.clientId)
//   const { courseList, totalNum } = res
//   return {
//     props: {
//       myCourses: courseList,
//       total: totalNum,
//       client, // will be passed to the page component as props
//     }
//   };
// }

function MyCourse() {
  const router = useRouter();
  const store = useStore();

  // const { myCourses, total } = props
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [layout, setLayout] = useState("");
  const myRegisters = store.myRegisters.myRegisters || [];

  const logout = useLogout(
    () => {
      store.user.checkLogined()
      store.homeTab.setHomeTab(ETabs.INDEX)
    }
  );


  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();

  const loadMyCourses = async (phone: string) => {
    const client = await Utils.client.localClient();
    getMyCourses(phone, 0, client.clientId).then((res) => {
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
          <title>我的课程</title>
        </Head>
        <header>
          <div className="title">我的课程</div>
          <div className="totol-register-count">
            共报名课程: <strong>{total}</strong>
          </div>
        </header>
        {loading ? <Loading /> : myCourses.length < 1 ? <Empty description={"您暂未报名任何课程"} /> : ""}
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
              onClick={() => router.push(`/course/${course.courseId}`)}
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
                  <span> 教室号: {course.roomId} </span>
                  <button
                    className="btn enter-class-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      Utils.course.enterCourse(course, myRegisters);
                    }}
                  >
                    进入课堂
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="clearfix"></div>
      </div>

      {
        isMobile && !loading &&
        <Button className="loginout-btn" size="small" color="danger" onClick={() => {
          // store.homeTab.setHomeTab(ETabs.INDEX)
          logout();
        }}>退出登录</Button>
      }
    </div>
  );
}

export default observer(MyCourse)
// export async function getStaticProps({ params }: any) {
//   console.log("加载app");
//   console.log(params);


//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }