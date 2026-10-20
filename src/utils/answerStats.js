// 各評鑑代碼（如 L11102）的累積作答紀錄：模擬考與歷屆考古題交卷時寫入，供「練習題」分頁的累積弱點顯示
const STORAGE_KEY = 'ipas_code_stats_v1'

export function loadCodeStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/** results：[{ code, correct }]，沒有代碼的題目略過 */
export function recordCodeAnswers(results) {
  const stats = loadCodeStats()
  results.forEach(({ code, correct }) => {
    if (!code) return
    if (!stats[code]) stats[code] = { correct: 0, total: 0 }
    stats[code].total += 1
    if (correct) stats[code].correct += 1
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function clearCodeStats() {
  localStorage.removeItem(STORAGE_KEY)
}
