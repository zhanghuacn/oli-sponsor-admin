import { IDashboardSourceModel, IStaffModel } from ".";

export type TEventsStatus = 'WAIT' | 'REVIEW' | 'PASSED' | 'REFUSE'

export interface IEventsModel extends IEventsExtraModel {
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
  // 是否参与到活动
  is_current: boolean
  // 申请数量
  applies_count: number
  // 参与人数
  tickets_count: number
  // 审核状态
  status: TEventsStatus
  state: 'POST' | 'WAIT' | 'CHECK' | 'PROGRESS' | 'PAST'
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
  prizes: {
    id: number
    name: string
    description: string
    // 库存
    stock: number
    // 价格
    price: number
    // 赞助商
    sponsor: ISponsorModel[]
    images: string[]
    // 中奖名单
    winners: {
      id: number
      name: string
      avatar: string
      profile: string
    }[]
  }[]
}

export interface IEventsExtraModel {
  lotteries?: IEventsLotteryModel[]

  sales?: {
    id: number
    // 商品名称
    name: string
    // 商品图片
    image: string
    // 库存数量
    stock: number
    // 销售数量
    sale_num: number
    // 销售金额
    income: number
  }[]

  statistics?: {
    // 捐赠总额
    income: number
    // 捐赠构成
    constitute: IDashboardSourceModel[]
  }
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
    sponsor: ISponsorModel
    content: string
    images: string[]
  }[]
  staffs: IStaffModel[]
}

export interface IEventsApplyUserModel {
  id: number
  name: string
  avatar: string
  profile: string
  status: 'WAIT' | 'PASSED' | 'REFUSE'
}

export interface IEventsApplyUserAuditParams {
  status: 'PASSED' | 'REFUSE'
  remark: string
}

export interface IEventsUserTicketsModel {
  id: number
  name: string
  avatar: string
  // 门票码
  ticket: string
  // 组别
  group: {
    id: number
    name: string
  }
}

export interface ISponsorModel {
  id: number
  name: string
  logo: string
}

export interface IEventsSaveModel {
  id: number
  status: 'WAIT' | 'REVIEW' | 'PASSED' | 'REFUSE'
}