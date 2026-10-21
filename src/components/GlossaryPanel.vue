<template>
  <div ref="panelEl" class="bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-800/40 rounded-2xl p-4 flex flex-col gap-3 scroll-mt-20">
    <button @click="open = !open" class="flex items-center justify-between gap-3 text-left">
      <span class="flex flex-col gap-0.5">
        <span class="text-lg font-bold text-white">🧭 觀念圖鑑</span>
        <span class="text-xs text-slate-400">組合觀念課第二～四篇、第六篇的 {{ itemCount }} 個方法、模型與技巧：白話、例子、什麼時候用、考古題</span>
      </span>
      <span class="text-slate-400 text-xs shrink-0">{{ open ? '收合 ▲' : '展開 ▼' }}</span>
    </button>

    <div v-if="open" class="flex flex-col gap-4 animate-fade-in" @click="onContentClick">
      <!-- 分組捷徑 -->
      <div class="flex flex-col gap-1.5">
        <div v-for="p in parts" :key="p.no" class="flex flex-wrap items-center gap-1.5">
          <span class="text-[11px] font-bold text-slate-400 w-12 shrink-0">{{ PART_NAMES[p.no] }}</span>
          <button v-for="g in p.groups" :key="g.key" @click.stop="jump(g.key)" class="text-[11px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-600"><span class="font-mono text-slate-500 mr-1">{{ g.lesson }}</span>{{ g.group.split('（')[0] }}</button>
        </div>
      </div>

      <div v-for="p in parts" :key="p.no" class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-800 pb-1.5">
          <span class="text-sm font-bold text-white">{{ PART_NAMES[p.no] }}　{{ p.title }}</span>
          <span v-if="p.ratio" class="text-[11px] px-1.5 py-0.5 rounded border" :class="LEVEL_STYLE[p.ratio.level].badge">📊 每次約 {{ fmtNum(p.ratio.avg) }} 題・占科目{{ p.ratio.subject === 1 ? '一' : '二' }} {{ Math.round(p.ratio.pct) }}%</span>
        </div>

      <section v-for="g in p.groups" :key="g.key" :ref="el => groupEls[g.key] = el" class="flex flex-col gap-2 scroll-mt-20">
        <h4 class="text-sm font-bold text-emerald-300"><span class="font-mono text-xs text-slate-500 mr-1.5">{{ g.lesson }}</span>{{ g.group }}</h4>
        <p class="text-xs text-slate-400 leading-relaxed" v-html="fmt(g.intro)"></p>

        <div v-for="it in g.items" :key="it.term" class="bg-slate-950 border rounded-xl" :class="openItem === g.key + it.term ? 'border-emerald-700' : 'border-slate-800'">
          <button @click.stop="toggle(g.key + it.term)" class="w-full text-left p-3 flex items-start justify-between gap-2">
            <span class="flex flex-col gap-1 min-w-0">
              <span class="text-sm font-bold text-slate-100">{{ it.name }}</span>
              <span class="text-xs text-slate-400 leading-relaxed"><span class="text-slate-500">什麼時候用：</span>{{ plainText(it.when) }}</span>
            </span>
            <span class="text-slate-500 text-xs shrink-0 pt-0.5">{{ openItem === g.key + it.term ? '▲' : '▼' }}</span>
          </button>

          <div v-if="openItem === g.key + it.term"class="border-t border-slate-800 px-3 py-3 flex flex-col gap-2.5 text-xs leading-relaxed animate-fade-in">
            <div v-for="f in FIELDS" :key="f.key">
              <span class="font-bold" :class="f.color">{{ f.label }}</span>
              <p class="text-slate-300 mt-0.5" v-html="fmt(it[f.key], it.term)"></p>
            </div>
            <div v-if="it.exams.length">
              <span class="font-bold text-teal-400">考古題怎麼考</span>
              <ul class="mt-1 flex flex-col gap-1.5">
                <li v-for="e in it.exams" :key="e.q" class="text-slate-300">
                  <button type="button" :data-qid="e.q" class="font-mono text-teal-400 underline mr-1.5">{{ e.q }}</button><span v-html="fmt(e.note, it.term)"></span>
                </li>
              </ul>
            </div>
            <button type="button" :data-term="it.term" class="btn-secondary text-xs self-start">📖 看「{{ it.name.split('（')[0] }}」的名詞卡</button>
          </div>
        </div>
      </section>
      </div>
    </div>

    <InfoPopup :question="popup?.question" :term="popup?.term" @close="popup = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import InfoPopup from './InfoPopup.vue';
import { fmt, clickTarget, loadTermMap } from '../utils/lessonText.js';
import { examStats, PARTS, PART_NAMES, LEVEL_STYLE, fmtNum } from '../utils/examStats.js';

const props = defineProps({ questions: { type: Array, default: () => [] } });

const FIELDS = [
  { key: 'plain', label: '白話是什麼', color: 'text-emerald-400' },
  { key: 'example', label: '舉個例子', color: 'text-sky-400' },
  { key: 'when', label: '什麼時候用', color: 'text-violet-400' },
  { key: 'avoid', label: '不適合／常見陷阱', color: 'text-rose-400' },
  { key: 'keywords', label: '題目關鍵字', color: 'text-amber-400' },
];

const groups = ref([]);
const open = ref(false);
const openItem = ref(null);
const popup = ref(null);
const panelEl = ref(null);
const groupEls = {};

onMounted(async () => {
  // 圖鑑資料放在 src/data/lessons/ 子資料夾，避開題庫的 ./data/*.json 載入
  const mod = await import('../data/lessons/glossary.json');
  groups.value = mod.default || mod;
});

const itemCount = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0));

// 依篇分組，每篇附上近兩屆出題比例
const parts = computed(() => {
  const ratio = Object.fromEntries(examStats(props.questions).parts.map(p => [p.no, p]));
  return PARTS
    .map(p => ({
      no: p.no,
      title: p.title,
      ratio: ratio[p.no],
      groups: groups.value.filter(g => g.part === p.no).map((g, i) => ({ ...g, key: `${g.lesson}-${i}` })),
    }))
    .filter(p => p.groups.length);
});
const questionById = computed(() => new Map(props.questions.map(q => [String(q.id), q])));
const plainText = (s) => String(s).replace(/\*\*/g, '');

const toggle = (id) => { openItem.value = openItem.value === id ? null : id; };
const jump = async (key) => { await nextTick(); groupEls[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

// 點題號看原題，點名詞看名詞卡
const onContentClick = async (e) => {
  const hit = clickTarget(e);
  if (!hit) return;
  if (hit.qid) {
    const q = questionById.value.get(hit.qid);
    if (q) popup.value = { question: q };
  } else {
    const t = (await loadTermMap()).get(hit.term);
    if (t) popup.value = { term: t };
  }
};
</script>
