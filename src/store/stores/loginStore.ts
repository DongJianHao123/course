
export interface Login{
    loginDialogVisible:boolean    // eslint-disable-next-line no-unused-vars
    setLoginDialogVisible: (value: boolean) => void;
}

const loginStore = (): Login => {
    return {
        loginDialogVisible: false,
        setLoginDialogVisible: function (value) {
            this.loginDialogVisible = value;
        },
    };
};

export default loginStore;