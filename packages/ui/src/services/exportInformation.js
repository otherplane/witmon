export function createDownloadLink () {
  return `data:application/json;charset=utf-8,filename=information.json,${encodeURIComponent(
    JSON.stringify(JSON.parse(localStorage.getItem('tokenInfo')))
  )}`
}
