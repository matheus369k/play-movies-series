import { urlParams } from './url-params'

describe('urlParams', () => {
  const params = { name: 'id', value: '896537' }

  it('should add new param', () => {
    urlParams.set(params.name, params.value)
    const url = new URL(window.location.toString())

    expect(url.searchParams.get(params.name)).toBe(params.value)
  })

  it('should remove param', () => {
    urlParams.set(params.name, params.value)
    urlParams.delete(params.name)
    const url = new URL(window.location.toString())

    expect(url.searchParams.get(params.name)).toBeNull()
  })

  it('should get param', () => {
    urlParams.set(params.name, params.value)
    const urlParam = urlParams.get(params.name)

    expect(urlParam).toBe(params.value)
  })
})
