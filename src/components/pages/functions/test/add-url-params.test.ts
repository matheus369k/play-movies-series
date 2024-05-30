import { setParamsAtUrl } from "../add-url-params"

const params = {name: "id", value: "896537"};
const mockSetParamsAtUrl = jest.fn(setParamsAtUrl);

it("add-url-params module", ()=> {
    mockSetParamsAtUrl(params.name, params.value);

    const url = new URL(window.location.toString());

    expect(url.searchParams.get(params.name)).toBe(params.value)
})