"use client";
import "../styles/globals.css";
import { useDeviceDetect, useLogined, useLogout } from "@/hooks";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import type { IExtraProps } from "@os2edu/layout/dist/types";
import Layout, { MainContent } from "@os2edu/layout";
import Header from "@/Layout/Header";
import Link from "next/link";
import LoginStatus from "@/Layout/LoginStatus";
import "../Layout/index.scss";
import "../styles/TeacharList.scss";
import "../styles/StudentList.scss";
import "../styles/Course.scss";
import "../styles/Loading.scss";
import "../styles/HomePage.scss";
import "../styles/Courses.scss";
import "../Layout/index-mobile.scss";
import "../components/Tabs/index.scss";
import "../components/Tabs/index-mobile.scss";
import "../components/HighlightText/index.scss"
import "../components/Course/Replay/index.scss"
import "../styles/myCourse.scss";
import "../components/VideoReplayer/index.scss"
import { StoreProvider, useStore } from "@/store";
import { observer } from "mobx-react-lite";
import U from "@/common/U";
import { StoreInit } from "@/common/StoreInit";
import { sendUrlToBing } from "@/api";
import { Utils } from "@/common/Utils";
import { GetServerSideProps, NextPageContext } from "next";
import useHostClient from "@/hooks/useHost";
import Footer from "@/Layout/Footer";
import { Spin } from "antd";
import { ClientContext } from "@/store/context/clientContext";
import { title } from "process";
import { ETabs } from ".";



export default observer(App);

function App({ Component, pageProps }: any) {


  const router = useRouter();

  const needPhone = true;
  let [logined, phone = ""] = useLogined(needPhone);

  const [isLogin, setIsLogin] = useState<boolean>();
  const [_phone, setPhone] = useState<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [clientInfo, setClientInfo] = useState<any>();

  const md = useDeviceDetect();
  const isMobile = !!md?.mobile();

  useEffect(() => {
    setIsLogin(logined);
    setPhone(phone);
  }, [logined, phone]);

  const { client } = useHostClient();

  useEffect(() => {
    setLoading(false);
  }, [])

  const redirectToHome = (
    <div className="custom-course-nav" onClick={() => {
      //sendUrlToBing()
    }}>
      {client && client.clientId === "466" && <Link className="nav-common-link nav-link" target="_blank" href="https://www.loongson.cn/">龙芯中科官网</Link>}
      {client && client.clientId === "476" && <Link className="nav-common-link nav-link" target="_blank" href="http://www.china-icv.cn/">国家智能网联汽车创新中心</Link>}


      <Link className="nav-common-link nav-link" href="/">
        课程培训
      </Link>
    </div>
  );


  const checkLogined = (phone?: string) => {
    let value = U.str.isChinaMobile(phone);
    setIsLogin(value);
    setPhone(value ? phone : "");
  };

  const logout = useLogout(checkLogined);

  const initValue = {
    currentUser: { phone },
    homeTab: ETabs.INDEX,
    checkLogined: checkLogined
  }

  let extra: Partial<IExtraProps> = !isLogin
    ? {
      customRender: (
        <>
          {redirectToHome}
          <LoginStatus />
        </>
      ),
    }
    : {
      customRender: redirectToHome,
      userInfo: { phone: _phone },
      dropMenu: [
        {
          key: "myCourse",
          title: "我的课程",
          onClick() {
            router.push(`/myCourse`);
          },
        },
        {
          key: "logout",
          title: "退出登录",
          onClick() {
            logout();
          },
        },
      ],
    };

  const getLayoutInfo = () => {
    return {
      title: clientInfo ? (clientInfo.clientId === "450" || clientInfo.clientId === "481") ? "阿图教育" : clientInfo.clientId === "466" ? "龙芯直播课堂" : clientInfo.name : " ",
      logo: clientInfo ? (clientInfo.clientId === "450" || clientInfo.clientId === "481") ? "https://ssl.cdn.maodouketang.com/Fi65zYOF9bcEIjo5ZYDrKuosUSiE" : clientInfo.consultUrl : "/logo.png",
    }
  }
  return (
    <StoreProvider
      initialValue={initValue}
    >
      <ClientContext.Provider value={{
        clientInfo,
        setClientInfo: setClientInfo,
        checkLogined: checkLogined
      }}>
        <Spin spinning={loading}>
          <StoreInit />
          <Layout
            headerProps={{
              title: getLayoutInfo().title,
              logo: getLayoutInfo().logo,
              homeURL: getLayoutInfo().title === "阿图教育" ? "https://r2edu.cn" : "/",
              extra,
            }}
            className={`container ${isMobile ? "container-mobile" : ""}`}
          >
            {isMobile && (
              <Header
                isMobile={true}
              />
            )}
            <MainContent >
              <Component {...pageProps} />
            </MainContent>
            <Footer />
          </Layout>
        </Spin>
      </ClientContext.Provider>
    </StoreProvider >
  );
}
