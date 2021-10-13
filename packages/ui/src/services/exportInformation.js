export function createDownloadLink () {
  // var file = new Blob([JSON.stringify(JSON.parse(localStorage.getItem('tokenInfo')))], {type: 'application/json'});
  // return URL.createObjectURL(file);
  return `data:application/json;charset=utf-8,filename=information.json,${encodeURIComponent(
    JSON.stringify(JSON.parse(localStorage.getItem('tokenInfo')))
  )}`
}
