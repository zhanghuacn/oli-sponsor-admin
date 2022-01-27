type TObserverHandle<T> = (payload?: T) => void

export class Observer<T> {
  private _handle: Array<TObserverHandle<T>> = []

  // 订阅
  on(fn: TObserverHandle<T>) {
    const len = this._handle.length
    this._handle.push(fn)
    return len
  }

  // 发布
  emit(payload: T) {
    this._handle.forEach((fn) => fn(payload))
  }

  // 退订
  remove(fn: TObserverHandle<T>) {
    const idx = this._handle.indexOf(fn)
    if(idx === -1) return
    this._handle.splice(idx, 1)
  }

  // 清除
  clean() {
    this._handle = []
  }
}

// 登录状态
export interface ILoginStatusData {
  msg: string
  code: number
  isBack?: boolean
}

export const loginStatusObserver = new Observer<ILoginStatusData>()