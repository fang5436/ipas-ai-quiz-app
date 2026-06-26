/** Fisher-Yates 洗牌 */
export function fisherYatesShuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 洗牌選項並修正 correctIndex */
export function shuffleQuestionOptions(question) {
  const indexed = question.options.map((text, index) => ({ text, index }))
  const shuffled = fisherYatesShuffle(indexed)
  const correctIndex = shuffled.findIndex((item) => item.index === question.correctIndex)

  return {
    ...question,
    options: shuffled.map((item) => item.text),
    correctIndex,
    _originalCorrectIndex: question.correctIndex,
  }
}

/** 洗牌題目列表，每題選項也洗牌 */
export function prepareQuizQuestions(questions) {
  return fisherYatesShuffle(questions).map(shuffleQuestionOptions)
}
