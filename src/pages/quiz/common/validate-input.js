export const checkTextNotEmpty = (text,name) => {
    if (text && text.length > 0 ) return 'ok'
    else return name + ' cannot be empty'
}

export const checkAnswers = (answers) => {
    if (answers && answers.length > 0) {}
    else return 'Cannot create question without any answer'
    if (answers && answers.filter(answer => answer.text === '').length > 0) return 'Empty answers are not allowed'
    return 'ok'
}

export const checkPairs = (pairs,answers) => {
    if (pairs && pairs.length > 0) {}
    else return 'Cannot create question without any answer'

    if (pairs && pairs.filter(pair => pair.promptText === '').length > 0) return 'Empty prompts are not allowed'
    
    if (pairs && pairs.filter(pair => answers.find(answer => answer.id === pair.answerId).text === '').length > 0) return 'Empty answers are not allowed'

    return 'ok'
}

export const checkDate = (startDate, endDate) => {
    if ( startDate.toDateString() !== endDate.toDateString() && endDate - startDate < 0) return 'Invalid date'
    else return 'ok'
}
