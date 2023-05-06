
export interface IHomeTab {
    homeTab: string;
    // eslint-disable-next-line no-unused-vars
    setHomeTab: (value: string) => void;
}

const homeTabStore = (): IHomeTab => {
    return {
        homeTab: "",
        setHomeTab: function (value) {
            this.homeTab = value;
        },
    };
};

export default homeTabStore;