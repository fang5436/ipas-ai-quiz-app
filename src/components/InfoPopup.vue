<template>
  <!-- 移到 body 底下，避免外層動畫的 transform 讓 fixed 定位失效 -->
  <Teleport to="body">
    <div v-if="question || term" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" @click.self="$emit('close')">
      <div class="w-full max-w-2xl max-h-[85dvh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">

        <!-- 原題 -->
        <template v-if="question">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/40">{{ question.source }}・{{ question.id }}</span>
            <button @click="$emit('close')" class="btn-secondary py-1 px-2.5 text-xs">關閉</button>
          </div>
          <p class="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">{{ question.question }}</p>
          <div class="flex flex-col gap-1.5">
            <div v-for="(o, oi) in question.options" :key="oi" class="text-xs leading-relaxed rounded-lg border px-3 py-2" :class="oi === question.correctIndex ? 'bg-green-950/40 border-green-700 text-green-200' : 'border-slate-800 text-slate-400'">{{ o }}</div>
          </div>
          <p v-if="question.explanation" class="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{{ question.explanation }}</p>
        </template>

        <!-- 名詞卡 -->
        <template v-else>
          <div class="flex items-start justify-between gap-2">
            <span class="flex flex-col gap-1 min-w-0">
              <span class="text-[11px] text-teal-400">📖 名詞卡</span>
              <span class="text-base font-bold text-white">{{ term.name }}</span>
            </span>
            <button @click="$emit('close')" class="btn-secondary py-1 px-2.5 text-xs shrink-0">關閉</button>
          </div>
          <p class="text-sm text-slate-200 leading-relaxed">{{ term.oneLiner }}</p>
          <div class="flex flex-col gap-2.5 text-xs leading-relaxed">
            <div v-for="f in DETAIL_FIELDS" :key="f.key" v-show="term[f.key]">
              <span class="font-bold" :class="f.color">{{ f.label }}</span>
              <p class="text-slate-300 mt-0.5">{{ term[f.key] }}</p>
            </div>
          </div>
        </template>

        <button @click="$emit('close')" class="btn-secondary text-xs">看完了，回到原本的位置</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  question: { type: Object, default: null },
  term: { type: Object, default: null },
});
defineEmits(['close']);

const DETAIL_FIELDS = [
  { key: 'analogy', label: '生活比喻', color: 'text-sky-400' },
  { key: 'useCases', label: '使用情境', color: 'text-emerald-400' },
  { key: 'distinguish', label: '和相近名詞的差別', color: 'text-amber-400' },
  { key: 'trap', label: '考題陷阱', color: 'text-rose-400' },
];
</script>
