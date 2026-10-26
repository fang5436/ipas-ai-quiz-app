// 各評鑑代碼（如 L11102）的累積作答紀錄，分兩份存：
// - 'exam'：全真模擬考與歷屆考古題交卷時寫入（ipas_code_stats_v1，沿用原本的資料）
// - 'practice'：練習題作答時寫入（ipas_practice_code_stats_v1），練習題不是官方題，和考試實力分開算
// 兩份都顯示在「弱點分析」分頁（components/CumulativeWeakness.vue）
const STORAGE_KEYS = {
  exam: 'ipas_code_stats_v1',
  practice: 'ipas_practice_code_stats_v1',
}

export function loadCodeStats(kind = 'exam') {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[kind])
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/** results：[{ code, correct }]，沒有代碼的題目略過 */
export function recordCodeAnswers(results, kind = 'exam') {
  const stats = loadCodeStats(kind)
  results.forEach(({ code, correct }) => {
    if (!code) return
    if (!stats[code]) stats[code] = { correct: 0, total: 0 }
    stats[code].total += 1
    if (correct) stats[code].correct += 1
  })
  localStorage.setItem(STORAGE_KEYS[kind], JSON.stringify(stats))
}

export function clearCodeStats(kind = 'exam') {
  localStorage.removeItem(STORAGE_KEYS[kind])
}
