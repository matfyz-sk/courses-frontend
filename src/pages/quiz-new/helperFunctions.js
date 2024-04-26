export function escapeText(text) {
  let escapedText = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"') {
      escapedText += '\\"'
    } else if (text[i] === '\\') {
      if (text[i + 1] === 'n') {
        // newline written manually
        escapedText += '\\n'
        i += 1
      } else {
        escapedText += '\\\\'
      }
    } else if (JSON.stringify(text[i]) === JSON.stringify('\n')) {
      // newline using enter key
      escapedText += '\\n'
    } else {
      escapedText += text[i]
    }
  }
  return escapedText
}
