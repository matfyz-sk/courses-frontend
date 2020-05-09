import { getShortID } from '../../helperFunctions'
import { getUserID } from './index'

export function showUserName(user, privilege) {
  if (getShortID(user['@id']) === getUserID() || !user.nickname) {
    return `${user.firstName} ${user.lastName}`
  }
  if (privilege === 'instructor') {
    return `${user.firstName} ${user.lastName} (${user.nickname ? user.nickname : ''})`
  }
  return user.nickname
}
