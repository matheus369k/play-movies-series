export const urlParams = {
  set: function (name: string, value: string | number) {
    const url = new URL(window.location.toString())
    url.searchParams.set(name, value.toString().replace(' ', '+'))
    window.history.pushState({}, '', url)
  },
  get: function (nameParams: string) {
    const url = new URL(window.location.toString())
    return url.searchParams.get(nameParams)
  },
  delete: function (name: string) {
    const url = new URL(window.location.toString())
    url.searchParams.delete(name)
    window.history.pushState({}, '', url)
  },
}
