export * from './admin'
export * from './events'

export interface IPageParams {
  // 页码, 默认1
  page?: number
  // 页数, 默认10
  per_page?: number
  sort?: string
  filter?: string
}

export interface IPageModel<T> {
  list: Array<T>
  meta: {
    pagination: {
      // 总数
      total: number
      count: number
      // 页数
      per_page: number
      // 页码
      current_page: number
      // 总页数
      total_pages: number
    }
  }
}