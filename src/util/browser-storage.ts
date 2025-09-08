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
