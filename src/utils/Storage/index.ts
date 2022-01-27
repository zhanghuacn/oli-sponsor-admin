
import { IAdminUserModel } from "../../models"
import { StorageManager2 } from "./manager"

export const tokenStorage = new StorageManager2<string>('_token')

export const userStorage = new StorageManager2<IAdminUserModel>('_user')