import { base64dataToFile } from '../../../helperFunctions'

const downloadBase64File = async (base64, filename, mimeType, window) => {
  const decodedFile = await base64dataToFile(
    base64,
    filename,
    mimeType
  )
  const href = URL.createObjectURL(decodedFile)
  const link = Object.assign(window.document.createElement('a'), {
    href,
    style: 'display: none',
    download: filename,
  })
  window.document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(href)
  // link.remove()
  link.parentNode.removeChild(link)
}

export default downloadBase64File
