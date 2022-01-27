import { makeAutoObservable, runInAction } from "mobx"
import { isArray } from "underscore"
import { IAdminPermissionModel, IAdminRoleModel, IPageModel, ISponsorModel, IStaffModel } from "../models"
import { AdminService, EventsService } from "../services"
import { PageStore } from "./page"
import UserStore from "./user"

type IModelDataMapQuery<T> = () => Promise<T[] | IPageModel<T>>

interface IModelDataMap<T> {
  key: string
  value: string
  query: IModelDataMapQuery<T>
}

class ModelDataMap<T> {
  private key: string

  private value: string

  private query: IModelDataMapQuery<T>

  private needForceRefresh = false

  list: T[] = []

  constructor({
    key, value, query
  }: IModelDataMap<T>) {
    this.key = key
    this.value = value
    this.query = query
    makeAutoObservable(this)
  }

  async refresh(): Promise<void> {
    if(this.needForceRefresh || this.list.length === 0) {
      this.needForceRefresh = false
      const res = await this.query()
      if(isArray(res)) {
        runInAction(() => {
          this.list = res
        })
      } else {
        runInAction(() => {
          this.list = res.list
        })
      }
    }
  }

  setForceRefresh() {
    this.needForceRefresh = true
  }

  get toJSON(): any {
    return this.list.reduce((res, item: any) => ({
      ...res,
      [item[this.key]]: item[this.value]
    }), {})
  }
}

export class Store {
  private static _instance: Store

  constructor() {
    if(!Store._instance) {
      Store._instance = this
    }

    return Store._instance
  }

  user: UserStore = new UserStore()

  // 管理员权限
  adminPermissionMap = new ModelDataMap<IAdminPermissionModel>({
    key: 'name',
    value: 'name',
    query: () => AdminService.getPermissionPage({
      per_page: 500
    })
  })

  // 管理员角色
  adminRoleMap = new ModelDataMap<IAdminRoleModel>({
    key: 'name',
    value: 'name',
    query: () => AdminService.getRolePage({
      per_page: 500
    }),
  })

  // 管理员角色
  staffMap = new ModelDataMap<IStaffModel>({
    key: 'name',
    value: 'name',
    query: () => AdminService.getStaffPage({
      per_page: 500
    }),
  })

  // 赞助商列表
  sponsorMap = new ModelDataMap<ISponsorModel>({
    key: 'id',
    value: 'name',
    query: () => EventsService.getSponsors()
  })
}