import { IEventsApplyUserAuditParams, IEventsApplyUserModel, IEventsDetailModel, IEventsExtraModel, IEventsModel, IEventsSaveModel, IEventsUserTicketsModel, IPageModel, IPageParams, ISponsorModel } from "../models"
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
   * 活动分页详情
   * @param id 活动 ID
   * @returns
   */
  async getPageDetailById(id: number): Promise<IEventsExtraModel> {
    return await HttpRequest.get(`/api/v1/events/${id}/details`)
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
   * 获取活动审核详情
   * @param id 活动 ID
   * @returns
   */
  async getAuditDetailById(id: number): Promise<IEventsDetailModel> {
    return await HttpRequest.get(`/api/v1/events/${id}/audit-details`)
  }

  /**
   * 保存活动
   * @returns
   */
  async save(p: any): Promise<IEventsSaveModel> {
    return await HttpRequest.post(`/api/v1/events`, p)
  }

  /**
   * 更新活动
   * @param id 活动 ID
   * @param p
   * @returns
   */
  async updateById(id: number, p: any): Promise<IEventsSaveModel> {
    return await HttpRequest.put(`/api/v1/events/${id}`, p)
  }

  /**
   * 提交活动
   * @param id 活动 ID
   * @returns
   */
  async submitById(id: number, p: any) {
    return await HttpRequest.post(`/api/v1/events/${id}/submit`, p)
  }

  /**
   * 删除活动
   * @param id 活动 ID
   * @returns
   */
  async removeById(id: number) {
    return await HttpRequest.delete(`/api/v1/events/${id}`)
  }

  /**
   * 申请用户分页
   * @param id 活动 ID
   * @param p
   * @returns
   */
  async getApplyUserPageById(id: number, p: IPageParams): Promise<IPageModel<IEventsApplyUserModel>> {
    return await HttpRequest.get(`/api/v1/events/${id}/applies`, p)
  }

  /**
   * 审核申请用户
   * @param id 用户 ID
   * @param eventsId 活动 ID
   * @param p
   * @returns
   */
  async auditApplyUserById(id: number, eventsId: number, p: IEventsApplyUserAuditParams) {
    return await HttpRequest.post(`/api/v1/events/${eventsId}/applies/${id}/audit`, p)
  }

  /**
   * 用户门票列表
   * @param id 活动 ID
   * @returns
   */
  async getUserTicketsById(id: number): Promise<IEventsUserTicketsModel[]> {
    return await HttpRequest.get(`/api/v1/events/${id}/tickets`)
  }

  /**
   * 赞助商列表
   * @param keyword 关键字
   * @returns
   */
  async getSponsors(keyword?: string): Promise<ISponsorModel[]> {
    return await HttpRequest.get(`/api/v1/sponsors`, {
      keyword
    })
  }
}

export default new EventsService()