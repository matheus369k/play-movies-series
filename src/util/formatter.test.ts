import { faker } from '@faker-js/faker/locale/pt_BR'
import { formatter } from './formatter'
import { env } from './env'

describe('formatter()', () => {
  it('should formatter url corrected', () => {
    const title = formatter.formatterUrl('Dragon of danger')
    expect(title).toBe('dragon-of-danger')
  })

  it('should unformatted url corrected', () => {
    const title = formatter.unformattedUrl('dragon-of-danger')
    expect(title).toBe('dragon of danger')
  })

  it('should mergeAvatarUrlWithBackUrl avatarUrl corrected', () => {
    const avatar = faker.image.avatar()
    expect(formatter.mergeAvatarUrlWithBackUrl(avatar)).toBe(
      env.VITE_BACKEND_URL.concat('/' + avatar)
    )
  })
})
