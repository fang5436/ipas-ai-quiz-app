import { fisherYatesShuffle } from './shuffle'

/** 115年官方加權模擬考配額（detail_code → 題數） */
export const EXAM_QUOTAS = {
  L11101: 4,
  L11102: 6,
  L11201: 3,
  L11202: 7,
  L11203: 3,
  L11301: 10,
  L11302: 7,
  L11401: 6,
  L11402: 4,
  L12101: 6,
  L12102: 6,
  L12201: 8,
  L12202: 10,
  L12301: 7,
  L12302: 5,
  L12303: 8,
}

export const EXAM_DURATION_SECONDS = 75 * 60

export const SUBJECT1_CODES = ['L111', 'L112', 'L113', 'L114']
export const SUBJECT2_CODES = ['L121', 'L122', 'L123']

export const TOPIC_LABELS = {
  L111: 'L111 人工智慧基礎',
  L112: 'L112 機器學習概論',
  L113: 'L113 資料處理與分析',
  L114: 'L114 機器學習實務',
  L121: 'L121 生成式 AI 概論',
  L122: 'L122 生成式 AI 應用',
  L123: 'L123 AI 應用規劃',
}

export function getSubjectCode(question) {
  return question.sub_category_code || question.detail_code?.slice(0, 4)
}

export function isSubject1(question) {
  return SUBJECT1_CODES.includes(getSubjectCode(question))
}

export function isSubject2(question) {
  return SUBJECT2_CODES.includes(getSubjectCode(question))
}

/** 依官方配額從題庫抽題 */
export function drawExamQuestions(allQuestions) {
  const poolByCode = {}
  for (const q of allQuestions) {
    if (!poolByCode[q.detail_code]) poolByCode[q.detail_code] = []
    poolByCode[q.detail_code].push(q)
  }

  const selected = []
  const warnings = []

  for (const [code, quota] of Object.entries(EXAM_QUOTAS)) {
    const pool = poolByCode[code] || []
    if (pool.length === 0) {
      warnings.push(`${code}：題庫無此細項，缺 ${quota} 題`)
      continue
    }

    const shuffled = fisherYatesShuffle(pool)
    if (shuffled.length >= quota) {
      selected.push(...shuffled.slice(0, quota))
    } else {
      selected.push(...shuffled)
      const remaining = quota - shuffled.length
      for (let i = 0; i < remaining; i++) {
        selected.push(shuffled[Math.floor(Math.random() * shuffled.length)])
      }
      warnings.push(`${code}：僅 ${shuffled.length} 題，已重複抽題補足 ${quota} 題`)
    }
  }

  return { questions: selected, warnings }
}

/** 計算單科分數（百分制） */
export function calcSubjectScore(questions, answers) {
  const subjectQs = questions
  if (subjectQs.length === 0) return 0
  const correct = subjectQs.filter((q) => answers[q.id] === q.correctIndex).length
  return Math.round((correct / subjectQs.length) * 100)
}

/** 官方合格標準：兩科平均 >= 70 且單科 >= 60 */
export function evaluateExamPass(subject1Score, subject2Score) {
  const average = (subject1Score + subject2Score) / 2
  return {
    passed: average >= 70 && subject1Score >= 60 && subject2Score >= 60,
    average: Math.round(average * 10) / 10,
    subject1Score,
    subject2Score,
  }
}

/** 雙層弱點分析 */
export function buildWeaknessAnalysis(questions, answers) {
  const topicStats = {}
  const detailStats = {}

  for (const q of questions) {
    const topic = getSubjectCode(q)
    const detail = q.detail_code
    const isCorrect = answers[q.id] === q.correctIndex

    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 }
    topicStats[topic].total++
    if (isCorrect) topicStats[topic].correct++

    if (!detailStats[detail]) detailStats[detail] = { correct: 0, total: 0, topic }
    detailStats[detail].total++
    if (isCorrect) detailStats[detail].correct++
  }

  const topics = Object.entries(topicStats)
    .map(([code, stat]) => ({
      code,
      label: TOPIC_LABELS[code] || code,
      correct: stat.correct,
      total: stat.total,
      rate: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0,
      details: Object.entries(detailStats)
        .filter(([, d]) => d.topic === code)
        .map(([detailCode, d]) => ({
          code: detailCode,
          correct: d.correct,
          total: d.total,
          rate: d.total ? Math.round((d.correct / d.total) * 100) : 0,
        }))
        .sort((a, b) => a.code.localeCompare(b.code)),
    }))
    .sort((a, b) => a.code.localeCompare(b.code))

  return topics
}
