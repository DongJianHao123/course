'use client'
import CourseList from "@/components/Course";
import TeacharList from "@/components/Teacher/TeacherList";
import { useStore } from "@/store";
import Head from "next/head";
// import styles from "@/styles/Home.module.css";
import { observer } from "mobx-react-lite";
import { fetchClient, getCourses, getHomePage } from "@/api";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useContext, useEffect } from "react";
import { ClientContext } from "@/store/context/clientContext";
import { useDeviceDetect } from "@/hooks";
import { WEB_HOST } from "@/constants";
export enum ETabs {
  INDEX = "INDEX",
  COURSE = "COURSE",
  TEACHAR = "TEACHAR",
  ABOUT = "ABOUT",
  USER = "USER"
}

const nav = [
  {
    key: ETabs.INDEX,
    title: "主页",
  },
  {
    key: ETabs.COURSE,
    title: "课程",
  },
  {
    key: ETabs.TEACHAR,
    title: "老师",
  },
  {
    key: ETabs.ABOUT,
    title: "关于我们",
  },
];



const setTabClassName = (show: boolean) => {
  return show ? "tab-show" : "";
};

export const getStaticProps: GetStaticProps = async (context) => {
  const client = await fetchClient()
  const res_popular = await getCourses(true)
  const res_all = await getCourses(false);
  const config = await getHomePage();
  // const data = await res.json()

  const courseFilter = (courses: any[]) => {
    courses.map((item: any, index) => {
      courses[index].introduction = "";
      courses[index].courseClasss = [];
    })
  }
  let courses_popular = res_popular.courseList;
  let courses_all = res_all.courseList;
  //删除首页课程的introduction

  courseFilter(courses_all);
  courseFilter(courses_popular);


  return {
    props: {
      data: {
        courses_popular,
        courses_all,
        client,
        config
      }
    },
    revalidate: 10
  }

}

function Home({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  const store = useStore();
  const { courses_all, courses_popular, client, config } = data;
  const clientContext: any = useContext(ClientContext);
  useEffect(() => {
    clientContext.setClientInfo({ ...client, ...config });
  }, [])
  const tabChange = (value: string) => {
    store.homeTab.setHomeTab(value);
  };

  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();

  let homeTab = store.homeTab.homeTab;

  const isIndexTab = homeTab === ETabs.INDEX;
  const renderMainContent = () => {
    return (
      <>
        <section
          className={setTabClassName(
            homeTab === ETabs.INDEX || homeTab === ETabs.COURSE
          )}
        >
          <div className="title">{isIndexTab ? "热门课程" : "全部课程"}</div>
          <CourseList courses={homeTab === ETabs.COURSE ? courses_all : courses_popular} />
        </section>
        <section
          className={setTabClassName(
            homeTab === ETabs.INDEX || homeTab === ETabs.TEACHAR
          )}
        >
          <div className="title">{isIndexTab ? "推荐名师" : "全部名师"}</div>
          <TeacharList showAll={homeTab === ETabs.TEACHAR} />
        </section>
      </>
    );
  };
  const getHeader = () => {
    let { name } = client;
    let { consultUrl, icpInfo, host } = config;

    let clientInfo = {
      title: client.name,
      logo: consultUrl,
      icpInfo: icpInfo,
      icon: client.clientId === "476" ? "https://ssl.cdn.maodouketang.com/Fm9dsYviD7mb2JJ9isIvTcyKn5zf" : consultUrl,
      desc: `${client.name},${icpInfo}`,
      webTitle: `${name} - ${host || WEB_HOST}`,
      keyWords: `${name}`
    }

    return <>
      <title>{clientInfo.webTitle}</title>
      <meta name="description" content={clientInfo.desc} />
      <meta name="keywords" content={`${clientInfo.keyWords},培训,计算机,科技,技术,edu`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={client ? clientInfo.icon : "/logo.png"} />
    </>
  }

  return (
    <>
      <Head>
        {client && getHeader()}
      </Head>
      <div className="home-wrapper">
        <h1 style={{ display: "none" }}>{client.name}</h1>
        <header className="home-wrapper-header">
          <img
            className="intro-cover"
            src={config.coverUrl}
            alt="site-cover"
          />
          {!isMobile && <img
            className="logo-mark"
            src={config.consultUrl}
            alt="logo-mark"
          />}
          {isMobile && <div className="index-head-client">
            <img
              className="logo-mark-mobile"
              src={config.consultUrl}
              alt="logo-mark"
            />
            <div className="head-right">
              <div className="name">{client.name}</div>
              <div className="info">{config.icpInfo}</div>
            </div>
          </div>}
          <ul className="nav">
            {nav.map((item) => (
              <li
                className={`${item.key === homeTab ? "active" : ""}`}
                key={item.key}
                onClick={() => {
                  tabChange(item.key);
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </header>

        <main className="home-wrapper-content">
          {renderMainContent()}
          <section
            className={setTabClassName(isIndexTab || homeTab === ETabs.ABOUT)}
          >
            <div className="title">机构介绍</div>
            <div className="organize">
              <div className="intro">{config.aboutUsInfo}</div>
              <img
                src={config.aboutUsImgUrl}
                alt="organize-logo"
                className="organize-logo"
              />
            </div>
          </section>
        </main>
      </div>
      {/* } */}
    </>
  );
}



// Home.getInitialProps = async (context: NextPageContext) => {

//   const client = await fetchClient()
//   const res_popular = await getCourses(true)
//   const res_all = await getCourses(false);
//   const config = await getHomePage();
//   // const data = await res.json()

//   const courseFilter = (courses: any[]) => {
//     courses.map((item: any, index) => {
//       courses[index].introduction = "";
//       courses[index].courseClasss = [];
//     })
//   }
//   let courses_popular = res_popular.courseList;
//   let courses_all = res_all.courseList;
//   //删除首页课程的introduction

//   courseFilter(courses_all);
//   courseFilter(courses_popular);


//   return {
//     data: {
//       courses_popular,
//       courses_all,
//       client,
//       config
//     }
//   }
// }


// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { req } = context
//   let host = req?.headers.host;
//   const clientId = (await Utils.client.getClientByHost(host)).clientId
//   const client = await fetchClient(clientId)
//   const res_popular = await getCourses(true, clientId)
//   const res_all = await getCourses(false, clientId);
//   const config = await getHomePage(clientId);
//   // const data = await res.json()

//   const courseFilter = (courses: any[]) => {
//     courses.map((item: any, index) => {
//       courses[index].introduction = ""
//     })
//   }
//   let courses_popular = res_popular.courseList;
//   let courses_all = res_all.courseList;
//   //删除首页课程的introduction

//   courseFilter(courses_all);
//   courseFilter(courses_popular);


//   return {
//     props: {
//       data: {
//         courses_popular,
//         courses_all,
//         client,
//         config
//       }
//     }
//   }

// }

export default observer(Home);
