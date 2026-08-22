import { formatter } from './formatter'

describe('formatter()', () => {
  it('should formatter url corrected', () => {
    const title = formatter.formatterUrl('Dragon of danger')
    expect(title).toBe('dragon-of-danger')
  })

  it('should unformatted url corrected', () => {
    const title = formatter.unformattedUrl('dragon-of-danger')
    expect(title).toBe('dragon of danger')
  })
})
