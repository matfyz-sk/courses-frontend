import { SET_CLIPBOARD_BEING_CUT, SET_CLIPBOARD_NEW_PARENT, SET_CLIPBOARD_OLD_PARENT, SET_CLIPBOARD_RELOCATED } from '../../types'

export const setClipboardNewParent = item => ({
  type: SET_CLIPBOARD_NEW_PARENT,
  item
})

export const setClipboardOldParent = item => ({
  type: SET_CLIPBOARD_OLD_PARENT,
  item
})

export const setClipboardBeingCut = item => ({
  type: SET_CLIPBOARD_BEING_CUT,
  item
})


