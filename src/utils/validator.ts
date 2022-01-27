class _FormValidator {
  /**
   * 校验密码规则
   * @param minLen 最小长度
   * @param maxLen 最大长度
   * @param minLevel 校验等级
   * @param pwd 待校验密码
   */
  verifyPasswordRule(minLen: number, maxLen: number, minLevel: number, pwd: string) {
    if(pwd.length < minLen) {
      throw new Error(`Password is too short, less than ${minLen} characters`)
    }
    if(pwd.length > maxLen) {
      throw new Error(`Password is longer than ${maxLen} characters`)
    }

    let count = 0
    const regList: RegExp[] = [/[0-9]+/, /[a-z]+/, /[A-Z]+/, /[~!@#$%^&*?_-]+/]
    for(const r of regList) {
      if(r.test(pwd)) {
        count++
      }
    }

    if(count < minLevel) {
      const tipArr = [' numbers', ' and lowercase letters', ' and uppercase letters', ' and symbols']
      let str = 'Password must contain'
      for(let i = 0; i < minLevel; i++) {
        str += tipArr[i]
      }

      throw new Error(str)
    }
  }
}

export const FormValidator = new _FormValidator()