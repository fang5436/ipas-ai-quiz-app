// 組合觀念課與圖鑑共用的文字格式：粗體、換行、題號與專有名詞變成可點的按鈕
// 名詞對照表由 term-aliases.json 提供（只收課程裡實際出現、人工看過的名詞）
import aliases from '../data/lessons/term-aliases.json';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ASCII_WORD = /[A-Za-z0-9]/;

// 長的先比對：「k-fold 交叉驗證」整段連到同一張卡，不會被拆成「交叉驗證」
const keys = Object.keys(aliases).map(esc).sort((a, b) => b.length - a.length);
const termRe = new RegExp(keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
const termOf = new Map(Object.keys(aliases).map(k => [esc(k), aliases[k]]));

export const fmt = (s, skipTerm = null) => esc(String(s))
  .replace(termRe, (m, offset, str) => {
    // 英文名詞前後還連著英數字，代表是別的字的一部分（例如 SVM 裡的 VM）
    if (ASCII_WORD.test(m[0]) && ASCII_WORD.test(str[offset - 1] || '')) return m;
    if (ASCII_WORD.test(m[m.length - 1]) && ASCII_WORD.test(str[offset + m.length] || '')) return m;
    const id = termOf.get(m);
    if (id === skipTerm) return m;
    return `<button type="button" data-term="${id}" class="term-link">${m}</button>`;
  })
  .replace(/&lt;br&gt;/g, '<br>')
  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
  .replace(/\b(1[01][45]0[1-4][12]\d{3})\b/g, '<button type="button" data-qid="$1" class="font-mono text-teal-400 underline">$1</button>');

// 點擊委派：回傳被點的是題號還是名詞
export const clickTarget = (e) => {
  const el = e.target?.closest?.('[data-qid], [data-term]');
  if (!el) return null;
  return el.dataset.qid ? { qid: el.dataset.qid } : { term: el.dataset.term };
};

let termMapPromise = null;
export const loadTermMap = () => {
  if (!termMapPromise) {
    termMapPromise = import('../data/terms/terms.json').then(m => new Map((m.default || m).map(t => [t.id, t])));
  }
  return termMapPromise;
};
