export function redirect(route, variables) {
  let _route = route;
  for(let i = 0; i < variables.length; i++) {
    const item = variables[i];
    _route = _route.replace(`:${item.key}`, item.value);
  }
  return _route;
}
