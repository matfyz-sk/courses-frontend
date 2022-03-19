import { base64dataToFile } from '../../../helperFunctions'

const downloadBase64File = async (v, window) => {
  const decodedFile = await base64dataToFile(
    v.payload[0].content,
    v.filename,
    v.mimeType
  )
  const href = URL.createObjectURL(decodedFile)
  const link = Object.assign(window.document.createElement('a'), {
    href,
    style: 'display: none',
    download: v.filename,
  })
  window.document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(href)
  // link.remove()
  link.parentNode.removeChild(link)
}

export default downloadBase64File
