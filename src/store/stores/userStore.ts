import { ICurrentUser } from "@/api/types";

export interface UserStore {
    currentUser: ICurrentUser;
    // eslint-disable-next-line no-unused-vars
    setUserInfo: (value: ICurrentUser) => void;
    checkLogined: (value?: string) => void
}

const userStore = (): UserStore => {
    return {
        currentUser: {},
        setUserInfo: function (value) {
            this.currentUser = value;
        },
        checkLogined: () => { }
    };
};




export default userStore;