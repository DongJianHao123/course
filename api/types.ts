type IDType = number | string

export enum EUserType {
  STUDENT = '1',
  TEACHER = '2',
  VISITOR = '3',
  TUTOR = '4',
  ADMIN = '5',
  PARENT = '6'
}

export interface ICurrentUser {
  phone?: string
}
export interface Client {
  id?: IDType
  clientId: string
  clientName?: string
  type?: number
  status?: number
  name?: string
  password?: string
  telephone?: string
  email?: string
  createdAt?: string | number
  updatedAt?: string | number
}
export interface HomepageInfo {
  id?: IDType
  aboutUsImgUrl?: string
  aboutUsInfo?: string
  clientId?: IDType
  companyEmail?: string
  companyName?: string
  companyPhone?: string
  companyQrUrl?: string
  consultUrl?: string
  coverUrl?: string
  createdAt?: string | number
  icpInfo?: string
  logoUrl?: string
  status?: number
  title?: string
  updatedAt?: string | number
}

export interface IMyRegister {
  id: IDType
  clientId: IDType
  courseId: IDType
  classId: IDType
  userId: IDType
  type: string
  name: string
  avatalUrl: null
  phone: string
  email: string
  gender: string
  age: string
  location: string
  company: string
  tag: string
  status: EUserType
  createdAt: string
  updatedAt: string
  verify: string
  uniCourseId: IDType
  tencentUserId: IDType
}

export interface RoomActionType {
  userId: string;
  userName: string;
  courseClassId?: number;
  role: string;
  clientId: string;
  clientName: string;
  actionType: string;
  description: string | number;
  actionTime: Date;
  courseId: IDType;
  courseName: string;
  courseClassName?: string;
  roomId: string;
}

export interface ICourse {
  applyCount?: number
  buyersCount?: number
  clientId: string
  clientName: string
  courseClasss?: any[]
  courseId: string
  courseIndex: 1
  coverUrl: string
  createdAt?: string
  domain?: string
  gradeLevel?: number | null
  id: number
  info?: string
  introduction?: string
  isDelete?: number
  isSpecail?: number
  ishd?: number
  linkUrl?: string
  location?: string
  oldPrice?: number
  price?: string
  roomId: string
  showqr?: null
  startAt?: string
  status?: number
  summary?: string
  tag?: string
  teacher?: string
  title: string
  totalNum?: number
  type?: number
  typeId?: string
  updatedAt?: string,
  replayList?: any[],
  students?: any[]
}