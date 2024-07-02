import { Client, HomepageInfo, ICurrentUser } from "@/api/types";

export interface HomePageStore {
    homePage: HomepageInfo;
    // eslint-disable-next-line no-unused-vars
    setHomePage: (value: any) => void;

}

const homePageStore = (): HomePageStore => {
    return {
        homePage: {},
        setHomePage: function (value) {
            this.homePage = value;
        },
    };
};

export default homePageStore;