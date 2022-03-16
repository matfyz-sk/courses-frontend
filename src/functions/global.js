export function formatDate(_date) {
  const date = new Date(_date)
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(date)) {
    return ''
  }
  return `${date.getDate()}.${`0${date.getMonth() + 1}`.slice(
    -2
  )}.${date.getFullYear()}`
}

export function idFromURL(url) {
  const arr = url.split('/')
  return arr[arr.length - 1]
}

export function dateCompare(compared, symbol, myDate, compared2 = null) {
  const c1 = new Date(compared)
  const md = new Date(myDate)
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(c1) || isNaN(md)) {
    return null
  }
  switch (symbol) {
    case '<':
      return c1.getTime() < md.getTime()
    case '<=':
      return c1.getTime() <= md.getTime()
    case '>':
      return c1.getTime() > md.getTime()
    case '>=':
      return c1.getTime() >= md.getTime()
    case '<>':
      // eslint-disable-next-line no-case-declarations
      const c2 = new Date(compared2)
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(c2)) {
        return null
      }
      return md.getTime() >= c1.getTime() && md.getTime() <= c2.getTime()
    default:
      return null
  }
}
