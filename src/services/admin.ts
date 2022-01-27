import { IAdminManagerCreateParams, IAuthUserModel, IDashboardModel, IGlobalSearchModel, ILoginParams, IPageModel, IPageParams, IRegisterParams, IStaffModel } from "../models"
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
    return await HttpRequest.post('/api/v1/manager', p)
  }

  /**
   * 删除管理员
   * @param id 管理员 ID
   * @returns
   */
  async removeStaffById(id: number) {
    return await HttpRequest.delete(`/api/v1/manager/${id}`)
  }

  /**
   * 获取管理员分页
   * @param p
   * @returns
   */
  async getStaffPage(p: IPageParams): Promise<IPageModel<IStaffModel>> {
    return await HttpRequest.get('/api/v1/manager', p)
  }
}

export default new AdminService()