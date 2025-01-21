import { randomYearNumber } from "../random-year";/* 

jest.mock("Math", ()=>({
    ...jest.requireActual("Math"),
    random: () => 0.5
}))
 */
it("Randow Year", () => {
    const mockRandomYearNumber = jest.fn(randomYearNumber);

    jest.spyOn(Math, "random").mockImplementation(() => 0.5);

    expect(mockRandomYearNumber()).toBe(2012);
})