import { setParamsAtUrl } from "../add-url-params"

const params = {name: "id", value: "896537"};

it("add-url-params module", ()=> {
    setParamsAtUrl(params.name, params.value);

    const url = new URL(window.location.toString());

    expect(url.searchParams.get(params.name)).toBe(params.value)
})