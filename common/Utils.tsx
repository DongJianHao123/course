import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { useStore } from "@/store";
import { RoleNameMap, USER_INFO_STORAGE_KEY } from "@/constants";
import { EUserType, IMyRegister } from "@/api/types";
import { find } from "lodash";
import { fetchClient, getDomainNameConfiguration } from "@/api";

const roomUrls = [
  { index: 1, url: "https://room.rustedu.com/" },
  { index: 2, url: "https://room.loongsonedu.cn/" },
  { index: 3, url: "http://room.cicvedu.com/" },
]

const roomUrlsByClientId = [
  { clientId: 476, index: 3 }, //cicv
  { clientId: 466, index: 2 }, //loongson
  { clientId: 450, index: 1 }, //rust
]


export const Utils = {
  common: {
    renderReactDOM: (child: any, options = {}) => {
      const div = document.createElement("div");
      const { id }: any = options;
      if (id) {
        const e = document.getElementById(id);
        if (e) {
          document.body.removeChild(e);
        }
        div.setAttribute("id", id);
      }

      document.body.appendChild(div);

      ReactDOM.render(
        <ConfigProvider locale={zhCN}>{child}</ConfigProvider>,
        div
      );
    },

    closeModalContainer: (id: string) => {
      const e = document.getElementById(id);
      if (e) {
        document.body.removeChild(e);
      }
    },

    createModalContainer: (id: string) => {
      //强制清理同名div，render会重复创建modal
      Utils.common.closeModalContainer(id);
      const div = document.createElement("div");
      div.setAttribute("id", id);
      document.body.appendChild(div);
      return div;
    },
  },
  storage: {
    set: (key: string, value: any) => {
      // 执行监听的操作
      return localStorage.setItem(`${key}`, value);
    },
    get: (key: string) => {
      // 执行监听的操作
      return localStorage.getItem(`${key}`);
    },
    del: (key: string) => {
      3;
      // 执行监听的操作
      return localStorage.removeItem(`${key}`);
    },
    clear: () => {
      // 执行监听的操作
      localStorage.clear();
    },
    setUsr: (phone: string) => {
      useStore().user.setUserInfo({ phone });
      localStorage.setItem(USER_INFO_STORAGE_KEY, phone);
    },
    getUsr: () => {
      return localStorage.getItem(USER_INFO_STORAGE_KEY);
    },
    delUsr: () => {
      useStore().user.setUserInfo({});
      Utils.storage.del(USER_INFO_STORAGE_KEY);
    },
  },
  course: {
    enterCourse: (course: any, myRegisters: IMyRegister[]) => {
      const register = find(
        myRegisters,
        (register) => register.courseId === course.courseId
      );
      if (!!register) {
        const status: EUserType = register?.status;
        const urlIndex = roomUrlsByClientId.find((item) => item.clientId === parseInt(course.clientId))?.index;
        const baseUrl = roomUrls.find((item) => item.index === urlIndex)?.url;
        const url = `${baseUrl || "https://room.rustedu.com/"}?username=${register?.name}&userId=${register.phone
          }&role=${RoleNameMap[status] || 'student'}&roomId=${course.roomId}&video=${course.ishd || '480'}p&title=${course.title}`
        window.open(url)
      }
    },
  },
  client: {
    getClientByHost: async (host?: string) => {
      host = host ? host : location.host;
      let clientName = host.indexOf('localhost' || '127.0.0.1') > -1 ? 'vueedu' : host.split('.')[0];
      console.log(clientName);
      const configs = (await getDomainNameConfiguration());
      let client = configs.find((item: any) => item.host === clientName) || { host: "cicvedu", clientId: 476, name: "车用操作系统开发培训" }
      return client
    },

    localClient: async (host?: string) => {
      const storage_name = "CLIENT"
      let client = JSON.parse(localStorage.getItem(storage_name) || "{}");
      if (!client.clientId) {
        const clientId = (await Utils.client.getClientByHost(host)).clientId;
        client = await fetchClient(clientId)
        localStorage.setItem(storage_name, JSON.stringify({ ...client, password: "" }));
      }
      return client;
    },
  }
};
