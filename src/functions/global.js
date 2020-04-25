export function formatDate(_date) {
  const date = new Date(_date)
  if(isNaN(date)) {return ''}
  return `${date.getDate()}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`
}

export function idFromURL(url) {
  const arr = url.split('/')
  return arr[arr.length - 1]
}
