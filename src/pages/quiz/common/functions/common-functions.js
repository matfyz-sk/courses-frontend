export function not(a, b) {
  return a.filter((value) => b.map(val => {return val.id}).indexOf(value.id) === -1);
}

export function intersection(a, b) {
  return a.filter((value) => b.map(val => {return val.id}).indexOf(value.id) !== -1);
}

export function union(a, b) {
  return [...a, ...not(b, a)];
}

export function formatDate(date){
  const datetime = new Date(date)
  return `${datetime.getDate()}.${datetime.getMonth()+1}.${datetime.getFullYear()}`
}

export function formatDateTime(date) {
  const datetime = new Date(date)
  return `${datetime.getDate()}.${datetime.getMonth() + 1}.${datetime.getFullYear()} ${String(datetime.getHours()).padStart(2, "0")}:${String(datetime.getMinutes()).padStart(2, "0")}`
}
