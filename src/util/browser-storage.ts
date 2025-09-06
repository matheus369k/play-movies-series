export const browserLocalStorage = {
  storage: window.localStorage,
  set: function ({ key, value }: { key: string; value: string }) {
    this.storage.setItem(key, value)
  },
  get: function (key: string) {
    const value = this.storage.getItem(key)
    if (value && value.includes(':')) {
      return JSON.parse(value)
    }
    return value
  },
  delete: function (key: string) {
    this.storage.removeItem(key)
  },
  deleteAll: function () {
    this.storage.clear()
  },
}

export const browserSessionStorage = {
  storage: window.sessionStorage,
  set: function ({ key, value }: { key: string; value: string }) {
    this.storage.setItem(key, value)
  },
  get: function (key: string) {
    const value = this.storage.getItem(key)
    if (value && value.includes(':')) {
      return JSON.parse(value)
    }
    return value
  },
  delete: function (key: string) {
    this.storage.removeItem(key)
  },
  deleteAll: function () {
    this.storage.clear()
  },
}

export const cookiesStorage = {
  set: function ({ key, value }: { key: string; value: string }) {
    const date = new Date()
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
    document.cookie = `${key}=${value};expires=${date.toUTCString()}`
  },
  get: function (key: string) {
    try {
      const allCookies: string[] = document.cookie.split('=')
      const cookieKeyIndex = allCookies.findIndex((value) => value === key)
      if (cookieKeyIndex < 0) {
        throw new Error(`Not found cookie with name: ${key}`)
      }
      const cookieValue = allCookies[cookieKeyIndex + 1]
      if (cookieValue.includes(':')) {
        return JSON.parse(cookieValue.split?.(';')[0])
      }
      return cookieValue.split?.(';')[0]
    } catch (error) {
      console.log(error)
      return null
    }
  },
  delete: function (key: string) {
    try {
      const allCookies: string[] = document.cookie.split('=')
      const cookieKeyIndex = allCookies.findIndex((value) => value === key)
      if (cookieKeyIndex < 0)
        throw new Error(`Not found cookie with name: ${key}`)
      document.cookie = allCookies
        .map((value, index) => {
          if (cookieKeyIndex + 1 === index) {
            const cookieExpired = `;expires=${new Date(0).toUTCString()} `
            return `${allCookies[cookieKeyIndex + 1]} ${cookieExpired}`
          }
          return value
        })
        .toString()
        .replace(';,', '; ')
        .replace(',', '=')
    } catch (error) {
      console.log(error)
    }
  },
}
