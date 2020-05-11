import { getShortID } from '../../helperFunctions'
import {getUser, getUserID} from './index';

export function showUserName(user, privilege) {
  if (getShortID(user['@id']) === getUserID() || !user.useNickName) {
    return `${user.firstName} ${user.lastName}`
  }
  if (privilege.inCourseInstance === 'instructor' || privilege.inGlobal === 'admin') {
    return `${user.firstName} ${user.lastName} ${user.useNickName && user.nickname.length > 0 ? `(${user.nickname})` : ''}`
  }
  if (user.useNickName) {
    if (user.nickname.length === 0) {
      return 'Anonymous'
    }
    return user.nickname
  }
  return `${user.firstName} ${user.lastName}`
}

export function textLimiter(text, words = 15) {
  if (text) {
    const txtArr = text.split(' ')
    if (txtArr.length > words) {
      const cut = txtArr.slice(0, words)
      return `${cut.join(' ')} ...`
    }
    return text
  }
  return ''
}

export function isVisibleUser(user) {
  return (
    user.publicProfile ||
    user.allowContact ||
    user.showCourses ||
    user.showBadges ||
    (getUserID() && getUserID() === getShortID(user['@id'])) ||
    (getUser() && getUser().isSuperAdmin)
  )
}
