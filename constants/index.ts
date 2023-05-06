import { EUserType } from '../api/types'
export const DETAULT_USER_AVATAR = 'https://ssl.cdn.maodouketang.com/Fn2y9zZHL6Cp7tLDsUq5b1kF7S88'

export const USER_INFO_STORAGE_KEY = btoa('rcore-user-info')

export const CLIENT_ID = 385;

export const ROOM_URL = "https://room.os2edu.cn/"

export const WEB_HOST = "os2edu.cn"

export const RoleNameMap = {
  [EUserType.STUDENT]: 'student',
  [EUserType.TEACHER]: 'teacher',
  [EUserType.TUTOR]: 'ta',
  [EUserType.ADMIN]: 'admin',
  [EUserType.VISITOR]: 'visitor',
  [EUserType.PARENT]: 'parent'
}

export const footerLinks = [
  { index: 0, text: "Rust基础教程", link: "http://docs.os2edu.cn/" },
  { index: 1, text: "清华rCore操作系统实践教程", link: "http://rcore-os.cn/rCore-Tutorial-Book-v3/" },
  { index: 2, text: "全国大学生操作系统设计大赛", link: "https://os.educg.net/2022CSCC" },

]