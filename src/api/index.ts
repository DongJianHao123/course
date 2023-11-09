import request from '../utils/request'
import type { Client, HomepageInfo, ICourse, IMyRegister } from '../api/types'
import axios from 'axios'
import { CLIENT_ID } from '@/constants'



// let CLIENT_ID = 41; //479 鸿蒙 450 rustedu //481 riscv 476 cicv //483 vue
const PAGE_SIZE = 2000

export async function getHomePage() {
  const res = await request<never, HomepageInfo[]>('/seller/api/homepages', {
    params: {
      'clientId.equals': CLIENT_ID
    }
  })
  return res[0]
}

export async function getCourses(popular: boolean) {
  const url = popular
    ? `/seller/api/coursesget/getAllCoursesByConditionsWithTotal?page=0&size=18&clientId=${CLIENT_ID}&tag=hot&isDelete=1&sort=courseIndex,asc`
    : `/seller/api/coursesget/getAllCoursesByConditionsWithTotal?page=0&size=100&isDelete=1&clientId=${CLIENT_ID}&sort=courseIndex,asc`

  return await request<never, { courseList: any[] }>(url)
}

export async function getMyCourses(phone: any, page = 0) {
  return await request<never, { courseList: any[]; totalNum: number }>(
    `/seller/api/students/getAllCourseByStudentWithTotal?clientId=${CLIENT_ID}`,
    {
      params: {
        page,
        phone,
        size: 20,
        sort: 'id,desc'
      }
    }
  )
}

export async function getCourse(id: any) {
  const res = await request<never, ICourse[]>('/seller/api/courses', {
    params: {
      'clientId.equals': CLIENT_ID,
      'courseId.equals': id
    }
  })
  return res[0]
}

export async function getTeachars() {
  return await request<never, { teacherList: any[] }>(
    `/seller/api/teachers/getAllTeachersByConditionsWithTotal?page=0&size=10&clientId=${CLIENT_ID}`
  )
}

export async function getStudentOfCourse(courseId: any) {
  const res = await request<never, any[]>('/seller/api/students', {
    params: {
      'clientId.equals': CLIENT_ID,
      'courseId.equals': courseId,
      size: PAGE_SIZE
    }
  })
  return res
}
export async function updateStudent(data: any) {
  return await request('/seller/api/students/update', {
    method: 'post',
    data,
  });
}
export async function getReplayOfCourse(courseId: any) {
  const res = await request<never, any[]>('/seller/api/course-classes', {
    params: {
      'clientId.equals': CLIENT_ID,
      'courseId.equals': courseId,
      size: PAGE_SIZE,
      sort: 'startAt,desc',
      // status: 1 //后端缺少验证该字段，拉取了未上架的视频
    }
  })
  return res
}

export async function registerCourse(data: any) {
  const res = await request<never, IMyRegister>('/seller/api/students', {
    method: 'POST',
    data
  })
  return res
}

export async function getMyRegisters(phone: string) {
  const res = await request<never, IMyRegister[]>('/seller/api/students', {
    params: {
      'clientId.equals': CLIENT_ID,
      'phone.equals': phone
    }
  })
  return res
}

export async function getReplayerChatHistory(params: {
  roomId: string
  startTime: string
  endTime: string
}) {
  const { roomId, startTime, endTime } = params
  const res = await request<never, { totalNum: number; roomActionList: any[] }>(
    '/analysis/api/room-actions/getRoomActionsWithTotalNumByConditionsTime',
    {
      params: {
        roomId,
        startTime: new Date(startTime).toJSON(),
        endTime: new Date(endTime).toJSON(),
        clientId: CLIENT_ID,
        page: 0,
        size: 200,
        actionType: 'CHAT'
      }
    }
  )
  return res
}
export async function fetchClient() {
  const res = await request<never, Array<Client>>(`seller/api/clients?current=1&pageSize=10&clientId.equals=${CLIENT_ID}&size=10`)
  return res[0]
}
//机构
export async function clients(params: any) {
  const res = await request<never, Array<Client>>(`/seller/api/clients`, { params: params })
  return res[0]
};

export async function sendCaptcha(params: any) {
  const res = await request(`/base/api/common/sms/sendCaptcha`, { params: params });
  return res;
}
export async function verifyCaptcha(params: any) {
  const res = await request(`/base/api/common/sms/verifyCaptcha`, { params: params });
  return res
}
export async function studentAction(data: any) {
  const res = await request("/analysis/api/room-actions", {
    method: 'POST',
    data
  });
}

export async function sendEmail(data: any) {
  const res = await request("/base/api/email/sendEmail", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*"
    },
    data
  });
}

export const getDomainNameConfiguration = async () => {
  const res = await fetch("https://rustedu.com/r2edu-api/mapping.json")
  const list = (await res.json()).list
  return list
}

// export const testGiteeApi = async () => {
//   const res = await request("https://gitee.com/dong-jianhao/r2edu-api/raw/master/domain_name_mapping.json", {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': "get post,put,delete"
//     }
//   })
//   console.log(res);
// }
export const sendUrlToBing = async () => {
  const res = await request({
    url: "https://www.bing.com/indexnow",
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      host: "cicvedu.com",
      key: "f2f6381b2e4b4105bf286473c295c35d",
      keyLocation: "https://cicvedu.com/f2f6381b2e4b4105bf286473c295c35d.txt",
      urlList: [
        "https://cicvedu.com/course/101",
        "https://cicvedu.com/course/102",
        "https://cicvedu.com/course/103"
      ]
    }
  })
}

