import { IStaffModel } from ".";

export type TEventsStatus = 'WAIT' | 'REVIEW' | 'PASSED' | 'REFUSE'

export interface IEventsModel {
  id: number
  // 活动图片
  image: string
  // 活动名称
  name: string
  // 活动描述
  description: string
  // 活动地址
  location: string
  // 活动开始时间
  begin_time: string
  // 活动结束时间
  end_time: string
}

export interface IEventsLotteryModel {
  id: number
  // 抽奖活动名称
  name: string
  // 图片
  image: string
  // 自动开奖, 手动开奖
  type: 'AUTOMATIC' | 'MANUAL'
  // 开奖时间
  draw_time: string
}

export interface IEventsLotteryPrizeModel {
  id: number
  name: string
  description: string
  // 库存
  stock: number
  // 价格
  price: number
  // 赞助商
  // sponsor: ISponsorModel[]
  images: string[]
}

export interface IEventsLotteryDetailModel extends IEventsLotteryModel {
  description: string
  begin_time: string
  end_time: string
  // 达标金额
  standard_amount: number
  // 自动开奖, 手动开奖
  type: 'AUTOMATIC' | 'MANUAL'
  // 开奖时间
  draw_time: string
  images: string[]
  // 奖品列表
  prizes: IEventsLotteryPrizeModel[]
}

export interface IEventsGiftModel {
  id: number
  name: string
  description: string
  images: string[]
}

export interface IEventsGiftUserModel {
  id: number
  name: string
  username: string
  avatar: string
  email: string
  phone: string
  first_name: string
  middle_name: string
  last_name: string
}

export interface IEventsDetailModel {
  basic: {
    id: number
    name: string
    description: string
    content: string
    location: string
    begin_time: string
    end_time: string
    price: number
    stock: number
    is_private: boolean
    images: string[]
    specialty: {
      title: string
      description: string
    }[]
    timeline: {
      time: string
      title: string
      description: string
    }[]
    status?: TEventsStatus
    state: 'POST' | 'WAIT' | 'CHECK' | 'PROGRESS' | 'PAST'
  }
  lotteries: IEventsLotteryDetailModel[]
  sales: {
    id: number
    name: string
    description: string
    stock: number
    price: number
    // sponsor: ISponsorModel
    content: string
    images: string[]
  }[]
  staffs: IStaffModel[]
  gifts: IEventsGiftModel[]
}