"use client";
import "../styles/globals.css";
import { useDeviceDetect, useLogined, useLogout } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { IExtraProps } from "@os2edu/layout/dist/types";
import Layout, { MainContent } from "@os2edu/layout";
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
import "../components/HighlightText/index.scss";
import "../styles/myCourse.scss";
import { StoreProvider } from "@/store";
import { observer } from "mobx-react-lite";
import U from "@/common/U";
import { StoreInit } from "@/common/StoreInit";
import Footer from "@/Layout/Footer";
import { ConfigProvider, Spin } from "antd";
import { ClientContext } from "@/store/context/clientContext";
import { ETabs } from ".";
import zhCN from 'antd/lib/locale/zh_CN';
import H5HomeWrap from "@/Layout/H5HomeWrap";
import MyLayout from "@/Layout";



export default observer(App);

function App({ Component, pageProps }: any) {
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

  useEffect(() => {
    setLoading(false);
  }, [])

  const redirectToHome = (
    <div className="custom-course-nav">
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
      // dropMenu: [
      //   {
      //     key: "myCourse",
      //     title: "我的课程",
      //     onClick() {
      //       window.open(`/course/myCourse`, "_blank");
      //     },
      //   },
      //   {
      //     key: "logout",
      //     title: "退出登录",
      //     onClick() {
      //       logout();
      //     },
      //   },
      // ],
    };

  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider
        initialValue={initValue}
      >
        <ClientContext.Provider value={{
          clientInfo,
          isLogin,
          isMobile,
          setClientInfo,
          checkLogined,
          logout,
          user: _phone,
        }}>
          <Spin spinning={loading}>
            <StoreInit />
            <Layout
              headerProps={{
                homeURL: "https://os2edu.cn",
                extra,
              }}
              className={`container ${isMobile ? "container-mobile" : ""}`}
            >

              {isMobile ?
                <H5HomeWrap
                  isMobile={true}
                /> : <MyLayout />
              }
              <MainContent >
                <Component {...pageProps} />
              </MainContent>
              <Footer />
            </Layout>
          </Spin>
        </ClientContext.Provider>
      </StoreProvider >
    </ConfigProvider>
  );
}
