# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本（輸出至 dist/）
npm run preview  # 預覽建置結果
```

沒有 lint 或測試指令，專案目前無測試框架。

## 部署

推送至 `main` 分支會觸發 `.github/workflows/deploy.yml` 自動建置並部署到 GitHub Pages。`vite.config.js` 設定 `base: '/ipas-ai-quiz-app/'`，所有資源路徑均以此為前綴，本機 `npm run dev` 測試時注意路徑差異。

## 架構

**單一大元件架構**：所有商業邏輯與 UI 集中在 `src/App.vue`（~1100 行），以 `currentTab`（ref）切換 tab：`home`、`exam`、`analysis`、`tracker`、`book`、`browse`、`terms`，以 `v-if/v-else-if` 渲染，`switchTab()` 負責切換並處理離開頁面前的確認邏輯（如作答中離開模擬考）。

`browse`（題庫瀏覽）沿用 `pastExamSessions` 依梯次＋科目列出全部題目，可展開查看正確答案與解說；純閱讀用途，不寫入 `seenQuestionIds`／`examCounts`。解說框下方的「📖 相關名詞」用 `RelatedTerms.vue`（見下方，名詞卡＋延伸名詞），題目收合時元件卸載、名詞卡跟著關閉；列表上標「📖 延伸 N」的題目有延伸名詞（`extendedCount`）。全真模擬考作答中刻意不顯示名詞，以免提示答案；交卷後才顯示（見下方 `RelatedTerms.vue`）。

### `components/RelatedTerms.vue`（作答後的「📖 相關名詞」）

- 用在 `App.vue` 的模擬考畫面（`examSubmitted` 後；首頁模擬考、全真模擬考、歷屆考古題、紀錄回顧共用）與題庫瀏覽、`PracticeTab.vue` 的作答回饋，以及練習題瀏覽
- props：`qid`（題號）、`termIds`（練習題自帶 `term_ids`；沒給時用 `question-terms.json` 依題號查，即考古題）
- 先列名詞卡（考試範圍，藍色），再列延伸名詞（灰色虛線、標「延伸」）；同一題一次只展開一張，換題自動收起
- 延伸名詞資料在 `src/data/practice/extended-terms.json`：題號（字串）→ `[{ name, note, see? }]`，`see` 是可連過去的名詞卡 id。延伸名詞＝練習題或考古題解說裡出現、但考古題題目與選項、名詞卡名稱與別名都沒出現的技術名詞（2026-10-27 建立，134 題 163 筆）；只是補充說明，不是考試範圍

### `src/data/terms/`（相關名詞卡片）

- `terms.json`：名詞卡片陣列，欄位為 `id`、`name`、`units`（評鑑內容代碼）、`oneLiner`、`analogy`、`useCases`、`distinguish`、`trap`、`sources`、`status`（`已查證`／`待確認`）。
- `question-terms.json`：題目 `id` → 名詞 `id` 陣列（依「題幹 → 正確答案 → 錯誤選項 → 解說」排序）。
- 兩檔放在子資料夾，是為了避開題庫載入用的 `import.meta.glob('./data/*.json')`（非遞迴）；若放在 `src/data/` 根目錄會被誤當成題目載入。
- 撰寫依據的官方文件放在 `docs/official/`（不會被打包進網站）；名詞清單與查證計畫見根目錄 `terms-list.md`。

### 題庫資料流

- `src/data/questions.json`（400 題，~412KB）在 `onMounted` 以 `import.meta.glob` 動態載入，支援未來拆分多個 JSON 檔案。
- 每筆題目必要欄位：`id`（全域唯一整數）、`question`、`options`（字串陣列）、`correctIndex`（0-based 整數）、`detail_code`（如 `L11101`）、`category`。

### 模擬考抽題邏輯（`App.vue` 內 `startExam()`）

選項洗牌的例外：解說用 A/B/C/D 指稱選項的題目（`utils/optionLetters.js` 的 `mentionsOptionLetters()`，考古題約 13 題＋幾題誤判）維持官方順序不洗牌，否則解說字母會跟畫面對不起來。`App.vue` 的 `startExam()` 與 `PracticeTab.vue` 的 `toItem()` 都要套用；歷屆考古題模式本來就不洗牌。

`detail_code` 對應兩科的 CH 標籤映射（`sub1CHMap` / `sub2CHMap`），依 `sub1Quotas` / `sub2Quotas` 這兩個**靜態寫死的固定配額字典**從各章節抽足 50 題（`EXAM_TOTAL_QUESTIONS`），再對整卷與各題選項分別執行 Fisher-Yates 洗牌，並自動修正 `correctIndex`。配額數字並非執行期動態計算，而是依「115年第一~三次」+「114年第四次」共 4 梯次官方公告試題（每梯次固定50題/科）平均後以最大餘數法（Hamilton apportionment）取整而來；未來題庫再擴充新梯次時，應重新手動執行這個計算並更新配額數字，而不是自動重算。

**未出現題目優先機制**：`UNSEEN_PRIORITY_GRACE_ATTEMPTS`（目前為 `1`）控制從第幾次模擬考開始啟用——該科目測驗次數達門檻後，每章節抽題時會把 `seenQuestionIds`（曾在已交卷模擬考出現過的題目 id 集合）裡尚未出現過的題目排到前面優先抽取，抽完才輪到已出現過的題目；當某章節所有題目都已出現過一輪時，該章節的追蹤會自動重置、重新開始新一輪。僅在交卷（`forceSubmitExam`/`submitExam` 內的 `markExamQuestionsSeen()`）時才會寫入紀錄，中途放棄（`abortExam`）不計。

### 練習題與模擬考錯題（`components/PracticeTab.vue`）

原本的「練習題」tab 已移進「全真模擬考」頁：選單的「科目一／科目二」旁有「練習題」，下方有「模擬考錯題」。`App.vue` 的 `examPanel`（`null`／`'practice'`／`'exam-wrong'`）決定顯示哪個面板，同一個元件用 `view` prop 切換：
- `view="practice"`：練習題（分「第一回」「第二回」兩個區塊，各依科目、難度）、練習題錯題
- `view="exam-wrong"`：模擬考錯題（只出官方考古題的錯題）

練習題分回存放在 `src/data/practice/`：第一回 `practice.json`、第二回 `practice2.json`（各兩科 50 題，id 分別為 `P01xx`～`P03xx`、`P0401`～`P0500`）。`ROUNDS` 決定有幾回，各回題目不混在一起出；錯題本與錯題複習則把各回合在一起查。

練習題選單每一回、每個科目旁有「📚 瀏覽」（`browsing`＝`{ round, subject }`）：照題號列出該回該科的題目，可展開看答案、解說與相關名詞，並標出有延伸名詞的題目；純閱讀，不記錄作答。

作答中可按「暫停」；切到別的 tab（元件卸載）或 App 被收到背景（`visibilitychange`）時也會自動存一份，回來從「暫停中的練習」繼續。

### 弱點分析分頁（`analysis`）

上半部「這次考試」是剛交卷那一份的雙層分析（`weaknessAnalysis`，交卷後才有）；下半部「長期累積」用 `components/CumulativeWeakness.vue` 顯示兩份分開存的統計（`utils/answerStats.js`）：
- `kind="exam"` 累積弱點：全真模擬考與歷屆考古題交卷時，由 `App.vue` 的 `recordExamAnswers()` 寫入
- `kind="practice"` 練習題弱點：`PracticeTab.vue` 在「練習題」模式每答一題寫入；錯題複習不算（只出答錯過的題，會讓答對率偏低）

練習題不是官方題，所以和考試實力分開存、分開顯示，不要合併。

### 指南單元練習（`bookQuizData`）

16 章答案直接硬編碼為 `App.vue` 頂層的 `bookQuizData` 物件（key 格式 `p{篇}_c{章}`，值為 0-based 答案陣列）。使用者對照紙本指南盲選答案，提交後與標準答案比對並記錄歷次成績。

### localStorage 鍵值

| Key | 用途 |
|-----|------|
| `ipas_book_history_v2` | 各章節歷次練習紀錄（分數、耗時、日期） |
| `ipas_tracker_v1` | 進度追蹤勾選狀態（`{id}_read`、`{id}_quiz`） |
| `ipas_exam_counts_v1` | 各科目（`sub1`/`sub2`）模擬考累計交卷次數 |
| `ipas_seen_question_ids_v1` | 曾在已交卷模擬考出現過的題目 `id` 陣列（未出現題目優先機制用） |
| `ipas-wrong-book` | 錯題本（考古題與練習題共用，用題目 id 區分：練習題 id 是 `P` 開頭） |
| `ipas_practice_paused_v1_practice`／`ipas_practice_paused_v1_exam-wrong` | 練習題、模擬考錯題各一份暫停中的作答進度 |
| `ipas_code_stats_v1` | 累積弱點：模擬考＋考古題各評鑑代碼的答對數／作答數 |
| `ipas_practice_code_stats_v1` | 練習題弱點：練習題各評鑑代碼的答對數／作答數（和上一列分開） |

### `src/utils/` 注意事項

`src/utils/` 下有三個工具模組（`examConfig.js`、`shuffle.js`、`wrongBook.js`），但**目前 `App.vue` 並未 import 這些模組**，其邏輯以內聯方式重新實作於 `App.vue` 內。這些 utils 是預留的重構出口；`examConfig.js` 跟 `App.vue` 其實都是用固定配額字典（並非比例分配演算法），只是 `examConfig.js` 裡的配額數字是舊版、並未隨題庫更新同步調整（因為它本來就是死碼，未被 import），修改時不要誤以為兩邊配額一致。

### `src/data/chapterNotes.js` 與 `src/data/chapterAnalysis.js`

兩者皆匯出以章節 ID（`p1_c1` 等）為 key 的物件，值為 HTML 字串，直接以 `v-html` 渲染：`chapterNotes` 用於重點筆記 Modal，`chapterAnalysis` 用於「指南單元」的試題解析 Modal（`activeAnalysisId` 控制目前顯示的章節）。修改內容時兩者皆需維持相同的 HTML class 結構（如 `analysis-item`/`analysis-num`）才能吃到既有樣式。

## PWA

`vite-plugin-pwa` 設定 Workbox 快取所有靜態資源（含 JSON 題庫），支援 100% 離線使用。`maximumFileSizeToCacheInBytes` 設為 10MB 以容納大型題庫。
