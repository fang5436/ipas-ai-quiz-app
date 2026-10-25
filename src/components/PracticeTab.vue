<template>
  <div class="animate-fade-in flex flex-col gap-4 pt-2">

    <!-- =================【選單】=================
         view="practice"：練習題＋練習題錯題＋累積弱點；view="exam-wrong"：模擬考錯題
         兩種都放在「全真模擬考」頁裡，按「返回」回到模擬考選單 -->
    <template v-if="!session">
      <button @click="emit('back')" class="self-start text-xs text-slate-400 hover:text-slate-200">← 返回全真模擬考</button>

      <!-- 🆕 暫停中的練習：按「暫停」時保存，關掉 App 也不會消失 -->
      <div v-if="pausedSession" class="flex flex-col gap-3 bg-amber-950/30 border border-amber-800/60 rounded-xl px-4 py-3.5">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-amber-300">⏸️ 暫停中的練習｜{{ pausedSession.title }}</span>
          <span class="text-xs text-slate-400">已答 {{ pausedSession.answered }} / {{ pausedSession.items.length }} 題｜答對 {{ pausedSession.correctCount }}｜暫停於 {{ formatPausedDate(pausedSession.savedAt) }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="resumePaused" class="btn-primary flex-1 py-2 text-sm">▶ 繼續作答</button>
          <button @click="discardPaused" class="px-3 py-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/30 text-xs font-bold transition">放棄這份</button>
        </div>
      </div>

      <template v-if="view === 'exam-wrong'">
        <div class="bg-gradient-to-br from-rose-900/30 to-slate-900 border border-rose-800/40 rounded-2xl p-5 flex flex-col gap-1.5">
          <h2 class="text-lg font-bold text-white">🔁 模擬考錯題</h2>
          <p class="text-slate-400 text-xs leading-relaxed">「全真模擬考」與「歷屆考古題」交卷時答錯的官方考古題（這個功能加入之後才開始記錄）。練習題的錯題分開放在「練習題」裡。</p>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-bold text-slate-200">錯題複習</h3>
            <span class="text-[11px] text-slate-500">同一題連續答對 {{ REMOVE_STREAK }} 次才移出</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center">
            <div class="text-[11px] text-slate-400">模擬考錯題</div>
            <div class="text-xl font-black text-rose-400">{{ wrongStats.exam }}</div>
          </div>
          <button @click="startReview('exam')" :disabled="wrongStats.exam === 0" class="btn-primary !bg-rose-600 hover:!bg-rose-500">開始複習模擬考錯題</button>
        </div>
      </template>

      <template v-else>
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
          <h3 class="text-sm font-bold text-slate-200">練習題錯題</h3>
          <span class="text-[11px] text-slate-500">同一題連續答對 {{ REMOVE_STREAK }} 次才移出</span>
        </div>
        <div class="bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-center">
          <div class="text-[11px] text-slate-400">練習題錯題</div>
          <div class="text-xl font-black text-rose-400">{{ wrongStats.practice }}</div>
        </div>
        <button @click="startReview('practice')" :disabled="wrongStats.practice === 0" class="btn-primary !bg-rose-600 hover:!bg-rose-500">開始複習練習題錯題</button>
        <p class="text-[11px] text-slate-500 leading-relaxed">模擬考（官方考古題）的錯題分開放在全真模擬考的「模擬考錯題」。</p>
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
        <div class="flex gap-2">
          <button @click="pauseSession()" class="btn-secondary py-1.5 px-2.5 text-xs border-amber-900/50 text-amber-400 hover:bg-amber-950/20">⏸️ 暫停</button>
          <button @click="endSession" class="btn-secondary py-1.5 px-2.5 text-xs">結束</button>
        </div>
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
        <button @click="backToMenu" class="btn-primary">{{ view === 'exam-wrong' ? '回到模擬考錯題' : '回到練習題選單' }}</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { loadWrongBook, recordWrongAnswer, recordWrongBookCorrect, removeFromWrongBook } from '../utils/wrongBook.js';
import { loadCodeStats, clearCodeStats } from '../utils/answerStats.js';
import { CODE_NAMES } from '../data/codeNames.js';

const props = defineProps({
  // 官方考古題（App.vue 的 allQuestions），錯題複習時用 id 查回原題
  questions: { type: Array, default: () => [] },
  // 'practice'：練習題＋練習題錯題＋累積弱點；'exam-wrong'：模擬考錯題
  view: { type: String, default: 'practice' },
});
const emit = defineEmits(['back']);

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
  pausedSession.value = loadPaused();
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

// kind：'exam' 只出模擬考（官方考古題）錯題；'practice' 只出練習題錯題。兩者共用同一份錯題本，用題目 id 區分
const startReview = (kind) => {
  const lookup = kind === 'practice' ? practiceById.value : examById.value;
  const items = fisherYates(wrongBook.value)
    .map(entry => {
      const q = lookup.get(entry.id);
      if (!q) return null;
      return { ...toItem(q, kind === 'practice'), streak: entry.correctStreak ?? 0 };
    })
    .filter(Boolean)
    .slice(0, ROUND_SIZE);
  if (items.length === 0) return;
  startSession('review', kind === 'practice' ? '練習題錯題複習' : '模擬考錯題複習', items);
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
  // 從暫停紀錄繼續的那一份已經做完或結束，暫停紀錄不再需要
  if (pausedSession.value && session.value?.pauseId === pausedSession.value.id) removePaused();
  session.value = null;
  finished.value = false;
  refreshRecords();
};

// =================【🆕 暫停功能：做到一半先離開，作答進度存在 localStorage，關掉 App 也不會消失】=================
// 「練習題」與「模擬考錯題」各保留一份；題目與選項順序整份照存，繼續作答時原樣還原
const pausedKey = computed(() => `ipas_practice_paused_v1_${props.view}`);
const pausedSession = ref(null);

const loadPaused = () => {
  try {
    const raw = localStorage.getItem(pausedKey.value);
    const slot = raw ? JSON.parse(raw) : null;
    return slot && Array.isArray(slot.items) && slot.items.length > 0 ? slot : null;
  } catch { return null; }
};

const removePaused = () => {
  pausedSession.value = null;
  try { localStorage.removeItem(pausedKey.value); } catch { /* 無法存取時只清畫面狀態 */ }
};

// silent：自動暫停（切換分頁、App 被收到背景）時不跳確認視窗；已有另一份暫停紀錄時不覆蓋，避免蓋掉它
const pauseSession = (silent = false) => {
  const s = session.value;
  if (!s) return;
  if (silent && (finished.value || s.answered === 0)) return; // 還沒作答或已經做完，不用自動存
  const sameSlot = pausedSession.value && s.pauseId === pausedSession.value.id;
  if (pausedSession.value && !sameSlot) {
    if (silent) return;
    if (!confirm('已經有一份暫停中的練習，要用目前這份取代它嗎？（舊的那份會被放棄）')) return;
  }
  const id = sameSlot ? pausedSession.value.id : Date.now();
  const slot = { ...JSON.parse(JSON.stringify(s)), id, pauseId: id, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(pausedKey.value, JSON.stringify(slot));
  } catch (e) {
    console.error('暫停儲存失敗：', e);
    if (!silent) alert('⚠️ 瀏覽器無法儲存暫停內容，請繼續作答或直接結束。');
    return;
  }
  pausedSession.value = slot;
  if (silent) { s.pauseId = id; return; } // 自動存檔：畫面留在原題，回來可以直接接著做
  session.value = null;
  finished.value = false;
  refreshRecords();
};

const resumePaused = () => {
  const slot = pausedSession.value;
  if (!slot) return;
  if (session.value && !confirm('目前的練習會被放棄，確定要改做暫停中的那一份嗎？')) return;
  const { id, savedAt, ...rest } = JSON.parse(JSON.stringify(slot));
  session.value = { ...rest, pauseId: id };
  finished.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 切到別的分頁（元件被卸載）或手機把 App 收到背景時，自動存一份，回來可以從「暫停中的練習」繼續
const onHidden = () => { if (document.visibilityState === 'hidden') pauseSession(true); };
onMounted(() => document.addEventListener('visibilitychange', onHidden));
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onHidden);
  pauseSession(true);
});

const discardPaused = () => {
  if (!pausedSession.value) return;
  if (!confirm('確定要放棄這份暫停中的練習嗎？作答進度會被清除，無法復原。')) return;
  removePaused();
};

const formatPausedDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
