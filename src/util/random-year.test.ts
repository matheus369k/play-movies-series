import { randomYearNumber } from './random-year'

it('Random Year', () => {
  jest.spyOn(Math, 'random').mockImplementation(() => 0.5)
  const randomYear = randomYearNumber()
  expect(randomYear).toEqual(2012)
})
