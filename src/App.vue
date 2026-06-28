<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans pb-[env(safe-area-inset-bottom)] select-none">
    
    <!-- 頂部全域導覽列：加粗實體分隔線與顏色區隔 -->
    <header class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 pt-[env(safe-area-inset-top)]">
      <div class="max-w-3xl mx-auto px-2 md:px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-1 md:gap-2">
          <span class="text-violet-400 text-lg md:text-xl">⚡</span>
          <span class="font-bold text-xs md:text-sm tracking-wide text-slate-100 hidden sm:block">iPAS AI 規劃師</span>
        </div>
        
        <nav class="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button @click="switchTab('home')" :class="getTabClass('home')">首頁</button>
          
          <!-- 區隔線加粗加亮 -->
          <div class="w-0.5 h-4 bg-slate-500 mx-1.5 md:mx-2 rounded-full"></div>
          
          <button @click="switchTab('exam')" :class="getTabClass('exam')">全真模擬考</button>
          <button @click="switchTab('analysis')" :class="getTabClass('analysis')">弱點分析</button>
          
          <!-- 區隔線加粗加亮 -->
          <div class="w-0.5 h-4 bg-slate-500 mx-1.5 md:mx-2 rounded-full"></div>
          
          <button @click="switchTab('tracker')" :class="getTabClass('tracker')">進度追蹤</button>
          <button @click="switchTab('book')" :class="getTabClass('book')">指南單元</button>
        </nav>
      </div>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center pt-32 gap-4">
      <div class="w-10 h-10 border-4 border-slate-800 border-t-violet-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm animate-pulse">系統初始化中...</p>
    </div>

    <main v-else class="max-w-2xl mx-auto px-3 py-4 pb-32 flex flex-col">
      
      <!-- =================【TAB 1: 首頁分流選單】================= -->
      <div v-if="currentTab === 'home'" class="animate-fade-in flex flex-col gap-5 pt-2">
        <div class="bg-gradient-to-br from-violet-900/40 to-slate-900 border border-violet-800/50 rounded-2xl p-6 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div class="relative z-10 flex flex-col gap-3.5">
            <h1 class="text-xl md:text-2xl font-bold text-white">iPAS AI 應用規劃師 備考全功能終極終端</h1>
            <p class="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
              整合「歷屆考題隨機動態模擬考」與「指南單元專屬答題板」雙軌系統，全面數據化追蹤備考進度。
            </p>
            
            <div class="grid grid-cols-1 gap-2.5 mt-2">
              <div class="grid grid-cols-2 gap-2">
                <button @click="startExam(1)" class="btn-primary w-full py-3.5 flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-violet-900/20">
                  <span class="font-bold text-sm">📘 科目一模擬考</span>
                  <span class="text-[10px] font-normal opacity-70">人工智慧基礎概論</span>
                </button>
                <button @click="startExam(2)" class="btn-primary w-full py-3.5 flex flex-col items-center justify-center gap-0.5 !bg-indigo-600 hover:!bg-indigo-500 shadow-lg shadow-indigo-900/20">
                  <span class="font-bold text-sm">📙 科目二模擬考</span>
                  <span class="text-[10px] font-normal opacity-70">生成式AI應用與規劃</span>
                </button>
              </div>

              <button @click="currentTab = 'book'" class="btn-secondary w-full py-3.5 !bg-slate-900 hover:!bg-slate-800 border-slate-700 flex flex-col items-center justify-center gap-0.5 shadow-lg">
                <span class="font-bold text-base text-sky-400">📘 進入 指南單元強效練習板</span>
                <span class="text-[10px] font-normal text-slate-400">對照指南紙本 16 單元固定試題，具獨立正向計時與縱向進退步分析</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
            <span class="text-slate-400 text-[11px] mb-0.5">已載入隨機總題庫</span>
            <span class="text-2xl font-black text-slate-100">{{ allQuestions.length }}<span class="text-xs font-normal text-slate-500 ml-1">題</span></span>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
            <span class="text-slate-400 text-[11px] mb-0.5">指南章節答題板</span>
            <span class="text-2xl font-black text-sky-400">16<span class="text-xs font-normal text-slate-500 ml-1">單元</span></span>
          </div>
        </div>
      </div>

      <!-- =================【TAB 2: 全真模擬考模式】================= -->
      <div v-else-if="currentTab === 'exam'" class="animate-fade-in flex flex-col gap-4">
        <div v-if="examQuestions.length === 0" class="text-center py-20 flex flex-col items-center gap-4">
          <p class="text-slate-400">您目前不在模擬考狀態中，請選擇科目：</p>
          <div class="flex gap-3">
            <button @click="startExam(1)" class="btn-primary">📘 科目一</button>
            <button @click="startExam(2)" class="btn-primary !bg-indigo-600 hover:!bg-indigo-500">📙 科目二</button>
          </div>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3.5 sticky top-[calc(env(safe-area-inset-top)+4rem)] z-40 shadow-xl shadow-slate-950/50">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" :class="examSubject === 1 ? 'bg-violet-950 text-violet-400' : 'bg-indigo-950 text-indigo-400'">{{ examSubject === 1 ? '科目一' : '科目二' }}</span>
              </div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-bold text-violet-400">{{ currentQuestionIdx + 1 }}</span>
                <span class="text-xs text-slate-500 font-medium">/ {{ examQuestions.length }}</span>
              </div>
              <div v-if="!examSubmitted" class="text-xs font-mono font-bold tracking-wide" :class="timer < 300 ? 'text-red-400 animate-pulse' : 'text-emerald-400'">
                ⏱️ 倒計時：{{ formatTime(timer) }}
              </div>
            </div>
            <div v-if="examSubmitted" class="px-3 py-1 bg-violet-950/60 border border-violet-800 text-violet-400 rounded-lg font-bold text-xs">得分：{{ examScore }}</div>
            <div class="flex gap-2">
              <button v-if="!examSubmitted" @click="abortExam" class="btn-secondary py-1.5 px-2.5 text-xs border-red-900/50 text-red-400 hover:bg-red-950/20">中止</button>
              <button v-if="!examSubmitted" @click="submitExam" class="btn-primary py-1.5 px-3 text-xs" :disabled="!allAnswered">交卷</button>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium border border-slate-700">{{ currentQuestion.category }}</span>
              <span class="px-2 py-0.5 rounded bg-violet-950 text-violet-400 text-[10px] font-medium border border-violet-900/40">{{ currentQuestion.detail_code }}</span>
            </div>
            <div class="min-h-[90px] flex items-center mb-4">
              <h2 class="text-base font-semibold text-slate-100 leading-relaxed w-full">{{ currentQuestion.question }}</h2>
            </div>
            <div class="flex flex-col space-y-2.5">
              <button v-for="(option, idx) in currentQuestion.options" :key="idx" @click="selectOption(idx)" :disabled="examSubmitted" class="option-btn text-left" :class="getOptionClass(idx)">
                <div class="option-letter w-8 h-8 text-sm rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center font-bold shrink-0">{{ String.fromCharCode(65 + idx) }}</div>
                <div class="leading-relaxed text-sm font-medium">{{ cleanOptionText(option) }}</div>
              </button>
            </div>
            <div v-if="examSubmitted" class="mt-4 animate-fade-in">
              <div class="p-3.5 rounded-xl border border-slate-800 text-xs leading-relaxed whitespace-pre-wrap" :class="userAnswers[currentQuestionIdx] === currentQuestion.correctIndex ? 'bg-green-950/20 text-green-300 border-green-900/40' : 'bg-red-950/20 text-red-300 border-red-900/40'">
                <span class="font-bold block mb-1">{{ userAnswers[currentQuestionIdx] === currentQuestion.correctIndex ? '✅ 答對了！' : '❌ 答錯了' }}</span>
                {{ currentQuestion.explanation || '此題無解析。' }}
              </div>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div class="grid grid-cols-10 gap-1.5 md:gap-2">
              <button v-for="(ans, idx) in userAnswers" :key="idx" @click="currentQuestionIdx = idx" class="aspect-square flex items-center justify-center text-[11px] md:text-xs font-bold rounded-md transition-all" :class="[currentQuestionIdx === idx ? 'ring-2 ring-white scale-105 z-10' : 'opacity-80', examSubmitted ? (ans === examQuestions[idx].correctIndex ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : (ans !== null ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400')]">{{ idx + 1 }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- =================【🔥 全新 TAB 5: 備考進度追蹤儀表板】================= -->
      <div v-else-if="currentTab === 'tracker'" class="animate-fade-in flex flex-col gap-6 pt-2">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
            <div>
                <h1 class="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">iPAS 初級 AI 應用規劃師</h1>
                <p class="text-slate-400 mt-1 text-sm">獨立備考進度追蹤儀表板 (2026 衝刺版)</p>
            </div>
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center gap-4 w-full md:w-auto shadow-xl shadow-blue-950/20">
                <div class="text-blue-400 font-mono text-2xl md:text-3xl font-bold tracking-wider">{{ countdownStr }}</div>
                <div class="text-xs text-slate-400 border-l border-slate-800 pl-4">距離 8/15<br>考試倒數</div>
            </div>
        </header>

        <section class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                <span class="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 備考總達成率
                </span>
                <div class="flex items-center gap-4 justify-between sm:justify-end">
                    <span class="text-2xl font-mono font-bold text-emerald-400">{{ trackerProgress }}%</span>
                    <button @click="resetTracker" class="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-400 hover:text-red-300 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1">
                        🗑️ 清除所有進度
                    </button>
                </div>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-slate-700">
                <div class="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500" :style="{ width: `${trackerProgress}%` }"></div>
            </div>
        </section>

        <!-- 追蹤列表區塊 -->
        <div class="space-y-6">
          <div v-for="section in trackerSections" :key="section.id" class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-lg md:text-xl font-bold mb-6 flex items-center gap-2" :class="section.colorClass">
              {{ section.icon }} {{ section.title }}
            </h2>
            <div :class="section.id === 'exams' ? 'divide-y divide-slate-800' : 'space-y-6'">
              
              <!-- 遍歷每一篇或考試 -->
              <div v-for="partKey in section.parts" :key="partKey">
                <!-- 顯示篇章標題 -->
                <div v-if="trackerData[partKey].name" class="text-sm font-bold text-slate-200 border-l-4 border-slate-700 pl-2 mt-2 mb-2">
                  {{ trackerData[partKey].name }}
                </div>
                
                <div :class="section.id === 'exams' ? '' : 'pl-2 md:pl-6 divide-y divide-slate-800/50 mb-4'">
                  <div v-for="item in trackerData[partKey].items" :key="item.id" class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 gap-3">
                    <span class="text-sm font-medium text-slate-400 hover:text-slate-300 transition">{{ item.name }}</span>
                    <div class="flex gap-3 w-full sm:w-auto justify-end">
                      <template v-if="item.examOnly">
                        <div class="flex items-center gap-2 bg-slate-950/40 border px-3 py-1.5 rounded-lg text-xs"
                          :class="examCounts[item.examKey] > 0 ? 'border-emerald-800/60' : 'border-slate-800'">
                          <span class="font-medium" :class="examCounts[item.examKey] > 0 ? 'text-emerald-400' : 'text-slate-500'">
                            已完成 {{ examCounts[item.examKey] }} 次測驗
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <label class="flex items-center gap-2 bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer text-xs select-none hover:border-slate-700 transition">
                          <input type="checkbox" :checked="trackerState[`${item.id}_read`]" @change="toggleTracker(item.id, 'read')" class="w-4 h-4 accent-blue-500 rounded">
                          <span class="font-medium" :class="trackerState[`${item.id}_read`] ? 'text-blue-400' : 'text-slate-400'">已閱讀</span>
                        </label>
                        <label class="flex items-center gap-2 bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer text-xs select-none hover:border-slate-700 transition">
                          <input type="checkbox" :checked="trackerState[`${item.id}_quiz`]" @change="toggleTracker(item.id, 'quiz')" class="w-4 h-4 accent-emerald-500 rounded">
                          <span class="font-medium" :class="trackerState[`${item.id}_quiz`] ? 'text-emerald-400' : 'text-slate-400'">做測驗</span>
                          <span v-if="(bookHistoryMaster[item.id]?.length || 0) > 0" class="ml-0.5 px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-900/50">
                            {{ bookHistoryMaster[item.id].length }}次
                          </span>
                        </label>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- =================【TAB 3: 指南單元練習模式】================= -->
      <div v-else-if="currentTab === 'book'" class="animate-fade-in flex flex-col gap-4">
        
        <div v-if="!bookQuizActive" class="flex flex-col gap-4">
          <div class="border border-slate-800 bg-slate-900/40 p-4 rounded-xl text-xs text-slate-400 leading-relaxed">
            <span class="text-sky-400 font-bold block mb-1">📖 指南單元無紙化答題板說明：</span>
            本功能與「模擬考」題庫獨立分開。請對照紙本指南各章末尾的「單元模擬試題」在手機盲刷。作答完畢後將與標準答案比對，並為您留存歷次進退步軌跡。
          </div>

          <div v-for="part in bookStructure" :key="part.id" class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
            <h2 class="text-sm font-bold text-slate-200 border-l-4 border-sky-500 pl-2 py-0.5 bg-slate-950/40 rounded-r-md">{{ part.name }}</h2>
            
            <div class="divide-y divide-slate-800/50">
              <div v-for="ch in part.chapters" :key="ch.id" class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-medium text-slate-300">{{ ch.name }}</span>
                  <div class="flex gap-3 text-[10px] text-slate-500 font-medium">
                    <span>答題庫存：<span class="text-slate-400">{{ getQuestionCount(ch.id) }} 題</span></span>
                    <span v-if="getBookStats(ch.id)">歷史最高：<span class="text-emerald-400">{{ getBookStats(ch.id).maxScore }}分</span></span>
                    <span v-if="getBookStats(ch.id)">上次做：<span class="text-sky-400">{{ getBookStats(ch.id).lastScore }}分 ({{ getBookStats(ch.id).lastTime }})</span></span>
                  </div>
                </div>
                <div class="flex gap-2 self-end sm:self-auto flex-shrink-0">
                  <button @click="activeNotesId = ch.id" class="px-3 py-2 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 text-purple-400 hover:text-purple-300 text-xs font-bold rounded-xl transition-all shadow-sm">
                    📖 重點筆記
                  </button>
                  <button @click="activeAnalysisId = ch.id" class="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-amber-400 hover:text-amber-300 text-xs font-bold rounded-xl transition-all shadow-sm">
                    🔍 試題解析
                  </button>
                  <button @click="launchBookQuiz(ch.id, ch.name)" class="px-3 py-2 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/60 text-sky-400 hover:text-sky-300 text-xs font-bold rounded-xl transition-all shadow-sm">
                    👉 開始 {{ getQuestionCount(ch.id) }} 題練習
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div class="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3.5 sticky top-[calc(env(safe-area-inset-top)+4rem)] z-40 shadow-xl shadow-slate-950/50">
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded font-bold w-fit mb-1 max-w-[180px] truncate">{{ activeBookChName }}</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold text-sky-400">{{ activeBookQIdx + 1 }}</span>
                <span class="text-xs text-slate-500 font-medium">/ {{ bookQuizAnswers.length }}</span>
              </div>
            </div>
            
            <div class="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-300">
              <span class="animate-pulse text-sky-400">⏱️</span>
              <span>{{ formatBookTimer(bookTimer) }}</span>
            </div>

            <div class="flex gap-2">
              <button v-if="!bookQuizSubmitted" @click="exitBookQuiz" class="btn-secondary py-1.5 px-2.5 text-xs border-slate-700 text-slate-400">返回</button>
              <button v-if="!bookQuizSubmitted" @click="evaluateBookQuiz" class="btn-primary !bg-sky-600 hover:!bg-sky-500 py-1.5 px-3 text-xs" :disabled="!bookAllAnswered">對答案</button>
              <button v-if="bookQuizSubmitted" @click="exitBookQuiz" class="btn-primary !bg-slate-800 hover:!bg-slate-700 py-1.5 px-3 text-xs">離開章節</button>
            </div>
          </div>

          <div v-if="bookQuizSubmitted && comparison看板" class="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 animate-fade-in flex flex-col gap-2 shadow-inner">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">📈 本章單元歷史軌跡縱向對比</h4>
            <div class="grid grid-cols-2 gap-3 mt-1">
              <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 flex flex-col">
                <span class="text-[10px] text-slate-500">正確率成長</span>
                <span class="text-sm font-black mt-1" :class="comparison看板.scoreDiff >= 0 ? 'text-green-400' : 'text-amber-400'">
                  {{ comparison看板.scoreDiff >= 0 ? `▲ +${comparison看板.scoreDiff} 分` : `▼ ${Math.abs(comparison看板.scoreDiff)} 分` }}
                </span>
                <span class="text-[9px] text-slate-600 mt-0.5">{{ comparison看板.isFirst ? '初次建立基準點' : `上次得分: ${comparison看板.prevScore}分` }}</span>
              </div>
              <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 flex flex-col">
                <span class="text-[10px] text-slate-500">解題效率優化</span>
                <span class="text-sm font-black mt-1" :class="comparison看板.timeDiffRaw <= 0 ? 'text-green-400' : 'text-amber-400'">
                  {{ comparison看板.timeDiffStr }}
                </span>
                <span class="text-[9px] text-slate-600 mt-0.5">{{ comparison看板.isFirst ? '速度計量已鎖定' : `上次耗時: ${comparison看板.prevTimeStr}` }}</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-md">
            <div class="text-center py-4 bg-slate-950/50 border border-slate-800 rounded-xl mb-6">
              <span class="text-xs text-slate-500 block mb-1">UNIT RUNNER</span>
              <h3 class="text-base font-bold tracking-wide text-slate-200">請看指南第 {{ activeBookQIdx + 1 }} 題並在此處點選答案</h3>
            </div>

            <div class="flex flex-col space-y-2.5">
              <button v-for="idx in 4" :key="idx" @click="selectBookOption(idx - 1)" :disabled="bookQuizSubmitted" class="option-btn text-left transition-all duration-150" :class="getBookOptionClass(idx - 1)">
                <div class="option-letter w-9 h-9 text-sm rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold shrink-0">{{ String.fromCharCode(65 + (idx - 1)) }}</div>
                
                <div class="leading-relaxed text-sm font-bold tracking-wide">
                  <template v-if="!bookQuizSubmitted">
                    點選此處將答案記為 {{ String.fromCharCode(65 + (idx - 1)) }}
                  </template>
                  <template v-else>
                    <span v-if="bookQuizAnswers[activeBookQIdx] === (idx - 1)">標準答案！</span>
                    <span v-else-if="bookUserAnswers[activeBookQIdx] === (idx - 1)">作答錯誤！</span>
                  </template>
                </div>
              </button>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
              <span>全題定位矩陣</span>
              <span class="text-[10px] font-normal text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-900/40">耗時：{{ formatBookTimer(bookTimer) }}</span>
            </h3>
            
            <div class="grid grid-cols-10 gap-1.5 md:gap-2">
              <button 
                v-for="(ans, idx) in bookUserAnswers" 
                :key="idx"
                @click="activeBookQIdx = idx"
                class="aspect-square flex items-center justify-center text-[11px] md:text-xs font-bold rounded-md transition-all"
                :class="[
                  activeBookQIdx === idx ? 'ring-2 ring-sky-400 scale-105 z-10' : 'opacity-80',
                  bookQuizSubmitted 
                    ? (ans === bookQuizAnswers[idx] ? 'bg-green-600 text-white' : 'bg-red-600 text-white')
                    : (ans !== null ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400')
                ]"
              >
                {{ idx + 1 }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- =================【TAB 4: 模擬考雙層弱點分析】================= -->
      <div v-else-if="currentTab === 'analysis'" class="animate-fade-in flex flex-col gap-6 pt-2">
        <div v-if="!examSubmitted" class="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <div class="text-4xl mb-4">📊</div>
          <h2 class="text-lg font-bold text-slate-200 mb-2">尚無分析數據</h2>
          <p class="text-slate-400 text-sm mb-6">請先完成一次 50 題模擬測驗並交卷，系統將自動為您生成雙層弱點分析報告。</p>
          <div class="flex gap-3 justify-center">
            <button @click="startExam(1)" class="btn-primary">📘 科目一</button>
            <button @click="startExam(2)" class="btn-primary !bg-indigo-600 hover:!bg-indigo-500">📙 科目二</button>
          </div>
        </div>

        <div v-else class="flex flex-col gap-6">
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-slate-900/50">
            <div>
              <p class="text-slate-400 text-sm mb-1 font-medium">模擬考最終得分</p>
              <div class="flex items-end gap-2">
                <span class="text-5xl font-black" :class="examScore >= 70 ? 'text-green-400' : 'text-red-400'">{{ examScore }}</span>
                <span class="text-slate-500 font-medium mb-1">/ 100</span>
              </div>
              <p class="text-xs mt-2" :class="examScore >= 70 ? 'text-green-500/80' : 'text-red-500/80'">{{ examScore >= 70 ? '🎉 恭喜達標！請繼續保持。' : '💪 距離及格還有進步空間。' }}</p>
            </div>
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] md:border-8 flex items-center justify-center bg-slate-950" :class="examScore >= 70 ? 'border-green-500/30' : 'border-red-500/30'">
              <span class="text-lg md:text-xl font-bold" :class="examScore >= 70 ? 'text-green-400' : 'text-red-400'">{{ examScore >= 70 ? '及格' : '不及格' }}</span>
            </div>
          </div>

          <h3 class="text-sm font-bold text-slate-300 uppercase tracking-widest pl-1 mt-2 border-l-2 border-violet-500">雙層弱點分析報告</h3>
          <div class="flex flex-col gap-3">
            <div v-for="(item, idx) in weaknessAnalysis" :key="idx" class="border border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <button @click="toggleAccordion(idx)" class="w-full bg-slate-800/50 hover:bg-slate-800 transition-colors px-4 py-3.5 flex items-center justify-between text-left">
                <div class="flex items-center gap-3">
                  <span class="text-slate-400 transition-transform duration-200" :class="{'rotate-90 text-violet-400': expandedAccordion === idx}">▶</span>
                  <span class="font-bold text-slate-200 text-sm md:text-base">{{ item.category }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-medium text-slate-400 hidden md:block">{{ item.correct }} / {{ item.total }} 題</span>
                  <div class="flex items-center justify-center w-11 h-6 rounded bg-slate-900 border border-slate-700 text-xs font-bold" :class="getRateColor(item.correct / item.total)">{{ Math.round((item.correct / item.total) * 100) }}%</div>
                </div>
              </button>

              <div v-if="expandedAccordion === idx" class="bg-slate-900/80 divide-y divide-slate-800/50 border-t border-slate-700">
                <div v-for="(detail, dIdx) in item.details" :key="dIdx" class="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-800/30 transition-colors gap-2">
                  <span class="text-xs md:text-sm text-slate-300">{{ detail.name }}</span>
                  <div class="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <span class="text-[10px] text-slate-500">{{ detail.correct }} / {{ detail.total }}</span>
                    <div class="w-24 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" :class="getBarColor(detail.correct / detail.total)" :style="{ width: `${(detail.correct / detail.total) * 100}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- 模擬考專屬盲點置底切換鍵 -->
    <div v-if="currentTab === 'exam' && examQuestions.length > 0" class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12 pb-[calc(env(safe-area-inset-bottom)+16px)] px-4 z-50 pointer-events-none">
      <div class="max-w-2xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
        <button @click="prevQuestion" class="btn-secondary flex-1 py-3.5 shadow-lg shadow-slate-950" :disabled="currentQuestionIdx === 0">← 上一題</button>
        <button @click="nextQuestion" class="btn-primary flex-1 py-3.5 shadow-lg shadow-violet-900/30" :disabled="currentQuestionIdx === examQuestions.length - 1">下一題 →</button>
      </div>
    </div>

    <!-- 重點筆記 Modal -->
    <Transition name="notes-modal">
      <div v-if="activeNotesId" class="fixed inset-0 z-[200] flex flex-col justify-end" @click.self="activeNotesId = null">
        <div class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" @click="activeNotesId = null"></div>
        <div class="notes-sheet relative max-h-[88dvh] bg-slate-900 border-t border-slate-700 rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800/80">
            <div>
              <div class="text-[10px] text-purple-400 font-bold tracking-wider mb-0.5">📖 重點筆記</div>
              <div class="text-sm font-bold text-slate-200">{{ getChapterName(activeNotesId) }}</div>
            </div>
            <button @click="activeNotesId = null" class="text-slate-400 hover:text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 transition-all text-xl font-light">✕</button>
          </div>
          <!-- Content -->
          <div class="overflow-y-auto px-5 py-3 flex-1 notes-content" v-html="chapterNotes[activeNotesId] || '<p class=\'text-slate-500 text-sm\'>暫無筆記</p>'"></div>
          <!-- Footer -->
          <div class="px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] border-t border-slate-800/80 bg-slate-900">
            <button @click="activeNotesId = null" class="w-full py-3 bg-purple-900/30 hover:bg-purple-800/50 border border-purple-700/50 text-purple-300 hover:text-purple-200 font-bold rounded-xl text-sm transition-all">
              ✅ 已複習，關閉筆記
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 試題解析 Modal -->
    <Transition name="notes-modal">
      <div v-if="activeAnalysisId" class="fixed inset-0 z-[200] flex flex-col justify-end" @click.self="activeAnalysisId = null">
        <div class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" @click="activeAnalysisId = null"></div>
        <div class="notes-sheet relative max-h-[88dvh] bg-slate-900 border-t border-slate-700 rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800/80">
            <div>
              <div class="text-[10px] text-amber-400 font-bold tracking-wider mb-0.5">🔍 試題解析</div>
              <div class="text-sm font-bold text-slate-200">{{ getChapterName(activeAnalysisId) }}</div>
            </div>
            <button @click="activeAnalysisId = null" class="text-slate-400 hover:text-white w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-800 transition-all text-xl font-light">✕</button>
          </div>
          <div class="overflow-y-auto px-5 py-3 flex-1 analysis-content" v-html="chapterAnalysis[activeAnalysisId] || '<p class=\'text-slate-500 text-sm\'>暫無解析</p>'"></div>
          <div class="px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] border-t border-slate-800/80 bg-slate-900">
            <button @click="activeAnalysisId = null" class="w-full py-3 bg-amber-900/30 hover:bg-amber-800/50 border border-amber-700/50 text-amber-300 hover:text-amber-200 font-bold rounded-xl text-sm transition-all">
              ✅ 已閱讀，關閉解析
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 指南練習專屬盲點置底切換鍵 -->
    <div v-if="currentTab === 'book' && bookQuizActive" class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12 pb-[calc(env(safe-area-inset-bottom)+16px)] px-4 z-50 pointer-events-none">
      <div class="max-w-2xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
        <button @click="activeBookQIdx > 0 && activeBookQIdx--" class="btn-secondary flex-1 py-3.5 border-slate-700 text-slate-300" :disabled="activeBookQIdx === 0">← 上一題</button>
        <button @click="activeBookQIdx < bookQuizAnswers.length - 1 && activeBookQIdx++" class="btn-primary !bg-sky-600 hover:!bg-sky-500 flex-1 py-3.5 shadow-lg" :disabled="activeBookQIdx === bookQuizAnswers.length - 1">下一題 →</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { chapterNotes } from './data/chapterNotes.js';
import { chapterAnalysis } from './data/chapterAnalysis.js';

const loading = ref(true);
const currentTab = ref('home');

// =================【🎯 獨立靜態資料庫：16章完全體答案】=================
const bookQuizData = {
  'p1_c1': [0,2,1,3,3,2,0,2,1,2,3,2,0,1,2,1,2,0,2,1,1,2,2,3,0,2,0,1,1,2,1,1,2,2,1,3,1,1,1,0],
  'p1_c2': [1,2,2,3,1,0,2,1,1,2,1,2,0,2,2,1,3,3,2,0,3,0,2,2,0,2,2,1,1,2,2,0,3,1,2,2,0,1,2,3],
  'p2_c1': [0,1,1,3,1,0,2,2,3,0,1,2,1,3,3,0,0,1,3,1,2,1,2,3,1,2,1,3,1,0,0,3,2,0,1,2,2,2,1,3],
  'p2_c2': [1,2,2,1,1,2,0,0,2,1,2,0,3,2,1,3,0,2,1,1,0,2,3,2,1,0,2,1,3,1,0,1,2,1,1,3,1,0,1,2],
  'p2_c3': [1,0,2,3,0,2,0,1,2,1,2,3,1,2,3,1,2,0,2,1,3,2,1,2,0,2,0,3,2,1,2,1,0,3,1,2,1,2,0,2],
  'p3_c1': [2,2,1,2,1,0,3,1,2,0,1,2,1,0,3,2,3,2,1,1,3,0,0,0,1,3,1,1,0,2,2,3,3,0,0,1,0,1,2,3],
  'p3_c2': [0,2,1,2,1,3,0,1,0,1,1,0,3,1,3,2,2,1,2,3,1,2,1,1,2,2,2,3,1,0,1,2,2,1,2,1,3,1,0,3],
  'p4_c1': [0,1,1,2,0,1,1,3,1,2,1,1,0,3,3,1,1,2,1,2,0,1,3,2,1,0,3,2,0,1,3,0,3,1,2,0,2,3,1,2],
  'p4_c2': [0,1,1,1,1,3,3,1,3,1,2,2,1,0,1,0,3,1,2,1,1,2,0,2,3,2,1,2,0,3,2,1,0,3,2,1,2,1,2,3],
  'p5_c1': [0,2,1,2,2,1,0,1,3,2,1,0,2,3,1,2,3,2,1,3,0,1,3,2,0,2,1,3,0,2,2,1,3,1,1,0,2,0,1,2],
  'p5_c2': [0,1,2,1,1,2,2,3,1,0,1,2,3,2,0,1,3,1,3,2,2,2,1,2,1,2,1,0,3,0,3,1,3,2,0,0,2,1,1,3],
  'p6_c1': [0,1,3,1,3,0,0,3,2,1,1,3,0,2,1,2,1,2,0,0,3,0,2,1,0,1,2,2,1,1,2,3,1,0,1,2,3,1,1,2],
  'p6_c2': [2,1,3,0,2,1,0,3,1,2,1,3,2,2,1,0,1,3,1,2,2,1,2,1,3,3,2,0,1,1,2,1,0,1,0,0,2,2,1,3],
  'p7_c1': [1,1,0,2,3,2,0,1,2,3,1,1,0,0,0,3,0,2,0,1,2,3,2,3,0,0,1,3,0,1],
  'p7_c2': [0,1,1,2,3,2,0,2,1,2,1,3,3,2,2,1,2,3,1,1,2,1,1,2,1,0,2,1,3,3],
  'p7_c3': [1,1,2,1,2,1,0,3,0,0,2,1,3,1,3,3,1,1,2,0,1,2,2,2,3,0,1,3,2,2]
};

const getQuestionCount = (chId) => bookQuizData[chId]?.length || 0;

const bookStructure = [
  { id: 'part1', name: '第一篇：AI的定義與分類及治理', chapters: [{ id: 'p1_c1', name: '第1章：AI的定義與分類' }, { id: 'p1_c2', name: '第2章：AI治理概念' }] },
  { id: 'part2', name: '第二篇：資料基本概念與處理流程', chapters: [{ id: 'p2_c1', name: '第1章：資料基本概念與來源' }, { id: 'p2_c2', name: '第2章：資料整理與分析流程' }, { id: 'p2_c3', name: '第3章：資料隱私與安全' }] },
  { id: 'part3', name: '第三篇：機器學習基本原理與模型', chapters: [{ id: 'p3_c1', name: '第1章：機器學習基本原理' }, { id: 'p3_c2', name: '第2章：常見的機器學習模型' }] },
  { id: 'part4', name: '第四篇：鑑別式 AI 與生成式 AI 概論', chapters: [{ id: 'p4_c1', name: '第1章：鑑別式 AI 與生成式 AI 的基本原理' }, { id: 'p4_c2', name: '第2章：鑑別式 AI 與生成式 AI 的整合應用' }] },
  { id: 'part5', name: '第五篇：Low code / No code 基本概念與應用', chapters: [{ id: 'p5_c1', name: '第1章：Low code / No code 基本概念' }, { id: 'p5_c2', name: '第2章：Low code / No code 優勢與限制' }] },
  { id: 'part6', name: '第六篇：生成式 AI 應用領域與常見工具', chapters: [{ id: 'p6_c1', name: '第1章：生成式 AI 應用領域與常見工具' }, { id: 'p6_c2', name: '第2章：如何善用生成式 AI 工具' }] },
  { id: 'part7', name: '第七篇：生成式 AI 導入評估與風險管理', chapters: [{ id: 'p7_c1', name: '第1章：生成式 AI 導入評估' }, { id: 'p7_c2', name: '第2章：生成式 AI 導入規劃' }, { id: 'p7_c3', name: '第3章：生成式 AI 風險評估' }] }
];

// =================【🔥 進度追蹤儀表板專用變數與大腦】=================
const trackerState = ref({});
const examCounts = ref({ sub1: 0, sub2: 0 });
const countdownStr = ref('--天 --時');
let countdownInterval = null;

const trackerData = {
  part1: { name: '第一篇：AI的定義與分類及治理', items: [{ id: 'p1_c1', name: '第1章：AI的定義與分類' }, { id: 'p1_c2', name: '第2章：AI治理概念' }] },
  part2: { name: '第二篇：資料基本概念與處理流程', items: [{ id: 'p2_c1', name: '第1章：資料基本概念與來源' }, { id: 'p2_c2', name: '第2章：資料整理與分析流程' }, { id: 'p2_c3', name: '第3章：資料隱私與安全' }] },
  part3: { name: '第三篇：機器學習基本原理與模型', items: [{ id: 'p3_c1', name: '第1章：機器學習基本原理' }, { id: 'p3_c2', name: '第2章：常見的機器學習模型' }] },
  part4: { name: '第四篇：鑑別式 AI 與生成式 AI 概論', items: [{ id: 'p4_c1', name: '第1章：鑑別式 AI 與生成式 AI 的基本原理' }, { id: 'p4_c2', name: '第2章：鑑別式 AI 與生成式 AI 的整合應用' }] },
  part5: { name: '第五篇：Low code / No code 基本概念與應用', items: [{ id: 'p5_c1', name: '第1章：Low code / No code 基本概念' }, { id: 'p5_c2', name: '第2章：Low code / No code 優勢與限制' }] },
  part6: { name: '第六篇：生成式 AI 應用領域與常見工具', items: [{ id: 'p6_c1', name: '第1章：生成式 AI 應用領域與常見工具' }, { id: 'p6_c2', name: '第2章：如何善用生成式 AI 工具' }] },
  part7: { name: '第七篇：生成式 AI 導入評估與風險管理', items: [{ id: 'p7_c1', name: '第1章：生成式 AI 導入評估' }, { id: 'p7_c2', name: '第2章：生成式 AI 導入規劃' }, { id: 'p7_c3', name: '第3章：生成式 AI 風險評估' }] },
  exams: { name: '', items: [
    { id: 'ex_sub1', name: '📘 科目一：人工智慧基礎概論 全真模擬考', examOnly: true, examKey: 'sub1' },
    { id: 'ex_sub2', name: '📙 科目二：生成式AI應用與規劃 全真模擬考', examOnly: true, examKey: 'sub2' }
  ] }
};

const trackerSections = [
  { id: 'subject1', title: '科目一：人工智慧基礎概論', icon: '📘', colorClass: 'text-blue-400', parts: ['part1', 'part2', 'part3', 'part4'] },
  { id: 'subject2', title: '科目二：生成式AI應用與規劃', icon: '📙', colorClass: 'text-indigo-400', parts: ['part5', 'part6', 'part7'] },
  { id: 'exams', title: '歷屆考古題全真衝刺', icon: '🎯', colorClass: 'text-emerald-400', parts: ['exams'] }
];

const updateCountdown = () => {
  const diff = new Date('2026-08-15T00:00:00').getTime() - new Date().getTime();
  if (diff <= 0) { countdownStr.value = '考試結束'; return; }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  countdownStr.value = `${d}天 ${h}時`;
};

const toggleTracker = (id, type) => {
  const key = `${id}_${type}`;
  trackerState.value[key] = !trackerState.value[key];
  localStorage.setItem('ipas_tracker_v1', JSON.stringify(trackerState.value));
};

const resetTracker = () => {
  if (confirm('確定要清空所有已勾選的進度，重新開始讀嗎？')) {
    trackerState.value = {};
    localStorage.removeItem('ipas_tracker_v1');
  }
};

const trackerProgress = computed(() => {
  let total = 0;
  let checked = 0;
  for (const key in trackerData) {
    trackerData[key].items.forEach(item => {
      if (item.examOnly) return; // 全真刷題不計入備考達成率
      total += 2;
      if (trackerState.value[`${item.id}_read`]) checked++;
      if (trackerState.value[`${item.id}_quiz`]) checked++;
    });
  }
  return total > 0 ? Math.round((checked / total) * 100) : 0;
});

// =================【🔄 模擬考專用變數與大腦】=================
const allQuestions = ref([]);
const examQuestions = ref([]);
const userAnswers = ref([]);
const currentQuestionIdx = ref(0);
const examSubmitted = ref(false);
const examScore = ref(0);
const examSubject = ref(1);
const expandedAccordion = ref(null);
const timer = ref(75 * 60);
let timerInterval = null;

const currentQuestion = computed(() => examQuestions.value[currentQuestionIdx.value] || {});
const allAnswered = computed(() => userAnswers.value.length > 0 && userAnswers.value.every(ans => ans !== null));

const chapterMapping = {
  'CH1-1': { part: '第一篇：人工智慧概念', chapter: 'CH1-1 AI 的定義與分類' },
  'CH1-2': { part: '第一篇：人工智慧概念', chapter: 'CH1-2 AI 治理概念' },
  'CH2-1': { part: '第二篇：資料處理與分析概念', chapter: 'CH2-1 資料基本概念與來源' },
  'CH2-2': { part: '第二篇：資料處理與分析概念', chapter: 'CH2-2 資料整理與分析流程' },
  'CH2-3': { part: '第二篇：資料處理與分析概念', chapter: 'CH2-3 資料隱私與安全' },
  'CH3-1': { part: '第三篇：機器學習概念', chapter: 'CH3-1 機器學習基本原理' },
  'CH3-2': { part: '第三篇：機器學習概念', chapter: 'CH3-2 常見的機器學習模型' },
  'CH4-1': { part: '第四篇：鑑別式與生成式 AI 原理', chapter: 'CH4-1 鑑別式與生成式 AI 基本原理' },
  'CH4-2': { part: '第四篇：鑑別式與生成式 AI 原理', chapter: 'CH4-2 鑑別式與生成式 AI 整合應用' },
  'CH5-1': { part: '第五篇：Low code / No code 概念', chapter: 'CH5-1 Low code / No code 基本概念' },
  'CH5-2': { part: '第五篇：Low code / No code 概念', chapter: 'CH5-2 Low code / No code 優勢與限制' },
  'CH6-1': { part: '第六篇：生成式 AI 應用領域與工具使用', chapter: 'CH6-1 生成式 AI 應用領域與常見工具' },
  'CH6-2': { part: '第六篇：生成式 AI 應用領域與工具使用', chapter: 'CH6-2 如何善用生成式 AI 工具' },
  'CH7-1': { part: '第七篇：生成式 AI 導入評估規劃', chapter: 'CH7-1 生成式 AI 導入評估' },
  'CH7-2': { part: '第七篇：生成式 AI 導入評估規劃', chapter: 'CH7-2 生成式 AI 導入規劃' },
  'CH7-3': { part: '第七篇：生成式 AI 導入評估規劃', chapter: 'CH7-3 生成式 AI 風險評估' }
};

// =================【🔥 指南單元練習專用變數與大腦】=================
const activeNotesId = ref(null);
const activeAnalysisId = ref(null);
const getChapterName = (chId) => bookStructure.flatMap(p => p.chapters).find(c => c.id === chId)?.name || chId;
const bookQuizActive = ref(false);
const activeBookChId = ref(null);
const activeBookChName = ref(null);
const activeBookQIdx = ref(0);
const bookUserAnswers = ref([]);
const bookQuizAnswers = ref([]);
const bookQuizSubmitted = ref(false);
const bookTimer = ref(0); 
let bookTimerInterval = null;
const bookHistoryMaster = ref({}); 
const comparison看板 = ref(null); 

onMounted(async () => {
  try {
    const modules = import.meta.glob('./data/*.json');
    let loadedData = [];
    for (const path in modules) {
      const mod = await modules[path]();
      loadedData = loadedData.concat(mod.default || mod);
    }
    allQuestions.value = loadedData;

    const savedBookHistory = localStorage.getItem('ipas_book_history_v2');
    if (savedBookHistory) {
      bookHistoryMaster.value = JSON.parse(savedBookHistory);
    }
    
    const savedTracker = localStorage.getItem('ipas_tracker_v1');
    if(savedTracker) {
      trackerState.value = JSON.parse(savedTracker);
    }

    const savedExamCounts = localStorage.getItem('ipas_exam_counts_v1');
    if (savedExamCounts) {
      examCounts.value = JSON.parse(savedExamCounts);
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 60000);

  } catch (error) {
    console.error("載入題庫失敗：", error);
  } finally {
    loading.value = false; 
  }
});

onBeforeUnmount(() => {
  stopTimer();
  stopBookTimer();
  if (countdownInterval) clearInterval(countdownInterval);
});

// UI 分流專屬按鈕樣式切換
const getTabClass = (id) => {
  const isActive = currentTab.value === id;
  if (!isActive) return 'px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200';
  if (id === 'book') return 'px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-sky-600 text-white shadow-lg shadow-sky-900/40 transition-all duration-200';
  if (id === 'tracker') return 'px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 transition-all duration-200';
  return 'px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-violet-600 text-white shadow-lg shadow-violet-900/40 transition-all duration-200';
};

const switchTab = (tabId) => {
  if (currentTab.value === 'exam' && !examSubmitted.value && examQuestions.value.length > 0) {
    if (!confirm('⚠️ 正在模擬考中，切換分頁將遺失本次作答內容，確定切換嗎？')) return;
    stopTimer();
    examQuestions.value = [];
  }
  if (bookQuizActive.value && !bookQuizSubmitted.value) {
    if (!confirm('⚠️ 正在進行單元練習答題，切換將不保存當前計時與答案，確定嗎？')) return;
    stopBookTimer();
    bookQuizActive.value = false;
  }
  currentTab.value = tabId;
};

// =================【🔄 模擬考核心引擎區】=================
const startExam = (subject = 1) => {
  if (allQuestions.value.length === 0) {
    alert("題庫資料尚未載入完成，請稍候再試！");
    return;
  }

  // 依考古題官方出題比率訂定固定配額（科目一共50題，科目二共50題）
  const sub1Quotas = { "L11101": 4, "L11102": 6, "L11201": 3, "L11202": 7, "L11203": 3, "L11301": 10, "L11302": 7, "L11401": 6, "L11402": 4 };
  const sub2Quotas = { "L12101": 6, "L12102": 6, "L12201": 8, "L12202": 10, "L12301": 7, "L12302": 5, "L12303": 8 };
  const targetQuotas = subject === 1 ? sub1Quotas : sub2Quotas;

  // detail_code → CH 標籤（供 weaknessAnalysis 顯示用）
  const sub1CHMap = { "L11101": "CH1-1", "L11402": "CH1-2", "L11201": "CH2-1", "L11202": "CH2-2", "L11401": "CH2-3", "L11203": "CH3-1", "L11102": "CH3-2", "L11301": "CH4-1", "L11302": "CH4-2" };
  const sub2CHMap = { "L12101": "CH6-1", "L12102": "CH6-2", "L12201": "CH7-2", "L12202": "CH5-1", "L12301": "CH7-3", "L12302": "CH7-3", "L12303": "CH7-1" };
  const chMap = subject === 1 ? sub1CHMap : sub2CHMap;

  // Fisher-Yates 洗牌
  const fisherYates = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ── 步驟1：依配額從各章節抽題，超額題目進入備用池
  const selected = [];
  const surplusPool = [];

  for (const [code, quota] of Object.entries(targetQuotas)) {
    const pool = fisherYates(allQuestions.value.filter(q => String(q.detail_code || '').trim() === code));
    const take = Math.min(pool.length, quota);
    for (let i = 0; i < take; i++) {
      selected.push({ ...pool[i], detail_code: chMap[code] || code });
    }
    // 超出配額的題目進備用池，備用池供題庫不足時補題
    for (let i = quota; i < pool.length; i++) {
      surplusPool.push({ ...pool[i], detail_code: chMap[code] || code });
    }
  }

  // ── 步驟2：若有章節題庫不足，從備用池（其他章節多餘題目）補足
  if (selected.length < 50 && surplusPool.length > 0) {
    const shuffledSurplus = fisherYates(surplusPool);
    selected.push(...shuffledSurplus.slice(0, 50 - selected.length));
  }

  // ── 步驟3：極端情況（備用池也不夠），循環重複已有題目補至50題
  if (selected.length > 0 && selected.length < 50) {
    const base = fisherYates([...selected]);
    let fi = 0;
    while (selected.length < 50) {
      selected.push({ ...base[fi % base.length] });
      fi++;
    }
  }

  if (selected.length === 0) {
    alert(`科目${subject}題庫目前為空，無法組卷！`);
    return;
  }

  // ── 步驟4：整份試卷順序洗牌
  let shuffledExam = fisherYates(selected);

  // ── 步驟5：選項洗牌 + 清除 (A)(B)(C)(D) 前綴 + 修正 correctIndex
  shuffledExam = shuffledExam.map(q => {
    if (!q.options?.length || q.correctIndex == null) return { ...q };
    const cleanOpts = q.options.map(o => String(o).replace(/^\([A-D]\)\s*/i, '').trim());
    const correctText = cleanOpts[q.correctIndex];
    const shuffledOpts = fisherYates(cleanOpts);
    return { ...q, options: shuffledOpts, correctIndex: shuffledOpts.indexOf(correctText) };
  });

  // ── 步驟6：寫入狀態、重置計時器、跳轉考試頁
  examSubject.value = subject;
  examQuestions.value = shuffledExam;
  userAnswers.value = Array(50).fill(null);
  currentQuestionIdx.value = 0;
  examSubmitted.value = false;
  examScore.value = 0;
  expandedAccordion.value = null;
  timer.value = 75 * 60;
  startTimer();
  currentTab.value = 'exam';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const forceSubmitExam = () => {
  stopTimer();
  let correctCount = 0;
  userAnswers.value.forEach((ans, idx) => {
    if (ans === examQuestions.value[idx]?.correctIndex) correctCount++;
  });
  examScore.value = correctCount * 2;
  examSubmitted.value = true;
  const key = examSubject.value === 1 ? 'sub1' : 'sub2';
  examCounts.value[key]++;
  localStorage.setItem('ipas_exam_counts_v1', JSON.stringify(examCounts.value));
  currentTab.value = 'analysis';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const abortExam = () => {
  if (!confirm('🛑 確定要中止本次全真模擬考嗎？')) return;
  stopTimer();
  examQuestions.value = [];
  currentTab.value = 'home';
};

const submitExam = () => {
  if (!confirm('確定要提交卷進行評分嗎？')) return;
  stopTimer();
  let correctCount = 0;
  userAnswers.value.forEach((ans, idx) => {
    if (ans === examQuestions.value[idx].correctIndex) correctCount++;
  });
  examScore.value = correctCount * 2;
  examSubmitted.value = true;
  const key = examSubject.value === 1 ? 'sub1' : 'sub2';
  examCounts.value[key]++;
  localStorage.setItem('ipas_exam_counts_v1', JSON.stringify(examCounts.value));
  currentTab.value = 'analysis';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  stopTimer();
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--;
    else { stopTimer(); forceSubmitExam(); }
  }, 1000);
};

const stopTimer = () => { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } };
const cleanOptionText = (text) => text ? text.replace(/^\([A-D]\)\s*/, '') : '';
const selectOption = (idx) => { if (!examSubmitted.value) userAnswers.value[currentQuestionIdx.value] = idx; };
const prevQuestion = () => { if (currentQuestionIdx.value > 0) currentQuestionIdx.value--; };
const nextQuestion = () => { if (currentQuestionIdx.value < examQuestions.value.length - 1) currentQuestionIdx.value++; };
const toggleAccordion = (idx) => expandedAccordion.value = expandedAccordion.value === idx ? null : idx;

const getRateColor = (rate) => {
  if (rate >= 0.8) return 'text-green-400';
  if (rate >= 0.6) return 'text-amber-400';
  return 'text-red-400';
};

const getBarColor = (rate) => {
  if (rate >= 0.8) return 'bg-green-500';
  if (rate >= 0.6) return 'bg-amber-500';
  return 'bg-red-500';
};

const getOptionClass = (idx) => {
  const isSelected = userAnswers.value[currentQuestionIdx.value] === idx;
  const isCorrectOption = currentQuestion.value.correctIndex === idx;
  if (!examSubmitted.value) return isSelected ? 'option-btn--selected' : 'hover:border-slate-600 hover:bg-slate-800/50';
  if (isCorrectOption) return 'option-btn--correct';
  return isSelected ? 'option-btn--wrong' : 'option-btn--dim';
};

const weaknessAnalysis = computed(() => {
  if (examQuestions.value.length === 0) return [];
  const analysis = {};
  examQuestions.value.forEach((q, idx) => {
    const mapInfo = chapterMapping[q.detail_code] || { part: '其他篇章', chapter: q.detail_code || '未知' };
    const partName = mapInfo.part;
    const chapterName = mapInfo.chapter;
    const isCorrect = userAnswers.value[idx] === q.correctIndex;
    if (!analysis[partName]) analysis[partName] = { category: partName, correct: 0, total: 0, detailsMap: {} };
    analysis[partName].total++;
    if (isCorrect) analysis[partName].correct++;
    if (!analysis[partName].detailsMap[chapterName]) analysis[partName].detailsMap[chapterName] = { name: chapterName, correct: 0, total: 0 };
    analysis[partName].detailsMap[chapterName].total++;
    if (isCorrect) analysis[partName].detailsMap[chapterName].correct++;
  });
  return Object.values(analysis).map(part => ({
    category: part.category, correct: part.correct, total: part.total,
    details: Object.values(part.detailsMap).sort((a, b) => a.name.localeCompare(b.name))
  }));
});

// =================【🔥 指南單元練習核心引擎區】=================
const bookAllAnswered = computed(() => bookUserAnswers.value.every(ans => ans !== null));

const getBookStats = (chId) => {
  const records = bookHistoryMaster.value[chId];
  if (!records || records.length === 0) return null;
  const scores = records.map(r => r.score);
  const lastRecord = records[records.length - 1];
  return { maxScore: Math.max(...scores), lastScore: lastRecord.score, lastTime: lastRecord.timeSpentStr };
};

const launchBookQuiz = (chId, chName) => {
  activeBookChId.value = chId;
  activeBookChName.value = chName;
  activeBookQIdx.value = 0;
  bookQuizAnswers.value = bookQuizData[chId] || [];
  bookUserAnswers.value = Array(bookQuizAnswers.value.length).fill(null);
  bookQuizSubmitted.value = false;
  comparison看板.value = null;
  bookTimer.value = 0;
  bookQuizActive.value = true;
  startBookTimer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const selectBookOption = (optionIdx) => {
  if (!bookQuizSubmitted.value) bookUserAnswers.value[activeBookQIdx.value] = optionIdx;
};

const getBookOptionClass = (idx) => {
  const isSelected = bookUserAnswers.value[activeBookQIdx.value] === idx;
  const isCorrect = bookQuizAnswers.value[activeBookQIdx.value] === idx;
  if (!bookQuizSubmitted.value) return isSelected ? 'option-btn--selected !border-sky-500 !bg-sky-950/40 text-sky-200' : 'hover:border-slate-600 hover:bg-slate-800/50';
  if (isCorrect) return 'option-btn--correct';
  return isSelected ? 'option-btn--wrong' : 'option-btn--dim opacity-0'; 
};

const calculateBookScore = () => {
  let correctCount = 0;
  bookUserAnswers.value.forEach((ans, idx) => { if (ans === bookQuizAnswers.value[idx]) correctCount++; });
  return { correctCount, finalScore: Math.round((correctCount / bookQuizAnswers.value.length) * 100) };
};

const executeSaveBookHistory = (finalScore, correctCount, timeStr) => {
  const chapterHistory = bookHistoryMaster.value[activeBookChId.value] || [];
  let compResult = { isFirst: true, scoreDiff: 0, prevScore: 0, timeDiffStr: '基準鎖定', timeDiffRaw: 0, prevTimeStr: '--:--' };
  
  if (chapterHistory.length > 0) {
    const prev = chapterHistory[chapterHistory.length - 1];
    compResult.isFirst = false;
    compResult.prevScore = prev.score;
    compResult.scoreDiff = finalScore - prev.score;
    compResult.prevTimeStr = prev.timeSpentStr;
    compResult.timeDiffRaw = bookTimer.value - prev.timeSpentSeconds;
    if (compResult.timeDiffRaw <= 0) compResult.timeDiffStr = `⚡ 快了 ${formatBookTimer(Math.abs(compResult.timeDiffRaw))}`;
    else compResult.timeDiffStr = `🐢 慢了 ${formatBookTimer(compResult.timeDiffRaw)}`;
  }
  comparison看板.value = compResult;

  const newRecord = {
    date: new Date().toLocaleString(),
    score: finalScore,
    timeSpentSeconds: bookTimer.value,
    timeSpentStr: timeStr,
    correctCount: correctCount
  };
  
  if (!bookHistoryMaster.value[activeBookChId.value]) bookHistoryMaster.value[activeBookChId.value] = [];
  bookHistoryMaster.value[activeBookChId.value].push(newRecord);
  localStorage.setItem('ipas_book_history_v2', JSON.stringify(bookHistoryMaster.value));
};

const generateTempComparison = (finalScore) => {
  const chapterHistory = bookHistoryMaster.value[activeBookChId.value] || [];
  let compResult = { isFirst: true, scoreDiff: 0, prevScore: 0, timeDiffStr: '本次未記錄', timeDiffRaw: 0, prevTimeStr: '--:--' };
  if (chapterHistory.length > 0) {
    const prev = chapterHistory[chapterHistory.length - 1];
    compResult.isFirst = false;
    compResult.prevScore = prev.score;
    compResult.scoreDiff = finalScore - prev.score;
    compResult.prevTimeStr = prev.timeSpentStr;
    compResult.timeDiffRaw = bookTimer.value - prev.timeSpentSeconds;
    if (compResult.timeDiffRaw <= 0) compResult.timeDiffStr = `⚡ 快了 ${formatBookTimer(Math.abs(compResult.timeDiffRaw))}`;
    else compResult.timeDiffStr = `🐢 慢了 ${formatBookTimer(compResult.timeDiffRaw)}`;
  }
  comparison看板.value = compResult;
};

// 正常點選對答案
const evaluateBookQuiz = () => {
  stopBookTimer();
  const { finalScore, correctCount } = calculateBookScore();
  const timeStr = formatBookTimer(bookTimer.value);

  const wantSave = confirm('恭喜您完成全部作答！\n是否將這次的測驗結果記錄下來？');
  if (wantSave) {
    executeSaveBookHistory(finalScore, correctCount, timeStr);
  } else {
    generateTempComparison(finalScore); 
  }

  bookQuizSubmitted.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 作答中途點選返回
const exitBookQuiz = () => {
  if (!bookQuizSubmitted.value) {
    if (bookAllAnswered.value) {
      const wantSave = confirm('您已完成全部作答，是否將這次的測驗結果記錄下來？');
      const wantReturn = confirm('是否確定返回？');
      
      if (wantSave) {
        const { finalScore, correctCount } = calculateBookScore();
        const timeStr = formatBookTimer(bookTimer.value);
        executeSaveBookHistory(finalScore, correctCount, timeStr);
      }
      
      if (!wantReturn) {
         if (wantSave) {
             bookQuizSubmitted.value = true;
             window.scrollTo({ top: 0, behavior: 'smooth' });
         }
         return; 
      }
    } else {
      const wantReturn = confirm('是否確定返回？\n(您尚未完成全部作答，本次作答將不被記錄)');
      if (!wantReturn) return;
    }
  }
  stopBookTimer();
  bookQuizActive.value = false;
};

const startBookTimer = () => {
  stopBookTimer();
  bookTimerInterval = setInterval(() => { bookTimer.value++; }, 1000);
};
const stopBookTimer = () => { if (bookTimerInterval) { clearInterval(bookTimerInterval); bookTimerInterval = null; } };
const formatBookTimer = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

</script>

<style>
@reference "tailwindcss";

body {
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  background-color: #020617; 
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.option-btn {
  @apply w-full p-3.5 rounded-xl border border-slate-700 bg-slate-800/30 
         flex items-center gap-3 transition-all duration-200 outline-none;
}
.option-btn--selected {
  @apply bg-violet-900/50 border-violet-600 text-violet-100;
}
.option-btn--selected .option-letter {
  @apply bg-violet-700 text-violet-100;
}
.option-btn--correct {
  @apply bg-green-900/40 border-green-600 text-green-100;
}
.option-btn--correct .option-letter {
  @apply bg-green-700 text-green-100;
}
.option-btn--wrong {
  @apply bg-red-900/40 border-red-600 text-red-100;
}
.option-btn--wrong .option-letter {
  @apply bg-red-700 text-red-100;
}
.option-btn--dim {
  @apply opacity-40;
}

/* 重點筆記 modal 動畫 */
.notes-modal-enter-active,
.notes-modal-leave-active {
  transition: opacity 0.2s ease;
}
.notes-modal-enter-active .notes-sheet,
.notes-modal-leave-active .notes-sheet {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.notes-modal-enter-from,
.notes-modal-leave-to {
  opacity: 0;
}
.notes-modal-enter-from .notes-sheet,
.notes-modal-leave-to .notes-sheet {
  transform: translateY(100%);
}

/* 重點筆記內容排版 */
.notes-content strong {
  @apply text-slate-100 font-semibold;
}
.notes-content h3 {
  @apply text-sm font-bold text-blue-400 mb-1.5 mt-3;
}
.notes-content ul {
  @apply list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm;
}
.notes-content li {
  @apply leading-relaxed;
}

/* 試題解析內容排版 */
.analysis-content .analysis-item {
  @apply flex gap-3.5 py-4 border-b border-slate-800/60 last:border-0;
}
.analysis-content .analysis-num {
  @apply flex-shrink-0 w-9 h-9 rounded-full bg-amber-950 border border-amber-800/60 text-amber-400 text-sm font-bold flex items-center justify-center mt-0.5;
}
.analysis-content p {
  @apply text-base text-slate-200 leading-loose;
}

.btn-primary {
  @apply bg-violet-600 hover:bg-violet-500 active:bg-violet-700
         text-white font-semibold text-sm px-5 py-3 rounded-xl
         transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none;
}
.btn-secondary {
  @apply bg-slate-800 hover:bg-slate-700 active:bg-slate-900
         border border-slate-700
         text-slate-200 font-semibold text-sm px-5 py-3 rounded-xl
         transition-all duration-150 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none;
}
</style>