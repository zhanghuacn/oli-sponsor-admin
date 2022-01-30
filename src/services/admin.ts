import { IAdminManagerCreateParams, IAuthUserModel, IDashboardModel, IGlobalSearchModel, ILoginParams, IPageModel, IPageParams, IRegisterParams, ISponsorDetailModel, IStaffModel } from "../models"
import { HttpRequest } from "../utils"

class AdminService {
  /**
     * 登录
     * @param p
     * @returns
     */
  async login(p: ILoginParams): Promise<IAuthUserModel> {
    return await HttpRequest.post('/api/v1/auth/login', p)
  }

  /**
   * 登出
   * @returns
   */
  async logout() {
    return await HttpRequest.post('/api/v1/auth/logout')
  }

  /**
   * 注册申请
   * @param p
   * @returns
   */
  async register(p: IRegisterParams): Promise<IAuthUserModel> {
    return await HttpRequest.post('/api/v1/auth/register', p)
  }

  /**
   * 获取首页聚合数据
   * @returns
   */
  async getDashboardData(): Promise<IDashboardModel> {
    return await HttpRequest.get('/api/v1/home/dashboard')
  }

  /**
   * 全局搜索
   * @returns
   */
  async searchGlobalValue(keyword: string): Promise<IGlobalSearchModel> {
    return await HttpRequest.get('/api/v1/home/search', {
      keyword
    })
  }

  /**
   * 创建管理人员
   * @param p
   * @returns
   */
  async addStaff(p: IAdminManagerCreateParams) {
    return await HttpRequest.post('/api/v1/staffs', p)
  }

  /**
   * 删除管理员
   * @param id 管理员 ID
   * @returns
   */
  async removeStaffById(id: number) {
    return await HttpRequest.delete(`/api/v1/staffs/${id}`)
  }

  /**
   * 获取管理员分页
   * @param p
   * @returns
   */
  async getStaffPage(p: IPageParams): Promise<IPageModel<IStaffModel>> {
    return await HttpRequest.get('/api/v1/staffs', p)
  }

  /**
   * 获取赞助商详情
   * @returns
   */
  async getSponsorDetail(): Promise<ISponsorDetailModel> {
    return await HttpRequest.get('/api/v1/sponsor')
  }

  /**
   * 更新赞助商详情
   * @param p
   * @returns
   */
  async updateSponsor(p: any): Promise<void> {
    return await HttpRequest.put('/api/v1/sponsor', p)
  }
}

export default new AdminService()