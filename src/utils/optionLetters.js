// 解說裡用 A/B/C/D 指稱選項的題目（例如「(A) 是半監督式學習；(D) 無標籤進行分群」），
// 選項一打亂，解說的字母就跟畫面上的選項對不起來（2026-10-27 Fang 在模擬考發現，考古題約 13 題）。
// 這類題目一律維持官方原本的選項順序；其他題目照常打亂。
// 判斷規則：前後都不是英數字或 * 的單一 A～D（避免 API、BERT、2D、A* 演算法被誤認）。
// 「類別A」「模型A」這類不是在講選項的字母也會被算進去，只是那幾題不打亂，不影響正確性。
const OPTION_LETTER_RE = /(^|[^A-Za-z0-9*])[A-D](?![A-Za-z0-9*])/;

export const mentionsOptionLetters = (explanation) => OPTION_LETTER_RE.test(String(explanation || ''));
