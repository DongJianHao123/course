import { useRouter } from "next/router";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { ETabs } from "@/pages";
import { useEffect } from "react";
import { AboutFilled, AboutOutLined, HomeFilled, HomeOutlined, UserFilled, UserOutLined, fillColor } from "@/components/Icon/svgs";
import { useTranslation } from "react-i18next";


const H5HomeWrap = ({
  isMobile
}: {
  isMobile?: boolean;
}) => {
  const router = useRouter();
  let store = useStore();
  const { homeTab} = store.homeTab;
  const currentUser = store.user.currentUser;
  const {t}=useTranslation()
  const backHome = (tab: string) => {
    if (location.pathname !== "/") {
      router.push("/")
    }
    store.homeTab.setHomeTab(tab);
  }
  useEffect(() => {
    if (location.pathname !== "/course/myCourse/" && location.pathname !== "/course/") {
      store.homeTab.setHomeTab("")
    }
  }, [location.pathname])

  const setLoginVisible = (visible: boolean) => {
    store.login.setLoginDialogVisible(visible);
  };


  return (
    <header className="main-header">
      <div className="header-content content">
        <a
          onClick={() => {
            backHome(ETabs.INDEX);
          }}
          className={homeTab === ETabs.INDEX ? "active" : ""}
        >
          {homeTab === ETabs.INDEX ? <HomeFilled /> : <HomeOutlined />}
          <span style={homeTab === ETabs.INDEX ? { color: fillColor } : {}}>{t('home_page.homewrap_h5.home')}</span>
        </a>
        <a
          onClick={() => {
            backHome(ETabs.ABOUT);
          }}
        >
          {homeTab === ETabs.ABOUT ? <AboutFilled /> : <AboutOutLined />}
          <span style={homeTab === ETabs.ABOUT ? { color: fillColor } : {}}>{t('home_page.homewrap_h5.about')}</span>
        </a>
        <a
          onClick={() => {
            if (!currentUser?.phone) {
              setLoginVisible(true)
            } else {
              // store.homeTab.setHomeTab(ETabs.USER);
              router.push("/myCourse")
            }
          }}
        >
          {homeTab === ETabs.USER ? <UserFilled /> : <UserOutLined />}
          <span style={homeTab === ETabs.USER ? { color: fillColor } : {}}>{t('home_page.homewrap_h5.my')}</span>

        </a>

      </div>
    </header>
  );
};

export default observer(H5HomeWrap);
