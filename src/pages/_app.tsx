"use client";
import "../styles/globals.css";
import { useDeviceDetect, useLogined, useLogout } from "@/hooks";
import { useEffect, useState } from "react";
import Layout, { MainContent } from "@os2edu/layout";
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
import i18n, { languages } from '@/i18n'
import enUS from "antd/lib/locale/en_US";
import SwitchLanguage from "@/components/SwitchLanguage";


export const i18nextLng = 'i18nextLng'

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


  const [language, setLanguage] = useState('zh_CN')
  const changeLanguage = (e: string) => {
    setLanguage(e)
    i18n.changeLanguage(e)
  }

  const initLanguage = () => {
    let search = location.search;
    const urlParams = U.url.search2Obj(search);
    let type: string = ''
    if (urlParams['locale'] && languages.includes(urlParams['locale'])) {
      type = urlParams['locale'];
      localStorage.setItem(i18nextLng, type)
    } else {
      type = localStorage.getItem(i18nextLng) || '';
    }
    if (type) {
      changeLanguage(type)
    }
  }

  useEffect(() => {
    setIsLogin(logined);
    setPhone(phone);
  }, [logined, phone]);

  useEffect(() => {
    initLanguage()
    setLoading(false);
  }, [])

  const checkLogined = (phone?: string) => {
    let value = U.str.isMobile(phone);
    setIsLogin(value);
    setPhone(value ? phone : "");
  };

  const logout = useLogout(checkLogined);

  const initValue = {
    currentUser: { phone },
    homeTab: ETabs.INDEX,
    checkLogined: checkLogined
  }

  return (
    <ConfigProvider locale={language === 'zh_CN' ? zhCN : enUS}>
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
          language,
          changeLanguage
        }}>
          <Spin spinning={loading}>
            <StoreInit />
            <Layout
              headerProps={{
                homeURL: "https://os2edu.cn",
                // extra,
              }}
              className={`container ${isMobile ? "container-mobile" : ""}`}
            >


              {isMobile &&
                <H5HomeWrap
                  isMobile={true}
                />
              }
              <MyLayout>
                <MainContent >
                  <Component {...pageProps} />
                </MainContent>
              </MyLayout>
              <Footer isMobile={isMobile} />
            </Layout>
            {isMobile&&<SwitchLanguage/>}
          </Spin>
        </ClientContext.Provider>
      </StoreProvider >
    </ConfigProvider>
  );
}
