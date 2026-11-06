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

// =================【搬到別的裝置：匯出／匯入錯題本】=================
// 錯題本只存在各裝置的 localStorage；匯出成一段文字（前綴＋JSON），到別台裝置貼上就能合併
const EXPORT_PREFIX = 'IPAS-WB1:'

export function exportWrongBook() {
  const book = loadWrongBook().map(({ id, correctStreak }) => [id, correctStreak ?? 0])
  return EXPORT_PREFIX + JSON.stringify(book)
}

/** 合併匯入：沒有的題目加進來；兩邊都有的取「連續答對次數」比較少的那個（保守，不會讓錯題提早移出）。回傳新增與更新題數 */
export function importWrongBook(text) {
  const raw = String(text || '').trim()
  const at = raw.indexOf(EXPORT_PREFIX)
  if (at < 0) throw new Error('不是錯題代碼（要以 ' + EXPORT_PREFIX + ' 開頭）')
  const list = JSON.parse(raw.slice(at + EXPORT_PREFIX.length))
  if (!Array.isArray(list)) throw new Error('錯題代碼格式不對')
  const book = loadWrongBook()
  const byId = new Map(book.map((item) => [String(item.id), item]))
  let added = 0
  let updated = 0
  for (const entry of list) {
    if (!Array.isArray(entry) || entry.length < 1) continue
    const [id, streak] = entry
    const s = Number.isFinite(streak) ? streak : 0
    const hit = byId.get(String(id))
    if (hit) {
      if (s < (hit.correctStreak ?? 0)) { hit.correctStreak = s; updated++ }
    } else {
      const item = { id, correctStreak: s }
      book.push(item)
      byId.set(String(id), item)
      added++
    }
  }
  saveWrongBook(book)
  return { added, updated, total: list.length }
}
