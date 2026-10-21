// 各篇出題比例：從題庫直接統計「最新兩屆」官方試題，題庫加入新一屆時會自動更新
// 題號前 5 碼是屆別（例如 11503 = 115 年第三次），每題的 detail_code 是官方評鑑代碼
import { CODE_NAMES } from '../data/codeNames.js';

export const PARTS = [
  { no: 1, subject: 1, title: 'AI 的定義、分類與治理', codes: ['L11101', 'L11102'] },
  { no: 2, subject: 1, title: '資料基本概念與處理流程', codes: ['L11201', 'L11202', 'L11203'] },
  { no: 3, subject: 1, title: '機器學習基本原理與常見模型', codes: ['L11301', 'L11302'] },
  { no: 4, subject: 1, title: '鑑別式 AI 與生成式 AI', codes: ['L11401', 'L11402'] },
  { no: 5, subject: 2, title: 'No Code／Low Code', codes: ['L12101', 'L12102'] },
  { no: 6, subject: 2, title: '生成式 AI 應用與常見工具', codes: ['L12201', 'L12202'] },
  { no: 7, subject: 2, title: '生成式 AI 導入評估與風險管理', codes: ['L12301', 'L12302', 'L12303'] },
];
export const PART_NAMES = ['', '第一篇', '第二篇', '第三篇', '第四篇', '第五篇', '第六篇', '第七篇'];

const examLabel = (source = '') => {
  const m = source.match(/(\d+)年第(.)次/);
  return m ? `${m[1]} 年第${m[2]}次` : source;
};

// 占該科比例 ≥25% 為重點、15～25% 為中等
export const levelOf = (pct) => (pct >= 25 ? 'high' : pct >= 15 ? 'mid' : 'low');
export const LEVEL_STYLE = {
  high: { badge: 'bg-rose-950 text-rose-300 border-rose-800', bar: 'bg-rose-500', label: '重點' },
  mid: { badge: 'bg-amber-950 text-amber-300 border-amber-800', bar: 'bg-amber-500', label: '中等' },
  low: { badge: 'bg-slate-800 text-slate-300 border-slate-700', bar: 'bg-slate-500', label: '較少' },
};

export function examStats(questions, recentCount = 2) {
  const byExam = {};
  for (const q of questions) {
    const key = String(q.id).slice(0, 5);
    (byExam[key] = byExam[key] || { label: examLabel(q.source), codes: {}, subjects: {} });
    const e = byExam[key];
    e.codes[q.detail_code] = (e.codes[q.detail_code] || 0) + 1;
    const subj = q.detail_code?.startsWith('L11') ? 1 : 2;
    e.subjects[subj] = (e.subjects[subj] || 0) + 1;
  }
  const exams = Object.keys(byExam).sort().slice(-recentCount).map(k => byExam[k]);
  if (!exams.length) return { exams: [], parts: [] };

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const subjectAvg = { 1: avg(exams.map(e => e.subjects[1] || 0)), 2: avg(exams.map(e => e.subjects[2] || 0)) };
  const totalAvg = subjectAvg[1] + subjectAvg[2];

  const parts = PARTS.map(p => {
    const codes = p.codes.map(code => {
      const counts = exams.map(e => e.codes[code] || 0);
      return { code, name: CODE_NAMES[code], counts, avg: avg(counts) };
    });
    const counts = exams.map((_, i) => codes.reduce((n, c) => n + c.counts[i], 0));
    const a = avg(counts);
    const pct = subjectAvg[p.subject] ? (a / subjectAvg[p.subject]) * 100 : 0;
    return { ...p, codes, counts, avg: a, pct, share: totalAvg ? (a / totalAvg) * 100 : 0, level: levelOf(pct) };
  });
  return { exams: exams.map(e => e.label), parts };
}

export const fmtNum = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
