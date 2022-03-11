export function coursePrefix(route) {
  return route.charAt(0) === '/'
    ? `/courses/:course_id${ route }`
    : `/courses/:course_id/${ route }`;
}
