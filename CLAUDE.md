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

部署至 GitHub Pages，`vite.config.js` 設定 `base: '/ipas-ai-quiz-app/'`，所有資源路徑均以此為前綴。

## 架構

**單一大元件架構**：所有商業邏輯與 UI 集中在 `src/App.vue`（~1000 行），分為五個 tab：`home`、`exam`、`book`、`tracker`、`analysis`，以 `v-if/v-else-if` 切換渲染。

### 題庫資料流

- `src/data/questions.json`（~293KB）在 `onMounted` 以 `import.meta.glob` 動態載入，支援未來拆分多個 JSON 檔案。
- 每筆題目必要欄位：`question`、`options`（字串陣列）、`correctIndex`（0-based 整數）、`detail_code`（如 `L11101`）、`category`。

### 模擬考抽題邏輯（`App.vue` 內 `startExam()`）

`detail_code` 對應兩科的 CH 標籤映射（`sub1Codes` / `sub2Codes`），採**比例配額 + 最大餘數法**從各章節抽足 50 題，再對整卷與各題選項分別執行 Fisher-Yates 洗牌，並自動修正 `correctIndex`。

### 指南單元練習（`bookQuizData`）

16 章答案直接硬編碼為 `App.vue` 頂層的 `bookQuizData` 物件（key 格式 `p{篇}_c{章}`，值為 0-based 答案陣列）。使用者對照紙本指南盲選答案，提交後與標準答案比對並記錄歷次成績。

### localStorage 鍵值

| Key | 用途 |
|-----|------|
| `ipas_book_history_v2` | 各章節歷次練習紀錄（分數、耗時、日期） |
| `ipas_tracker_v1` | 進度追蹤勾選狀態（`{id}_read`、`{id}_quiz`） |

### `src/utils/` 注意事項

`src/utils/` 下有三個工具模組（`examConfig.js`、`shuffle.js`、`wrongBook.js`），但**目前 `App.vue` 並未 import 這些模組**，其邏輯以內聯方式重新實作於 `App.vue` 內。這些 utils 是預留的重構出口，修改時須注意兩者可能存在差異（例如 `examConfig.js` 使用固定官方配額，而 `App.vue` 使用比例分配演算法）。

### `src/data/chapterNotes.js`

匯出 `chapterNotes` 物件，key 為章節 ID（`p1_c1` 等），值為 HTML 字串，直接以 `v-html` 渲染於重點筆記 Modal。

## PWA

`vite-plugin-pwa` 設定 Workbox 快取所有靜態資源（含 JSON 題庫），支援 100% 離線使用。`maximumFileSizeToCacheInBytes` 設為 10MB 以容納大型題庫。
