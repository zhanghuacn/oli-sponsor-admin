import { String } from "aws-sdk/clients/acm";
import { IEventsModel } from ".";

export interface ILoginParams {
  // 用户名或邮箱
  username: string
  // 密码
  password: string
}

export interface IGlobalSearchEventsModel extends IEventsModel {
  // 筹款金额
  total_income: number
  // 参与人数
  participates: string
}

export interface IGlobalSearchModel {
  events: IGlobalSearchEventsModel[]
  products: IDashboardProductModel[]
}

export interface IRegisterParams {
  // 申请注册token
  token: string
  name: string
  logo: string
  // 背景图
  backdrop: string
  // 网站
  website: string
  // 描述
  description: string
  // 介绍
  introduce: string
  // 员工数量
  staff_num: string
  // 机构证件
  credentials: string[]
  // 其他证明
  documents: string[]
  // 联系人
  contact: string
  // 手机
  phone: string
  // 电话
  mobile: string
  email: string
  address: string
}

export interface IAdminUserModel {
  id: string
  avatar: String
  email: string
  name: "超级管理员"
  permissions: string[]
  // SUPER-ADMIN: 超级管理员
  roles: string[]
  username: "admin"
}

export interface IAuthUserModel {
  user: IAdminUserModel
  // token
  token: string
  token_type: string
}

export interface IDashboardSourceModel {
  // 机构直捐 活动捐款 活动义卖 活动门票 捐献 义卖商品
  type: 'CHARITY' | 'ACTIVITY' | 'BAZAAR' | 'TICKETS' | 'DONATION' | 'SALES'
  total_amount: number
}

export interface IStaffModel {
  id: number
  uid: number
  name: string
  email: string
  username: string
  profile: string
  avatar: string
  type: 'HOST' | 'STAFF'
  created_at: string
}

export interface IDashboardProductModel {
  id: number
  image: string
  name: string
  description: string
  // 销量
  sold: number
  // 收入
  income: number
}

export interface IDashboardModel {
  // 活动
  events: IEventsModel[]
  // 捐赠记录
  received: number[]
  // 捐款来源
  sources: IDashboardSourceModel[]
  products: IDashboardProductModel[]
}

export interface IAdminManagerCreateParams {
  username: string
}