<!--
  弱點分析分頁下半部的累積統計，依官方評鑑代碼列出答對率，低的排前面。
  kind="exam"：累積弱點（全真模擬考＋歷屆考古題交卷時寫入 ipas_code_stats_v1）
  kind="practice"：練習題弱點（練習題作答時寫入 ipas_practice_code_stats_v1），和考試實力分開存、分開顯示
-->
<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <h3 class="text-sm font-bold text-slate-200">{{ TEXT[kind].title }} <span class="text-[11px] font-normal text-slate-500">（{{ TEXT[kind].scope }}，依官方評鑑代碼）</span></h3>
      <button v-if="hasStats" @click="resetStats" class="text-[11px] text-slate-500 hover:text-red-400 underline shrink-0">清除</button>
    </div>
    <p v-if="!hasStats" class="text-xs text-slate-500 py-2">{{ TEXT[kind].empty }}</p>
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { loadCodeStats, clearCodeStats } from '../utils/answerStats.js';
import { CODE_NAMES } from '../data/codeNames.js';

const props = defineProps({
  kind: { type: String, default: 'exam' },
});

const TEXT = {
  exam: {
    title: '累積弱點',
    scope: '模擬考＋考古題',
    empty: '還沒有紀錄。交卷一次「全真模擬考」或「歷屆考古題」後，這裡會開始累積各代碼的答對率，答對率低的排在前面。',
    confirm: '確定要清除累積弱點紀錄嗎？（錯題本與練習題弱點不受影響）',
  },
  practice: {
    title: '練習題弱點',
    scope: '練習題第一回＋第二回',
    empty: '還沒有紀錄。在「全真模擬考 › 練習題」作答後，這裡會累積各代碼的答對率；錯題複習不算在內。',
    confirm: '確定要清除練習題弱點紀錄嗎？（錯題本與累積弱點不受影響）',
  },
};

const codeStats = ref({});

onMounted(() => {
  codeStats.value = loadCodeStats(props.kind);
});

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
  if (!confirm(TEXT[props.kind].confirm)) return;
  clearCodeStats(props.kind);
  codeStats.value = loadCodeStats(props.kind);
};
</script>
