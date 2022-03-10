import { IEventsDetailModel, IEventsGiftModel, IEventsGiftUserModel, IEventsModel, IPageModel, IPageParams } from "../models"
import { HttpRequest } from "../utils"

class EventsService {
  /**
   * 活动分页
   * @param p
   * @returns
   */
  async getPage(p: IPageParams): Promise<IPageModel<IEventsModel>> {
    return await HttpRequest.get('/api/v1/events', p)
  }

  /**
   * 获取活动线上详情
   * @param id 活动 ID
   * @returns
   */
  async getDetailById(id: number): Promise<IEventsDetailModel> {
    return await HttpRequest.get(`/api/v1/events/${id}`)
  }

  /**
   * 更新活动
   * @param id 活动 ID
   * @param p
   * @returns
   */
   async updateById(id: number, p: any): Promise<void> {
    return await HttpRequest.put(`/api/v1/events/${id}`, p)
  }

  /**
   * 获取活动礼物列表
   * @param id 活动 ID
   * @param p
   * @returns
   */
   async getGiftPageById(id: number, p: IPageParams): Promise<IPageModel<IEventsGiftModel>> {
    return await HttpRequest.get(`/api/v1/events/${id}/gifts`, p)
  }

  /**
   * 获取活动礼物申请用户列表
   * @param id 礼物 ID
   * @param eventsId 活动 ID
   * @param p
   * @returns
   */
  async getGiftUserPageById(id: number, eventsId: number, p: IPageParams): Promise<IPageModel<IEventsGiftUserModel>> {
    return await HttpRequest.get(`/api/v1/events/${eventsId}/gifts/${id}/users`, p)
  }
}

export default new EventsService()