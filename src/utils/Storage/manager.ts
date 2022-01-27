// import * as Cookies from 'js-cookie'

export class StorageManager2<T> {
  private static get storage(): Storage {
    return window.localStorage
  }

  key: string

  constructor(key: string) {
    this.key = key
  }

  get(): T | undefined {
    let value
    try {
      value = StorageManager2.storage?.getItem(this.key)
      return value === null ? undefined : JSON.parse(value)
    } catch(err) {
      return value as unknown as T
    }
  }

  set(value: T): void {
    StorageManager2.storage?.setItem(this.key, JSON.stringify(value))
  }

  remove() {
    StorageManager2.storage?.removeItem(this.key)
  }
}

// export class Cookie2<T> {
//   key: string

//   constructor(key: string) {
//     this.key = key
//   }

//   get(): T | undefined {
//     let value
//     try {
//       value = Cookies.get(this.key)
//       if(value !== undefined) return JSON.parse(value)
//     } catch(err) {
//       return value as unknown as T
//     }
//   }

//   set(value: T): void {
//     Cookies.set(this.key, JSON.stringify(value))
//   }

//   remove() {
//     Cookies.remove(this.key)
//   }
// }