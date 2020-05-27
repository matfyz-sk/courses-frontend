import { getShortID } from '../../helperFunctions'
import { getUser, getUserID } from './index'

function hasSpecificNickName(user, course) {
  for (let k = 0; k < course.hasPersonalSettings.length; k++) {
    if (course.hasPersonalSettings[k].hasUser === user['@id']) {
      if (course.hasPersonalSettings[k].nickName.length > 0) {
        return course.hasPersonalSettings[k].nickName
      }
    }
  }
  return null
}

export function showUserName(user, privilege, courseInstance = null) {
  let specificNickName = null
  if (courseInstance) {
    specificNickName = hasSpecificNickName(user, courseInstance)
  }

  if (
    getShortID(user['@id']) === getUserID() ||
    (!user.useNickName && !specificNickName)
  ) {
    return `${user.firstName} ${user.lastName}`
  }
  if (privilege.inCourseInstance === 'instructor' || privilege.inGlobal === 'admin') {
    if (specificNickName) {
      return `${user.firstName} ${user.lastName} (${specificNickName})`
    }
    return `${user.firstName} ${user.lastName} ${user.useNickName && user.nickname.length > 0 ? `(${user.nickname})` : ''}`
  }
  if (user.useNickName || specificNickName) {
    if (user.nickname.length === 0) {
      return 'Anonymous'
    }
    if (specificNickName) {
      return specificNickName
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
