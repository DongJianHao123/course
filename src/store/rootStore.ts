import clientStore, { IClinetStore } from './stores/clientStore';
import homePageStore, { HomePageStore } from './stores/homePageStore';
import homeTabStore, { IHomeTab } from './stores/homeTab';
import loginStore, { Login } from './stores/loginStore';
import myRegistersStore, { MyRegisters } from './stores/myRegistersStore';
import userStore, { UserStore } from './stores/userStore';

export interface IStore {
    user: UserStore;
    client: IClinetStore;
    homeTab: IHomeTab;
    login: Login;
    myRegisters: MyRegisters;
    homePage: HomePageStore;
}

export default function createStore(initialValue: any): () => IStore {
    return () => {
        return {
            user: { ...userStore(), currentUser: initialValue.currentUser, checkLogined: initialValue.checkLogined }, // 这里的...initialValue会对userStore的一些默认key进行覆盖更新
            client: { ...clientStore(), client: initialValue?.client },
            homeTab: { ...homeTabStore(), homeTab: initialValue.homeTab },
            login: { ...loginStore(), loginDialogVisible: false },
            myRegisters: { ...myRegistersStore(), myRegisters: initialValue.myRegisters },
            homePage: { ...homePageStore(), homePage: initialValue.homePage }
        };
    };
}
