import { EUserType } from '../api/types'
export const DETAULT_USER_AVATAR = 'https://ssl.cdn.maodouketang.com/Fn2y9zZHL6Cp7tLDsUq5b1kF7S88'

export const USER_INFO_STORAGE_KEY =btoa('rcore-user-info')

export const RoleNameMap = {
  [EUserType.STUDENT]: 'student',
  [EUserType.TEACHER]: 'teacher',
  [EUserType.TUTOR]: 'ta',
  [EUserType.ADMIN]: 'admin',
  [EUserType.VISITOR]: 'visitor',
  [EUserType.PARENT]: 'parent'
}

export const clientsLinks = [
  { clientId: 450, text: "Rust 培训", link: "https://rust-edu.cn" },
  { clientId: 481, text: "RISC-V 培训", link: "https://riscv-edu.cn"},
  { clientId: 466, text: "龙芯技术教育培训", link: "https://loongsonedu.cn" },
  { clientId: 476, text: "车用操作系统开发培训", link: "https://cicvedu.com" },
  { clientId: 479, text: "鸿蒙开发工程师培训", link: " https://harmonyos-edu.cn" },
  { clientId: 478, text: "React 培训", link: "https://reactedu.com" },
  { clientId: 483, text: "Vue 培训", link: "https://vueedu.cn" },
  { clientId: 480, text: "ChatGPT 培训", link: "https://chatgpt3edu.com" },
]