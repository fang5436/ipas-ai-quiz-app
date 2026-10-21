<template>
  <div v-if="stats.parts.length" class="bg-gradient-to-br from-rose-900/25 to-slate-900 border border-rose-800/40 rounded-2xl p-4 flex flex-col gap-3">
    <button @click="togglePanel" class="flex items-start justify-between gap-3 text-left">
      <span class="flex flex-col gap-1 min-w-0">
        <span class="text-lg font-bold text-white">📊 近兩屆出題比例</span>
        <span v-if="panelOpen" class="text-xs text-slate-400 leading-relaxed">{{ stats.exams.join('、') }}官方試題的平均題數。<span class="text-rose-300">紅色＝重點（占該科 25% 以上）</span>，越紅越該多花時間。點一篇可以看細項。</span>
        <!-- 收合時只列出重點篇 -->
        <span v-else class="flex flex-wrap gap-1.5">
          <span v-for="p in stats.parts.filter(x => x.level === 'high')" :key="p.no" class="text-[11px] px-1.5 py-0.5 rounded border" :class="LEVEL_STYLE.high.badge">{{ PART_NAMES[p.no] }} {{ fmtNum(p.avg) }} 題・{{ Math.round(p.pct) }}%</span>
        </span>
      </span>
      <span class="text-slate-400 text-xs shrink-0 pt-1">{{ panelOpen ? '收合 ▲' : '展開 ▼' }}</span>
    </button>

    <template v-if="panelOpen">
    <div v-for="subj in [1, 2]" :key="subj" class="flex flex-col gap-1.5">
      <span class="text-xs font-bold" :class="subj === 1 ? 'text-violet-400' : 'text-indigo-400'">科目{{ subj === 1 ? '一' : '二' }}（每次 50 題）</span>

      <div v-for="p in stats.parts.filter(x => x.subject === subj)" :key="p.no" class="bg-slate-950 border rounded-xl" :class="open === p.no ? 'border-slate-600' : 'border-slate-800'">
        <button @click="open = open === p.no ? null : p.no" class="w-full text-left px-3 py-2.5 flex flex-col gap-1.5">
          <span class="flex items-center justify-between gap-2">
            <span class="text-sm text-slate-100 min-w-0"><span class="font-bold mr-1">{{ PART_NAMES[p.no] }}</span>{{ p.title }}</span>
            <span class="text-[11px] px-1.5 py-0.5 rounded border shrink-0" :class="LEVEL_STYLE[p.level].badge">{{ LEVEL_STYLE[p.level].label }}</span>
          </span>
          <span class="h-2 rounded-full bg-slate-800 overflow-hidden">
            <span class="block h-full rounded-full" :class="LEVEL_STYLE[p.level].bar" :style="{ width: Math.min(p.pct, 100) + '%' }"></span>
          </span>
          <span class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-xs">
            <span class="text-slate-200"><span class="font-bold text-white">每次約 {{ fmtNum(p.avg) }} 題</span>・占科目{{ subj === 1 ? '一' : '二' }} {{ Math.round(p.pct) }}%</span>
            <span class="text-slate-500">準備時間建議約 {{ fmtNum(Math.round(p.share * 10) / 10) }}%</span>
          </span>
        </button>

        <div v-if="open === p.no" class="border-t border-slate-800 px-3 py-2.5 flex flex-col gap-1.5 animate-fade-in">
          <div class="grid grid-cols-[1fr_auto] gap-x-3 text-[11px] text-slate-500">
            <span>官方評鑑代碼</span><span class="text-right">{{ stats.exams.map(shortLabel).join('／') }}</span>
          </div>
          <div v-for="c in p.codes" :key="c.code" class="grid grid-cols-[1fr_auto] gap-x-3 items-baseline text-xs">
            <span class="text-slate-300 min-w-0"><span class="font-mono text-slate-500 mr-1">{{ c.code }}</span>{{ c.name }}</span>
            <span class="text-right text-slate-200 tabular-nums">{{ c.counts.join('／') }} 題</span>
          </div>
          <p v-if="swing(p)" class="text-[11px] text-amber-400/90 leading-relaxed">⚠ {{ swing(p) }}</p>
        </div>
      </div>
    </div>
    <p class="text-[11px] text-slate-500 leading-relaxed">「準備時間建議」是這一篇占兩科合計題數的比例；兩科各 50 題、分開計分，弱的那一科可以再多分一點時間。</p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { examStats, PART_NAMES, LEVEL_STYLE, fmtNum } from '../utils/examStats.js';

const props = defineProps({ questions: { type: Array, default: () => [] } });

const stats = computed(() => examStats(props.questions));
const open = ref(null);

// 預設收合；記住使用者上次的選擇（瀏覽器不能儲存時就每次收合）
const OPEN_KEY = 'ipas_ratio_panel_open_v1';
const readOpen = () => { try { return localStorage.getItem(OPEN_KEY) === '1'; } catch { return false; } };
const panelOpen = ref(readOpen());
const togglePanel = () => {
  panelOpen.value = !panelOpen.value;
  try { localStorage.setItem(OPEN_KEY, panelOpen.value ? '1' : '0'); } catch { /* 無法儲存時仍可在本次使用 */ }
};
const shortLabel = (s) => s.replace(/ 年第(.)次/, (_, n) => '-' + ('一二三四五六七八九'.indexOf(n) + 1));

// 兩屆題數差 4 題以上的細項，提醒起伏大
const swing = (p) => {
  const big = p.codes.filter(c => Math.max(...c.counts) - Math.min(...c.counts) >= 4);
  return big.length ? `${big.map(c => `${c.code} ${c.name}（${c.counts.join('→')} 題）`).join('、')}兩屆差很多，準備時不要只看平均。` : '';
};
</script>
