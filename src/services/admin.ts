import { IAdminManagerCreateParams, IAdminPermissionCreateParams, IAdminPermissionModel, IAdminRoleCreateParams, IAdminRoleModel, IAuthUserModel, IDashboardModel, IGlobalSearchModel, ILoginParams, IPageModel, IPageParams, IRegisterParams, IStaffModel } from "../models"
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
   * 获取权限分页
   * @param p
   * @returns
   */
  async getPermissionPage(p: IPageParams): Promise<IPageModel<IAdminPermissionModel>> {
    return await HttpRequest.get('/api/v1/permissions', p)
  }

  /**
   * 创建权限
   * @param p
   * @returns
   */
  async createPermission(p: IAdminPermissionCreateParams) {
    return await HttpRequest.post('/api/v1/permissions', p)
  }

  /**
   * 更新权限
   * @param id 权限 ID
   * @param p
   * @returns
   */
  async updatePermissionById(id: number, p: IAdminPermissionCreateParams) {
    return await HttpRequest.put(`/api/v1/permissions/${id}`, p)
  }

  /**
   * 删除权限
   * @param id 权限 ID
   * @returns
   */
  async removePermissionById(id: number) {
    return await HttpRequest.delete(`/api/v1/permissions/${id}`)
  }

  /**
   * 获取角色分页
   * @param p
   * @returns
   */
   async getRolePage(p: IPageParams): Promise<IPageModel<IAdminRoleModel>> {
    return await HttpRequest.get('/api/v1/roles', p)
  }

  /**
   * 创建角色
   * @param p
   * @returns
   */
  async createRole(p: IAdminRoleCreateParams) {
    return await HttpRequest.post('/api/v1/roles', p)
  }

  /**
   * 更新角色
   * @param id 角色 ID
   * @param p
   * @returns
   */
  async updateRoleById(id: number, p: IAdminRoleCreateParams) {
    return await HttpRequest.put(`/api/v1/roles/${id}`, p)
  }

  /**
   * 删除角色
   * @param id 角色 ID
   * @returns
   */
  async removeRoleById(id: number) {
    return await HttpRequest.delete(`/api/v1/roles/${id}`)
  }
}

export default new AdminService()