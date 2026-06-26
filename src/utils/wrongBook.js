const STORAGE_KEY = 'ipas-wrong-book'

export function loadWrongBook() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveWrongBook(book) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(book))
}

export function getWrongBookIds() {
  return loadWrongBook().map((item) => item.id)
}

export function getWrongStreak(id) {
  const item = loadWrongBook().find((entry) => entry.id === id)
  return item?.correctStreak ?? 0
}

/** 答錯時加入錯題本並歸零 streak */
export function recordWrongAnswer(id) {
  const book = loadWrongBook()
  const idx = book.findIndex((item) => item.id === id)
  if (idx >= 0) {
    book[idx].correctStreak = 0
  } else {
    book.push({ id, correctStreak: 0 })
  }
  saveWrongBook(book)
}

/** 錯題模式答對，streak + 1，回傳新 streak 與是否達標待移除 */
export function recordWrongBookCorrect(id) {
  const book = loadWrongBook()
  const idx = book.findIndex((item) => item.id === id)
  if (idx < 0) return { streak: 0, readyToRemove: false }

  book[idx].correctStreak += 1
  const streak = book[idx].correctStreak
  const readyToRemove = streak >= 3
  saveWrongBook(book)
  return { streak, readyToRemove }
}

/** 切換下一題時正式移除已達 3 次的錯題 */
export function removeFromWrongBook(id) {
  const book = loadWrongBook().filter((item) => item.id !== id)
  saveWrongBook(book)
}

export function wrongBookCount() {
  return loadWrongBook().length
}
