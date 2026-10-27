<template>
  <!-- 📖 相關名詞：作答後才顯示（由使用的地方決定）；名詞卡＝考試範圍，延伸名詞＝考古題沒出現過、看懂就好 -->
  <div v-if="cards.length || extended.length" class="p-3 rounded-xl border bg-slate-950/40 border-sky-900/50 flex flex-col gap-2.5">
    <span class="font-bold text-xs text-sky-400">📖 相關名詞</span>
    <div class="flex flex-wrap gap-1.5">
      <button v-for="term in cards" :key="term.id" @click="toggle('card:' + term.id)" class="px-2.5 py-1 rounded-lg border text-xs font-medium transition text-left" :class="active === 'card:' + term.id ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-sky-700 hover:text-sky-200'">
        {{ term.name }}<span v-if="term.status === '待確認'" class="ml-1 text-yellow-400">⚠</span>
      </button>
      <button v-for="(ext, eIdx) in extended" :key="'ext' + eIdx" @click="toggle('ext:' + eIdx)" class="px-2.5 py-1 rounded-lg border border-dashed text-xs font-medium transition text-left" :class="active === 'ext:' + eIdx ? 'bg-slate-600 border-slate-400 text-white' : 'bg-slate-900/60 border-slate-700 text-slate-500 hover:text-slate-300'">
        {{ ext.name }}<span class="ml-1 text-[10px] text-slate-500">延伸</span>
      </button>
    </div>

    <!-- 名詞卡（與題庫瀏覽的卡片樣式相同） -->
    <div v-if="activeCard" :key="active" class="rounded-xl border border-sky-800/60 bg-slate-900 p-3.5 flex flex-col gap-2.5 text-xs leading-relaxed animate-fade-in">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-bold text-sky-300">{{ activeCard.name }}</span>
        <span v-if="activeCard.status === '待確認'" class="px-2 py-0.5 rounded-md bg-yellow-500/15 border border-yellow-500/60 text-yellow-300 text-[10px] font-bold">⚠ 待確認：尚無權威來源</span>
      </div>
      <p class="text-slate-200">{{ activeCard.oneLiner }}</p>
      <div><span class="font-bold text-emerald-400">🧩 生活比喻　</span><span class="text-slate-300">{{ activeCard.analogy }}</span></div>
      <div><span class="font-bold text-violet-300">🎯 適用情境　</span><span class="text-slate-300">{{ activeCard.useCases }}</span></div>
      <div v-if="activeCard.distinguish"><span class="font-bold text-amber-300">🔀 怎麼區分　</span><span class="text-slate-300">{{ activeCard.distinguish }}</span></div>
      <div class="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/70 text-rose-100">
        <span class="font-bold text-rose-300 block mb-0.5">⚠️ 考題陷阱</span>
        {{ activeCard.trap }}
      </div>
      <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed flex flex-col gap-0.5">
        <span class="font-bold text-slate-400">參考來源</span>
        <span v-for="(src, sIdx) in activeCard.sources" :key="sIdx" class="break-all">
          <template v-if="splitSource(src).url">{{ splitSource(src).label }}<a :href="splitSource(src).url" target="_blank" rel="noopener noreferrer" class="text-sky-500 hover:text-sky-300 underline">{{ splitSource(src).url }}</a></template>
          <template v-else>{{ src }}</template>
        </span>
      </div>
    </div>

    <!-- 延伸名詞：一句白話＋提醒不是考試範圍；有相關名詞卡時可以直接跳過去看 -->
    <div v-if="activeExt" :key="active" class="rounded-xl border border-dashed border-slate-600 bg-slate-900/70 p-3.5 flex flex-col gap-2 text-xs leading-relaxed animate-fade-in">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-bold text-slate-300">{{ activeExt.name }}</span>
        <span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-600 text-slate-400 text-[10px] font-bold">延伸｜考古題未出現，了解即可</span>
      </div>
      <p class="text-slate-300">{{ activeExt.note }}</p>
      <div v-if="activeExt.see && termsById[activeExt.see]" class="text-slate-500">
        相關名詞卡：<button @click="toggle('card:' + activeExt.see)" class="text-sky-400 hover:text-sky-300 underline">{{ termsById[activeExt.see].name }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  // 題目 id：考古題是數字、練習題是 P 開頭字串
  qid: { type: [String, Number], required: true },
  // 練習題自帶 term_ids；沒給時用 question-terms.json 依題號查（考古題）
  termIds: { type: Array, default: null },
});

// 動態 import 會被快取，多處使用也只下載一次；資料放在 src/data/ 子資料夾，避開題庫的 ./data/*.json 載入
let loading = null;
const termsById = ref({});
const questionTermIds = ref({});
const extendedTerms = ref({});
const loadData = () => {
  loading ||= Promise.all([
    import('../data/terms/terms.json'),
    import('../data/terms/question-terms.json'),
    import('../data/practice/extended-terms.json'),
  ]).then(([termsMod, qtMod, extMod]) => {
    termsById.value = Object.fromEntries((termsMod.default || termsMod).map(t => [t.id, t]));
    questionTermIds.value = qtMod.default || qtMod;
    extendedTerms.value = extMod.default || extMod;
  });
  return loading;
};
onMounted(loadData);

const cards = computed(() => (props.termIds || questionTermIds.value[String(props.qid)] || [])
  .map(id => termsById.value[id]).filter(Boolean));
const extended = computed(() => extendedTerms.value[String(props.qid)] || []);

// 同一題一次只展開一張；換題時收起來
const active = ref(null);
watch(() => props.qid, () => { active.value = null; });
const toggle = (key) => { active.value = active.value === key ? null : key; };
const activeCard = computed(() => active.value?.startsWith('card:') ? termsById.value[active.value.slice(5)] : null);
const activeExt = computed(() => active.value?.startsWith('ext:') ? extended.value[Number(active.value.slice(4))] : null);

// 來源字串格式為「說明: https://…」或純檔名，拆出網址以便顯示為連結
const splitSource = (src) => {
  const m = String(src).match(/^(.*?)(https?:\/\/\S+)$/);
  return m ? { label: m[1], url: m[2] } : { label: src, url: null };
};
</script>
