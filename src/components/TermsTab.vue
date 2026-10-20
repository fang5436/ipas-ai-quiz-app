<template>
  <div class="animate-fade-in flex flex-col gap-4 pt-2">

    <LessonsPanel :questions="questions" />

    <div class="bg-gradient-to-br from-teal-900/30 to-slate-900 border border-teal-800/40 rounded-2xl p-5 flex flex-col gap-1.5">
      <h2 class="text-lg font-bold text-white">📖 名詞卡</h2>
      <p class="text-slate-400 text-xs leading-relaxed">{{ terms.length }} 張名詞卡，涵蓋 {{ questionCount }} 題考古題中出現的專有名詞，依官方評鑑範圍分組。看到不熟的名詞點 ⭐，就會收進「不熟」清單。</p>
    </div>

    <!-- 搜尋與篩選 -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      <div class="relative">
        <input v-model="keyword" type="search" placeholder="搜尋名詞，例如 RAG、幻覺、均方誤差" class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-600 select-text" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="f in FILTERS" :key="f.key" @click="filter = f.key" class="rounded-xl border px-1 py-2 flex flex-col items-center gap-0.5 transition" :class="filter === f.key ? 'bg-teal-900/50 border-teal-600 text-teal-100' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'">
          <span class="text-xs font-bold">{{ f.label }}</span>
          <span class="text-[10px] text-slate-400">{{ filterCount(f.key) }} 張</span>
        </button>
      </div>
    </div>

    <p v-if="!groups.length" class="text-xs text-slate-500 text-center py-6">{{ filter === 'star' && !keyword ? '還沒有標記不熟的名詞。在卡片右上角點 ⭐ 就會收進這裡。' : '找不到符合的名詞。' }}</p>

    <!-- 依官方評鑑代碼分組 -->
    <div v-for="group in groups" :key="group.code" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button @click="toggleGroup(group.code)" class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-800/40 transition">
        <span class="text-sm text-slate-200 min-w-0"><span class="font-mono text-xs mr-1.5" :class="group.code.startsWith('L11') ? 'text-violet-400' : 'text-indigo-400'">{{ group.code }}</span>{{ CODE_NAMES[group.code] }}</span>
        <span class="flex items-center gap-2 shrink-0">
          <span class="text-[11px] text-slate-500">{{ group.items.length }} 張</span>
          <span class="text-slate-500 text-xs">{{ isOpen(group.code) ? '▲' : '▼' }}</span>
        </span>
      </button>

      <div v-if="isOpen(group.code)" class="flex flex-col gap-2 px-3 pb-3">
        <div v-for="term in group.items" :key="term.id" class="bg-slate-950 border rounded-xl" :class="openTerm === group.code + term.id ? 'border-teal-700' : 'border-slate-800'">
          <div class="flex items-start gap-2 p-3">
            <button @click="toggleTerm(group.code + term.id)" class="flex-1 min-w-0 text-left flex flex-col gap-1">
              <span class="text-sm font-bold text-slate-100">{{ term.name }}</span>
              <span class="text-xs text-slate-400 leading-relaxed">{{ term.oneLiner }}</span>
              <span class="flex flex-wrap gap-1.5 mt-0.5">
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">考古題 {{ freq[term.id] || 0 }} 題</span>
                <span v-if="term.status !== '已查證'" class="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400">{{ term.status }}</span>
              </span>
            </button>
            <button @click="toggleStar(term.id)" class="text-lg leading-none p-1 shrink-0" :class="stars.has(term.id) ? '' : 'grayscale opacity-40'" :aria-label="stars.has(term.id) ? '移出不熟清單' : '加入不熟清單'">⭐</button>
          </div>

          <div v-if="openTerm === group.code + term.id" class="border-t border-slate-800 px-3 py-3 flex flex-col gap-2.5 text-xs leading-relaxed animate-fade-in">
            <div v-for="f in DETAIL_FIELDS" :key="f.key" v-show="term[f.key]">
              <span class="font-bold" :class="f.color">{{ f.label }}</span>
              <p class="text-slate-300 mt-0.5">{{ term[f.key] }}</p>
            </div>
            <div>
              <span class="font-bold text-slate-500">出處</span>
              <ul class="mt-0.5 flex flex-col gap-1">
                <li v-for="(s, i) in term.sources" :key="i" class="text-[11px] text-slate-500 break-all">
                  <template v-if="splitSource(s).url">{{ splitSource(s).label }}：<a :href="splitSource(s).url" target="_blank" rel="noopener" class="text-teal-500 underline">連結</a></template>
                  <template v-else>{{ s }}</template>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { CODE_NAMES } from '../data/codeNames.js';
import LessonsPanel from './LessonsPanel.vue';

defineProps({ questions: { type: Array, default: () => [] } });

const STAR_KEY = 'ipas_term_stars_v1';
const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'sub1', label: '科目一' },
  { key: 'sub2', label: '科目二' },
  { key: 'star', label: '⭐ 不熟' },
];
const DETAIL_FIELDS = [
  { key: 'analogy', label: '生活比喻', color: 'text-sky-400' },
  { key: 'useCases', label: '使用情境', color: 'text-emerald-400' },
  { key: 'distinguish', label: '和相近名詞的差別', color: 'text-amber-400' },
  { key: 'trap', label: '考題陷阱', color: 'text-rose-400' },
];

const terms = ref([]);
const freq = ref({});
const questionCount = ref(0);
const keyword = ref('');
const filter = ref('all');
const openGroups = ref(new Set());
const openTerm = ref(null);
const stars = ref(new Set());

onMounted(async () => {
  // 名詞卡放在 src/data/terms/ 子資料夾，避開題庫的 ./data/*.json 載入
  const [termsMod, mapMod] = await Promise.all([
    import('../data/terms/terms.json'),
    import('../data/terms/question-terms.json'),
  ]);
  terms.value = termsMod.default || termsMod;
  const mapping = mapMod.default || mapMod;
  const counts = {};
  Object.values(mapping).forEach(ids => ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; }));
  freq.value = counts;
  questionCount.value = Object.values(mapping).filter(ids => ids.length).length;
  try {
    stars.value = new Set(JSON.parse(localStorage.getItem(STAR_KEY) || '[]'));
  } catch { stars.value = new Set(); }
});

const inFilter = (term, key) => {
  if (key === 'sub1') return term.units.some(u => u.startsWith('L11'));
  if (key === 'sub2') return term.units.some(u => u.startsWith('L12'));
  if (key === 'star') return stars.value.has(term.id);
  return true;
};
const filterCount = (key) => terms.value.filter(t => inFilter(t, key)).length;

const matchesKeyword = (term) => {
  const k = keyword.value.trim().toLowerCase();
  return !k || (term.name + term.oneLiner).toLowerCase().includes(k);
};

// 一張卡可能屬於多個評鑑代碼，每個代碼底下都會出現
const groups = computed(() => {
  const byCode = {};
  terms.value.filter(t => inFilter(t, filter.value) && matchesKeyword(t)).forEach(t => {
    t.units.forEach(code => {
      if (filter.value === 'sub1' && !code.startsWith('L11')) return;
      if (filter.value === 'sub2' && !code.startsWith('L12')) return;
      (byCode[code] = byCode[code] || []).push(t);
    });
  });
  return Object.keys(byCode).sort().map(code => ({ code, items: byCode[code] }));
});

// 有搜尋字或在「不熟」清單時全部展開，平常依使用者點選
const isOpen = (code) => keyword.value.trim() !== '' || filter.value === 'star' || openGroups.value.has(code);
const toggleGroup = (code) => {
  const s = new Set(openGroups.value);
  s.has(code) ? s.delete(code) : s.add(code);
  openGroups.value = s;
};
const toggleTerm = (key) => { openTerm.value = openTerm.value === key ? null : key; };

const toggleStar = (id) => {
  const s = new Set(stars.value);
  s.has(id) ? s.delete(id) : s.add(id);
  stars.value = s;
  try { localStorage.setItem(STAR_KEY, JSON.stringify([...s])); } catch { /* 無法儲存時仍可在本次使用 */ }
};

const splitSource = (s) => {
  const m = s.match(/^(.*?):\s*(https?:\/\/\S+)$/);
  return m ? { label: m[1], url: m[2] } : { label: s, url: null };
};
</script>
