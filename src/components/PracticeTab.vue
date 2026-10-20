<template>
  <div class="animate-fade-in flex flex-col gap-4 pt-2">

    <!-- =================【選單：練習題／錯題複習／累積弱點】================= -->
    <template v-if="!session">
      <div class="bg-gradient-to-br from-rose-900/30 to-slate-900 border border-rose-800/40 rounded-2xl p-5 flex flex-col gap-1.5">
        <h2 class="text-lg font-bold text-white">✍️ 練習題</h2>
        <p class="text-slate-400 text-xs leading-relaxed">方小瑋依官方評鑑範圍出的練習題（每題都對照名詞卡與考古題查證過），和 {{ questions.length }} 題官方考古題分開存放。每題作答後立即顯示對錯與解說；答錯的題目會記進錯題本。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <h3 class="text-sm font-bold text-slate-200">開始練習 <span class="text-[11px] font-normal text-slate-500">（出完所選範圍的全部題目，順序隨機；「全部」＝完整 50 題）</span></h3>
        <div v-for="subject in [1, 2]" :key="subject" class="flex flex-col gap-2">
          <span class="text-xs font-bold" :class="subject === 1 ? 'text-violet-400' : 'text-indigo-400'">{{ subject === 1 ? '📘 科目一：人工智慧基礎概論' : '📙 科目二：生成式 AI 應用與規劃' }}</span>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="t in LEVEL_OPTIONS" :key="t.key" @click="startPractice(subject, t.key)" :disabled="practiceCount(subject, t.key) === 0" class="btn-secondary !px-2 !py-2.5 flex flex-col items-center gap-0.5">
              <span class="text-xs font-bold" :class="LEVEL_TEXT[t.key]">{{ t.label }}</span>
              <span class="text-[10px] font-normal text-slate-400">{{ practiceCount(subject, t.key) }} 題</span>
            </button>
          </div>
        </div>
        <p class="text-[11px] text-slate-500 leading-relaxed">難度依考古題題型區分：易＝概念直問；中＝120 字以內的情境題；難＝超過 120 字、需同時判斷多個條件的情境題。比例參考 115 年第二、三次（易 10%、中 46%、難 44%）。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-bold text-slate-200">錯題複習</h3>
          <span class="text-[11px] text-slate-500">同一題連續答對 {{ REMOVE_STREAK }} 次才移出</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="bg-slate-950 border border-slate-800 rounded-xl py-2.5">
            <div class="text-[11px] text-slate-400">考古題錯題</div>
            <div class="text-xl font-black text-rose-400">{{ wrongStats.exam }}</div>
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl py-2.5">
            <div class="text-[11px] text-slate-400">練習題錯題</div>
            <div class="text-xl font-black text-rose-400">{{ wrongStats.practice }}</div>
          </div>
        </div>
        <button @click="startReview" :disabled="wrongStats.exam + wrongStats.practice === 0" class="btn-primary !bg-rose-600 hover:!bg-rose-500">開始錯題複習</button>
        <p class="text-[11px] text-slate-500 leading-relaxed">考古題錯題來自「全真模擬考」與「歷屆考古題」交卷時答錯的題目（這個功能加入之後才開始記錄）。</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-bold text-slate-200">累積弱點 <span class="text-[11px] font-normal text-slate-500">（模擬考＋考古題，依官方評鑑代碼）</span></h3>
          <button v-if="hasStats" @click="resetStats" class="text-[11px] text-slate-500 hover:text-red-400 underline shrink-0">清除</button>
        </div>
        <p v-if="!hasStats" class="text-xs text-slate-500 py-2">還沒有紀錄。交卷一次「全真模擬考」或「歷屆考古題」後，這裡會開始累積各代碼的答對率，答對率低的排在前面。</p>
        <div v-for="group in statsGroups" v-else :key="group.title" class="flex flex-col gap-1.5">
          <span class="text-xs font-bold" :class="group.colorClass">{{ group.title }}</span>
          <div v-for="row in group.rows" :key="row.code" class="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800/60 last:border-0">
            <span class="text-xs text-slate-300 min-w-0"><span class="text-slate-500 font-mono mr-1.5">{{ row.code }}</span>{{ row.name }}</span>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] text-slate-500">{{ row.correct }}/{{ row.total }}</span>
              <span class="w-10 text-right text-xs font-bold" :class="rateColor(row.rate)">{{ Math.round(row.rate * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- =================【作答中】================= -->
    <template v-else-if="!finished">
      <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3.5">
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded self-start" :class="session.mode === 'review' ? 'bg-rose-950 text-rose-400' : 'bg-violet-950 text-violet-400'">{{ session.title }}</span>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold text-violet-400">{{ session.idx + 1 }}</span>
            <span class="text-xs text-slate-500 font-medium">/ {{ session.items.length }}</span>
            <span class="text-xs text-slate-500 ml-2">答對 {{ session.correctCount }}</span>
          </div>
        </div>
        <button @click="endSession" class="btn-secondary py-1.5 px-2.5 text-xs">結束</button>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-violet-950 text-violet-400 text-[10px] font-medium border border-violet-900/40">{{ current.detail_code }} {{ CODE_NAMES[current.detail_code] || '' }}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-medium border" :class="current.isPractice ? LEVEL_BADGE[current.difficulty] : 'bg-emerald-950 text-emerald-400 border-emerald-900/40'">{{ current.badge }}</span>
          <span v-if="session.mode === 'review'" class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">連續答對 {{ current.streak }}/{{ REMOVE_STREAK }}</span>
        </div>
        <h2 class="text-base font-semibold text-slate-100 leading-relaxed mb-4">{{ current.question }}</h2>
        <div class="flex flex-col space-y-2.5">
          <button v-for="(option, idx) in current.options" :key="idx" @click="choose(idx)" :disabled="session.selected !== null" class="option-btn text-left" :class="optionClass(idx)">
            <div class="option-letter w-8 h-8 text-sm rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center font-bold shrink-0">{{ String.fromCharCode(65 + idx) }}</div>
            <div class="leading-relaxed text-sm font-medium">{{ option }}</div>
          </button>
        </div>
        <!-- 先選、再按確認才送出，避免誤觸；確認前可以改選 -->
        <button v-if="session.selected === null" @click="answer(session.pending)" :disabled="session.pending === null" class="btn-primary w-full mt-4">{{ session.pending === null ? '請先選擇答案' : '確認作答' }}</button>
        <div v-if="session.selected !== null" class="mt-4 animate-fade-in flex flex-col gap-3">
          <div class="p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap" :class="isCorrect ? 'bg-green-950/20 text-green-300 border-green-900/40' : 'bg-red-950/20 text-red-300 border-red-900/40'">
            <span class="font-bold block mb-1">{{ feedbackTitle }}</span>
            {{ current.explanation || '此題無解析。' }}
          </div>
          <button @click="next" class="btn-primary">{{ session.idx + 1 < session.items.length ? '下一題' : '看結果' }}</button>
        </div>
      </div>
    </template>

    <!-- =================【這一回結束】================= -->
    <template v-else>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center flex flex-col gap-3">
        <div class="text-4xl">{{ session.correctCount === session.answered ? '🎉' : '💪' }}</div>
        <h2 class="text-lg font-bold text-slate-100">{{ session.title }} 完成</h2>
        <p class="text-slate-400 text-sm">答對 {{ session.correctCount }} / {{ session.answered }} 題<span v-if="session.removed > 0">，{{ session.removed }} 題移出錯題本</span></p>
        <button @click="backToMenu" class="btn-primary">回到練習題選單</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { loadWrongBook, recordWrongAnswer, recordWrongBookCorrect, removeFromWrongBook } from '../utils/wrongBook.js';
import { loadCodeStats, clearCodeStats } from '../utils/answerStats.js';

const props = defineProps({
  // 官方考古題（App.vue 的 allQuestions），錯題複習時用 id 查回原題
  questions: { type: Array, default: () => [] },
});

const ROUND_SIZE = 20; // 錯題複習每回最多題數
const REMOVE_STREAK = 3;
const LEVEL_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: '易', label: '易' },
  { key: '中', label: '中' },
  { key: '難', label: '難' },
];
// 難度顏色：易＝藍、中＝黃、難＝紅
const LEVEL_TEXT = { '易': 'text-sky-400', '中': 'text-amber-400', '難': 'text-red-400' };
const LEVEL_BADGE = {
  '易': 'bg-sky-950 text-sky-400 border-sky-900/40',
  '中': 'bg-amber-950 text-amber-400 border-amber-900/40',
  '難': 'bg-red-950 text-red-400 border-red-900/40',
};

// 官方「評鑑內容範圍參考（115.02）」初級科目代碼名稱
const CODE_NAMES = {
  L11101: 'AI 的定義與分類',
  L11102: 'AI 治理概念',
  L11201: '資料基本概念與來源',
  L11202: '資料整理與分析流程',
  L11203: '資料隱私與安全',
  L11301: '機器學習基本原理',
  L11302: '常見的機器學習模型',
  L11401: '鑑別式 AI 與生成式 AI 的基本原理',
  L11402: '鑑別式 AI 與生成式 AI 的整合應用',
  L12101: 'No Code / Low Code 的基本概念',
  L12102: 'No Code / Low Code 的優勢與限制',
  L12201: '生成式 AI 應用領域與常見工具',
  L12202: '如何善用生成式 AI 工具',
  L12301: '生成式 AI 導入評估',
  L12302: '生成式 AI 導入規劃',
  L12303: '生成式 AI 風險管理',
};

const practiceQuestions = ref([]);
const wrongBook = ref([]);
const codeStats = ref({});
const session = ref(null);
const finished = ref(false);

onMounted(async () => {
  // 練習題放在 src/data/practice/ 子資料夾，不會被 App.vue 的 ./data/*.json 題庫載入誤收
  const mod = await import('../data/practice/practice.json');
  practiceQuestions.value = mod.default || mod;
  refreshRecords();
});

const refreshRecords = () => {
  wrongBook.value = loadWrongBook();
  codeStats.value = loadCodeStats();
};

const subjectPrefix = (subject) => (subject === 1 ? 'L11' : 'L12');

const filterPractice = (subject, level) => practiceQuestions.value.filter(q =>
  q.detail_code.startsWith(subjectPrefix(subject)) && (level === 'all' || q.difficulty === level));

const practiceCount = (subject, level) => filterPractice(subject, level).length;

const examById = computed(() => new Map(props.questions.map(q => [q.id, q])));
const practiceById = computed(() => new Map(practiceQuestions.value.map(q => [q.id, q])));

const wrongStats = computed(() => {
  let exam = 0;
  let practice = 0;
  wrongBook.value.forEach(item => {
    if (practiceById.value.has(item.id)) practice++;
    else if (examById.value.has(item.id)) exam++;
  });
  return { exam, practice };
});

const fisherYates = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatSourceBadge = (source) => {
  const CN = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
  const m = String(source || '').match(/^(\d+)年第([一二三四五六七八九十]+)次/);
  return m ? `${m[1]}-${CN[m[2]] ?? m[2]} 考古題` : (source || '考古題');
};

// 統一成作答用的格式：清掉 (A)(B) 前綴、選項洗牌並修正 correctIndex
const toItem = (q, isPractice) => {
  const cleanOpts = q.options.map(o => String(o).replace(/^\([A-D]\)\s*/i, '').trim());
  const correctText = cleanOpts[q.correctIndex];
  const options = fisherYates(cleanOpts);
  return {
    id: q.id,
    detail_code: q.detail_code,
    question: q.question,
    explanation: q.explanation,
    options,
    correctIndex: options.indexOf(correctText),
    isPractice,
    difficulty: q.difficulty,
    badge: isPractice ? `練習題・${q.difficulty}` : formatSourceBadge(q.source),
    streak: 0,
  };
};

const startSession = (mode, title, items) => {
  session.value = { mode, title, items, idx: 0, pending: null, selected: null, correctCount: 0, answered: 0, removed: 0, pendingRemove: false };
  finished.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const startPractice = (subject, level) => {
  const pool = fisherYates(filterPractice(subject, level));
  if (pool.length === 0) return;
  const levelLabel = level === 'all' ? '全部難度' : `難度${level}`;
  startSession('practice', `科目${subject === 1 ? '一' : '二'}・${levelLabel}`, pool.map(q => toItem(q, true)));
};

const startReview = () => {
  const items = fisherYates(wrongBook.value)
    .map(entry => {
      const practice = practiceById.value.get(entry.id);
      const exam = examById.value.get(entry.id);
      const q = practice || exam;
      if (!q) return null;
      return { ...toItem(q, Boolean(practice)), streak: entry.correctStreak ?? 0 };
    })
    .filter(Boolean)
    .slice(0, ROUND_SIZE);
  if (items.length === 0) return;
  startSession('review', '錯題複習', items);
};

const current = computed(() => session.value?.items[session.value.idx] || {});
const isCorrect = computed(() => session.value?.selected === current.value.correctIndex);

const feedbackTitle = computed(() => {
  if (!isCorrect.value) return session.value.mode === 'review' ? '❌ 答錯了，連續答對次數歸零' : '❌ 答錯了，已記進錯題本';
  if (session.value.mode !== 'review') return '✅ 答對了！';
  return current.value.streak >= REMOVE_STREAK ? `✅ 答對了！已連續答對 ${REMOVE_STREAK} 次，這題會移出錯題本` : `✅ 答對了！連續答對 ${current.value.streak}/${REMOVE_STREAK}`;
});

// 點選項只是暫選（可改選），按「確認作答」才呼叫 answer() 判定對錯
const choose = (idx) => {
  if (session.value.selected === null) session.value.pending = idx;
};

const answer = (idx) => {
  const s = session.value;
  if (s.selected !== null || idx === null) return;
  s.selected = idx;
  s.answered++;
  const item = current.value;
  if (idx === item.correctIndex) {
    s.correctCount++;
    if (s.mode === 'review') {
      const { streak, readyToRemove } = recordWrongBookCorrect(item.id);
      item.streak = streak;
      s.pendingRemove = readyToRemove;
    }
  } else {
    recordWrongAnswer(item.id);
    item.streak = 0;
  }
};

// 已連續答對達標的錯題，在離開這一題時才正式移除（與 wrongBook.js 的設計一致）
const flushPendingRemove = () => {
  const s = session.value;
  if (s?.pendingRemove) {
    removeFromWrongBook(current.value.id);
    s.removed++;
    s.pendingRemove = false;
  }
};

const next = () => {
  flushPendingRemove();
  const s = session.value;
  if (s.idx + 1 < s.items.length) {
    s.idx++;
    s.pending = null;
    s.selected = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    finished.value = true;
  }
};

const endSession = () => {
  flushPendingRemove();
  if (session.value.answered === 0) return backToMenu();
  finished.value = true;
};

const backToMenu = () => {
  session.value = null;
  finished.value = false;
  refreshRecords();
};

const optionClass = (idx) => {
  const s = session.value;
  if (s.selected === null) return s.pending === idx ? 'option-btn--selected' : 'hover:border-slate-600 hover:bg-slate-800/50';
  if (idx === current.value.correctIndex) return 'option-btn--correct';
  return s.selected === idx ? 'option-btn--wrong' : 'option-btn--dim';
};

const hasStats = computed(() => Object.keys(codeStats.value).length > 0);

const statsGroups = computed(() => [
  { title: '📘 科目一', prefix: 'L11', colorClass: 'text-violet-400' },
  { title: '📙 科目二', prefix: 'L12', colorClass: 'text-indigo-400' },
].map(g => ({
  ...g,
  rows: Object.entries(codeStats.value)
    .filter(([code, s]) => code.startsWith(g.prefix) && s.total > 0)
    .map(([code, s]) => ({ code, name: CODE_NAMES[code] || '', correct: s.correct, total: s.total, rate: s.correct / s.total }))
    .sort((a, b) => a.rate - b.rate || b.total - a.total),
})).filter(g => g.rows.length > 0));

const rateColor = (rate) => (rate >= 0.8 ? 'text-green-400' : rate >= 0.6 ? 'text-amber-400' : 'text-red-400');

const resetStats = () => {
  if (!confirm('確定要清除累積弱點紀錄嗎？（錯題本不受影響）')) return;
  clearCodeStats();
  refreshRecords();
};
</script>
