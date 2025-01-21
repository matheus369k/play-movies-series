export function setParamsAtUrl(name: string, value: string | number){
    const newUrl = new URL(window.location.toString());

    newUrl.searchParams.set(name, value.toString().replace(" ", "+"));
    window.history.pushState({}, "", newUrl);
}