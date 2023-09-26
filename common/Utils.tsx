import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { useStore } from "@/store";
import { ROOM_URL, RoleNameMap, USER_INFO_STORAGE_KEY } from "@/constants";
import { EUserType, IMyRegister } from "@/api/types";
import { find } from "lodash";
import { fetchClient, getDomainNameConfiguration } from "@/api";


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

    debouncing: function (func: () => void, delay: number) {
      let timer: any = null;
      return (...args: any) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },

    throttle: (func: (arg: any) => any, delay: number) => {
      let timer: any = null;
      return (...args: any) => {
        if (!timer) {
          func.apply(this, args);
          timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null;
          }, delay);
        }
      };
    }
  },
  storage: {
    set: (key: string, value: any) => {
      return localStorage.setItem(`${key}`, value);
    },
    get: (key: string) => {
      return localStorage.getItem(`${key}`);
    },
    del: (key: string) => {
      return localStorage.removeItem(`${key}`);
    },
    clear: () => {
      localStorage.clear();
    },
    setUsr: (phone: string) => {
      localStorage.setItem(USER_INFO_STORAGE_KEY, phone);
    },
    getUsr: () => {
      return localStorage.getItem(USER_INFO_STORAGE_KEY);
    },
    delUsr: () => {
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
        const url = `${ROOM_URL || "https://room.rustedu.com/"}?username=${register?.name}&userId=${register.phone
          }&role=${RoleNameMap[status] || 'student'}&roomId=${course.roomId}&video=${course.ishd || '480'}p&title=${course.title}`
        window.open(url)
      }
    },
  },
  client: {
    localClient: async (host?: string) => {
      const storage_name = "CLIENT"
      let client = JSON.parse(localStorage.getItem(storage_name) || "{}");
      if (!client.clientId) {
        client = await fetchClient()
        localStorage.setItem(storage_name, JSON.stringify({ ...client, password: "" }));
      }
      return client;
    },
  }
};
