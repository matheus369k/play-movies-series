import { env } from './env'

export const formatter = {
  formatterUrl: function (url: string) {
    const urlLowerCase = url.toLowerCase()
    if (urlLowerCase.includes(' ')) {
      return urlLowerCase.split(' ').join('-').toString()
    }
    return urlLowerCase
  },
  unformattedUrl: function (url: string) {
    const urlLowerCase = url.toLowerCase()
    if (urlLowerCase.includes('-')) {
      return urlLowerCase.split('-').join(' ').toString()
    }
    return urlLowerCase
  },
  mergeAvatarUrlWithBackUrl: function (avatar: string | null) {
    return avatar ? env.VITE_BACKEND_URL.concat('/' + avatar) : null
  },
}
