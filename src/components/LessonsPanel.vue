<template>
  <div ref="panelEl" class="bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-800/40 rounded-2xl p-4 flex flex-col gap-3 scroll-mt-20">

    <!-- 課程列表 -->
    <template v-if="!current">
      <button @click="listOpen = !listOpen" class="flex items-center justify-between gap-3 text-left">
        <span class="flex flex-col gap-0.5">
          <span class="text-lg font-bold text-white">📚 組合觀念課</span>
          <span class="text-xs text-slate-400">{{ lessons.length }} 課：全貌圖、對照表、分辨口訣、考古題實例、常見陷阱</span>
        </span>
        <span class="text-slate-400 text-xs shrink-0">{{ listOpen ? '收合 ▲' : '展開 ▼' }}</span>
      </button>
      <div v-if="listOpen" class="flex flex-col gap-3 animate-fade-in">
        <div v-for="part in parts" :key="part.no" class="flex flex-col gap-1.5">
          <span class="text-xs font-bold" :class="part.no <= 4 ? 'text-violet-400' : 'text-indigo-400'">{{ part.title }}</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <button v-for="l in part.lessons" :key="l.id" @click="openLesson(l)" class="text-left bg-slate-950 border border-slate-800 hover:border-indigo-600 rounded-xl px-3 py-2 text-sm text-slate-200 transition">
              <span class="font-mono text-xs text-slate-500 mr-1.5">{{ l.id }}</span>{{ l.title }}<span v-if="l.star" class="text-amber-400 ml-1">★</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- 單課內容 -->
    <template v-else>
      <div class="flex items-center justify-between gap-2">
        <button @click="closeLesson" class="btn-secondary py-1.5 px-2.5 text-xs">← 課程列表</button>
        <span class="text-[11px] text-slate-500 truncate">{{ current.partTitle.split('（')[0] }}</span>
      </div>
      <h3 class="text-base font-bold text-white"><span class="font-mono text-indigo-400 mr-1.5">{{ current.id }}</span>{{ current.title }}<span v-if="current.star" class="text-amber-400 ml-1">★</span></h3>

      <div class="flex flex-col gap-4" @click="onContentClick">
        <section v-for="(sec, si) in current.sections" :key="si" class="flex flex-col gap-2">
          <h4 class="text-sm font-bold text-indigo-300">{{ sec.heading }}</h4>
          <template v-for="(b, bi) in sec.blocks" :key="bi">

            <!-- 全貌圖：拆成可換行的階層清單 -->
            <div v-if="b.type === 'tree'" class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col">
              <div v-for="(line, li) in treeLines(b.lines)" :key="li" class="text-xs leading-relaxed flex" :class="line.depth === 0 && !line.cont ? 'text-slate-100 font-semibold py-0.5' : 'text-slate-300'">
                <!-- 每一層一條垂直導引線，看得出誰是誰的子項目 -->
                <span v-for="g in Math.max(line.depth - 1, 0)" :key="g" class="w-3.5 shrink-0 border-l border-slate-700 ml-1"></span>
                <span v-if="line.branch" class="w-4 shrink-0 ml-1 py-0.5" :class="line.depth === 1 ? 'text-indigo-400' : 'text-teal-400'">{{ MARKERS[Math.min(line.depth, 3)] }}</span>
                <span v-else-if="line.cont" class="w-4 shrink-0 ml-1 border-l border-slate-700" :class="line.depth === 0 ? 'opacity-0' : ''"></span>
                <span class="py-0.5 min-w-0" :class="line.cont ? 'text-slate-400' : ''" v-html="fmt(line.text)"></span>
              </div>
            </div>

            <!-- 表格：寬螢幕用表格，手機改成卡片 -->
            <template v-else-if="b.type === 'table'">
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-xs border-collapse">
                  <thead><tr><th v-for="(h, hi) in b.header" :key="hi" class="text-left font-semibold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1.5">{{ h }}</th></tr></thead>
                  <tbody><tr v-for="(r, ri) in b.rows" :key="ri"><td v-for="(c, ci) in r" :key="ci" class="align-top border border-slate-800 px-2 py-1.5 leading-relaxed" :class="ci === 0 ? 'text-slate-100 font-semibold' : 'text-slate-300'" v-html="fmt(c)"></td></tr></tbody>
                </table>
              </div>
              <div class="md:hidden flex flex-col gap-2">
                <div v-for="(r, ri) in b.rows" :key="ri" class="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 text-xs leading-relaxed">
                  <span class="text-sm font-bold text-slate-100" v-html="fmt(r[0])"></span>
                  <div v-for="(c, ci) in r.slice(1)" :key="ci">
                    <span class="text-slate-500">{{ b.header[ci + 1] }}：</span><span class="text-slate-300" v-html="fmt(c)"></span>
                  </div>
                </div>
              </div>
            </template>

            <ul v-else-if="b.type === 'list'" class="flex flex-col gap-1.5 text-xs leading-relaxed text-slate-300 list-disc pl-5">
              <li v-for="(it, ii) in b.items" :key="ii" v-html="fmt(it)"></li>
            </ul>

            <p v-else class="text-xs text-slate-400 leading-relaxed" v-html="fmt(b.text)"></p>
          </template>
        </section>
      </div>

      <p class="text-[11px] text-slate-500">點題號可以看原題、選項與正解。</p>
      <div class="grid grid-cols-2 gap-2">
        <button @click="step(-1)" :disabled="index === 0" class="btn-secondary text-xs">← 上一課</button>
        <button @click="step(1)" :disabled="index === lessons.length - 1" class="btn-primary text-xs">下一課 →</button>
      </div>
    </template>

    <!-- 原題彈出視窗：移到 body 底下，避免外層動畫的 transform 讓 fixed 定位失效 -->
    <Teleport to="body">
    <div v-if="popup" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" @click.self="popup = null">
      <div class="w-full max-w-2xl max-h-[85dvh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/40">{{ popup.source }}・{{ popup.id }}</span>
          <button @click="popup = null" class="btn-secondary py-1 px-2.5 text-xs">關閉</button>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">{{ popup.question }}</p>
        <div class="flex flex-col gap-1.5">
          <div v-for="(o, oi) in popup.options" :key="oi" class="text-xs leading-relaxed rounded-lg border px-3 py-2" :class="oi === popup.correctIndex ? 'bg-green-950/40 border-green-700 text-green-200' : 'border-slate-800 text-slate-400'">{{ o }}</div>
        </div>
        <p v-if="popup.explanation" class="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{{ popup.explanation }}</p>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({ questions: { type: Array, default: () => [] } });

const lessons = ref([]);
const listOpen = ref(false);
const current = ref(null);
const popup = ref(null);
const panelEl = ref(null);

onMounted(async () => {
  // 課程資料放在 src/data/lessons/ 子資料夾，避開題庫的 ./data/*.json 載入
  const mod = await import('../data/lessons/lessons.json');
  lessons.value = mod.default || mod;
});

const parts = computed(() => {
  const byPart = {};
  lessons.value.forEach(l => { (byPart[l.part] = byPart[l.part] || { no: l.part, title: l.partTitle.split('（')[0], lessons: [] }).lessons.push(l); });
  return Object.values(byPart).sort((a, b) => a.no - b.no);
});
const index = computed(() => lessons.value.indexOf(current.value));
const questionById = computed(() => new Map(props.questions.map(q => [String(q.id), q])));

const scrollToPanel = async () => { await nextTick(); panelEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
const openLesson = (l) => { current.value = l; scrollToPanel(); };
const closeLesson = () => { current.value = null; listOpen.value = true; scrollToPanel(); };
const step = (d) => { current.value = lessons.value[index.value + d]; scrollToPanel(); };

// ASCII 全貌圖 → 每行一個項目：依前面的 │ ├ └ 判斷層級，長線改成短箭頭，手機上可自動換行
// 階層依「分支符號在第幾格」判斷：比上一層的分支更靠右，就是它的子項目
// （不能只數 │，因為最後一個分支 └ 底下的子項目前面是空白，沒有 │）
// 沒有分支符號但有縮排的行，是上一個項目的補充說明
const treeLines = (lines) => {
  const stack = [];
  let prev = 0;
  return lines.filter(l => l.replace(/[│\s]/g, '')).map(raw => {
    const m = raw.match(/^([\s│]*)([├└]─*\s*)?(.*)$/);
    const branch = !!m[2];
    const cont = !branch && m[1].length > 0;
    let depth = 0;
    if (branch) {
      while (stack.length && stack[stack.length - 1] >= m[1].length) stack.pop();
      stack.push(m[1].length);
      depth = stack.length;
    } else if (cont) {
      depth = prev;
    } else {
      stack.length = 0;
    }
    if (!cont) prev = depth;
    const text = m[3].replace(/\s*─+→\s*/g, ' → ').replace(/─{2,}/g, ' ').replace(/\s{2,}/g, ' ').trim();
    return { depth, branch, cont, text };
  });
};
const MARKERS = ['', '▸', '◦', '·'];

// 文字格式：粗體、換行、題號可點
const fmt = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/&lt;br&gt;/g, '<br>')
  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
  .replace(/\b(1[01][45]0[1-4][12]\d{3})\b/g, '<button type="button" data-qid="$1" class="font-mono text-teal-400 underline">$1</button>');

const onContentClick = (e) => {
  const qid = e.target?.dataset?.qid;
  if (!qid) return;
  const q = questionById.value.get(qid);
  if (q) popup.value = q;
};
</script>
