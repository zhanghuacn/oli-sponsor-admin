import { makeAutoObservable } from "mobx"
import { ILoginParams, IAdminUserModel, IRegisterParams } from "../models"
import { AdminService } from "../services"
import { tokenStorage, userStorage } from "../utils/Storage"

export default class UserStore {
  private static _instance: UserStore

  _info: IAdminUserModel | undefined = undefined

  constructor() {
    if(!UserStore._instance) {
      UserStore._instance = this
      makeAutoObservable(this)
    }

    return UserStore._instance
  }

  get info(): IAdminUserModel | undefined {
    if(this._info) return this._info
    const info = userStorage.get()
    if(info) {
      this._info = info
      return info
    }
  }

  get isLogin(): boolean {
    return !!this.info
  }

  async login(p: ILoginParams) {
    const info = await AdminService.login(p)
    this._info = info.user
    userStorage.set(this._info)
    tokenStorage.set(`${info.token_type} ${info.token}`)
  }

  async register(p: IRegisterParams) {
    const info = await AdminService.register(p)
    // this._info = info.user
    // userStorage.set(this._info)
    // tokenStorage.set(`${info.token_type} ${info.token}`)
  }

  logout() {
    this._info = undefined
    tokenStorage.remove()
    userStorage.remove()
    AdminService.logout().catch((_: any) => {})
  }
}