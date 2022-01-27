import { makeAutoObservable, runInAction } from "mobx"
import { IPageModel, IPageParams } from "../models"

type TPageQueryHandle<T> = (p: IPageParams) => Promise<IPageModel<T>>

interface IPageStore<T> {
  asc?: number
  order?: string
  page?: number
  size?: number
  condition?: any
  query: TPageQueryHandle<T>
}

export class PageStore<T> implements IPageStore<T> {
  list: Array<T> = []

  page: number

  size: number

  loading = false

  errMsg: string | undefined

  condition: any

  // order: string

  // asc: number

  total = 0

  query: TPageQueryHandle<T>

  constructor(p: IPageStore<T>) {
    // this.asc = p.asc ?? 0
    // this.order = p.order ?? 'id'
    this.page = p.page ?? 1
    this.size = p.size ?? 10
    this.condition = p.condition ?? {}
    this.query = p.query

    makeAutoObservable(this)
  }

  setCondition(condition: any): Promise<void> {
    this.condition = condition
    this.page = 1
    return this.refresh()
  }

  setList(list: Array<T>) {
    this.list = list
  }

  changePage(p: number, size?: number): Promise<void> {
    this.page = p
    this.size = size ?? 10
    return this.refresh()
  }

  async refresh(): Promise<void> {
    this.errMsg = undefined
    this.loading = true
    try {
      if(this.query) {
        const data = await this.query({
          page: this.page,
          per_page: this.size,
          ...this.condition
        })
        runInAction(() => {
          this.list = data.list
          this.total = data.meta.pagination.total
        })
      }
    } catch(err: any) {
      runInAction(() => {
        this.errMsg = err.message
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}