import { ROOM_URL, RoleNameMap, USER_INFO_STORAGE_KEY } from "@/constants";
import { EUserType, IMyRegister } from "@/api/types";
import { find } from "lodash";
import { fetchClient } from "@/api";
import { i18nextLng } from "@/pages/_app";
import { languages } from "@/i18n";


export const Utils = {
  common: {
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
          }&role=${RoleNameMap[status] || 'student'}&roomId=${course.roomId}&video=${course.ishd || '480'}p&title=${course.title}&locale=${localStorage.getItem(i18nextLng) || languages[0]}`
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
