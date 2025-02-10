// Setar novo query paramento na URL
export function setParamsAtUrl(name: string, value: string | number) {
  const newUrl = new URL(window.location.toString());

  newUrl.searchParams.set(name, value.toString().replace(" ", "+"));
  window.history.pushState({}, "", newUrl);
}
// Remover query paramento na URL
export function removeParamsAtUrl(name: string) {
  const url = new URL(window.location.toString());
  url.searchParams.delete(name);
  window.history.pushState({}, "", url);
}
// Ler query paramento na URL
export function getUrlParams(nameParams: string) {
  const url = new URL(window.location.toString());
  return url.searchParams.get(nameParams);
}
