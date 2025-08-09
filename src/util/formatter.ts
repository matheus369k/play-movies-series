export function formatter(url: string) {
  function formatterUrl() {
    return url.split(' ').join('-').toString().toLowerCase()
  }

  function unformattedUrl() {
    return url.split('-').join(' ').toString()
  }

  return {
    formatterUrl,
    unformattedUrl,
  }
}
