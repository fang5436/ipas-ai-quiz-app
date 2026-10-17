# 相關名詞清單（步驟 1：待審核）

> 這份清單只列出名詞、題數與查證計畫，還沒有開始寫卡片。

## 一、官方資料盤點

### 專案內已有的資料

| 檔名 | 內容概要 | 能否作為官方依據 |
|---|---|---|
| `src/data/questions.json` | 400 題官方公告試題：114 年第四次、115 年第一～三次，每梯次每科 50 題。每題有評鑑內容代碼 `detail_code`、選項、官方答案 `correctIndex`、解說 `explanation` | 題目與答案 ✅ 是官方的；**解說是另外補寫的，不是官方內容**，只能參考 |
| `src/data/chapterNotes.js` | 指南 16 章的重點筆記（由 NotebookLM 整理） | ❌ 二手整理，只能參考 |
| `src/data/chapterAnalysis.js` | 指南各章單元模擬試題的解析 | ⚠️ 出處不明，只能參考 |
| `CLAUDE.md`、`README.md` | 開發說明（README 是 Vite 範本） | ❌ 與內容無關 |

**專案內沒有**簡章、評鑑內容範圍、學習指引這幾份 PDF。

### 本次從 iPAS 官網補查到的資料

| 文件 | 網址 | 用途 |
|---|---|---|
| 《AI 應用規劃師能力鑑定 評鑑內容範圍參考》115.02 更新 | [ipas.org.tw](https://www.ipas.org.tw/api/proxy/uploads/certification_news/05a129ac3ddb4b3da23fef4abecfa0e3/AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A_%E8%A9%95%E9%91%91%E5%85%A7%E5%AE%B9%E7%AF%84%E5%9C%8D%E5%8F%83%E8%80%83_11502_20260226174411.pdf) | L11101–L12303 的官方名稱與範圍說明（下表的單元名稱都依這份文件） |
| 《115 年度 AI 應用規劃師能力鑑定簡章》115.04 版 | [ipas.org.tw](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0410_20260410115646.pdf) | 已找到連結，尚未細讀 |

評鑑內容範圍點名的官方文件，可以作為法規、治理類卡片的查證依據：

- 數位發展部《公部門人工智慧應用參考手冊》
- 數位發展部《AI 產品與系統評測》
- 金管會《金融業運用人工智慧（AI）指引》
- 經濟部產業發展署《AI 導入指引》

## 二、統計方式

- **題數**：用關鍵字（中英文同義詞）比對「題目＋選項＋解說」，計算每個名詞出現在幾題。
  - 這是**概估**，有一些誤判與漏判。
  - 例如 `llm` 有 75 題、`rag` 有 36 題，很多題只是順帶提到。
  - 步驟 3 產生 `question-terms.json` 時，會逐題人工確認，只保留和解題真正相關的名詞。
- **分組**：名詞放在「出現最多次的那個評鑑內容代碼」底下；「也出現在」欄位列出其他代碼及題數。
- **🌐 需上網查證**：法規、政策、政府指引、標準規範，以及新興或定義有爭議的名詞。其餘教科書等級的名詞依知識撰寫，再附一個可靠來源。

## 三、總覽

- 名詞總數：**260** 個，其中 🌐 需上網查證 **37** 個。
- 已依你的確認，刪除 7 個只當干擾選項的名詞：具身 AI、查詢擴展、語意快取、安全多方計算、Target／Binary Encoding、文字探勘、決策支援系統。

## 四、開始寫卡片前發現的問題（尚未做完整交叉檢查）

1. **角色設定提示的名稱**（115032031）
   - 官方答案把「請扮演…資深客服」這種角色設定稱為「情境設定提示（Context Prompting）」。
   - 但常見說法是 Role Prompting，而 115032021 又把 Role Prompting 列為干擾選項。
   - 這張卡片寫法要配合官方答案，同時說明兩種叫法，避免與題目矛盾。
2. **GPT-OSS 參數量**（114041024）
   - 題目寫「從 20 億提升至 120 億」。
   - 依我的了解，gpt-oss-20b / 120b 實際約為 210 億 / 1170 億參數，題目數字疑似誤植。步驟 2、3 會上網查證。
   - 不影響這題答案。
3. **金融 AI 規範名稱不一致**
   - 題目（114041010、115011013、115021008）引用《金融機構運用人工智慧技術作業規範》。
   - 官方評鑑內容範圍寫的是金管會《金融業運用人工智慧（AI）指引》。
   - 兩者可能是不同機關發布的不同文件，要上網查證後分成兩張卡片，或在卡片中說明差異。
4. **題目中的譯名不一致**，卡片會一併列出：
   - VAE 有時寫成「隱變量自編碼器」（115011010）
   - RNN 有時寫成「遞迴神經網路」（115012005）
   - MCP 有時寫成「模型內容協定」（115032022、115032026）
   - 感測器網路寫成「感知器網路」（115011002）
5. **題外發現：App 的章節對照表與官方代碼對不上**
   - `src/App.vue` 的 `sub1CHMap` / `sub2CHMap` 和官方評鑑內容名稱不一致。
   - 例如 `L11402`（鑑別式 AI 與生成式 AI 的整合應用）被對到「CH1-2 AI 治理概念」，`L12202`（如何善用生成式 AI 工具）被對到「CH5-1 Low code 基本概念」。
   - 因此模擬考的「弱點分析」章節標籤可能是錯的。這不在這次任務範圍內，先記下來，之後由你決定要不要修。

## 五、名詞清單（依評鑑內容代碼分組）

### L11101 AI 的定義與分類（14 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 電腦視覺（Computer Vision） | `computer-vision` | 8 | L11102(2) L11302(1) L12202(1) |  |  |
| 自然語言處理 NLP | `nlp` | 8 | L11102(2) L11201(1) L11202(1) L12202(1) |  |  |
| 推薦系統（Recommendation System） | `recommender-system` | 8 | L11102(1) L11203(1) L11301(1) L11302(1) L12303(2) |  |  |
| 影像分類（Image Classification） | `image-classification` | 6 | L11301(2) L12303(1) |  |  |
| 人臉辨識（Face Recognition） | `face-recognition` | 6 | L11203(2) |  |  |
| 物件偵測（Object Detection） | `object-detection` | 5 | L11203(1) L11302(1) |  |  |
| 影像分割（Image Segmentation） | `image-segmentation` | 3 | L11102(1) |  |  |
| 光學字元辨識 OCR | `ocr` | 3 | L11201(1) L12102(1) |  |  |
| 弱 AI（Narrow AI） | `weak-ai` | 2 | — |  |  |
| 強 AI／通用人工智慧 AGI | `strong-ai-agi` | 2 | — |  |  |
| 超級人工智慧 ASI | `asi` | 2 | — |  |  |
| 預測性維護（Predictive Maintenance） | `predictive-maintenance` | 2 | L11302(1) |  |  |
| 描述性／診斷性／預測性分析 | `analytics-types` | 2 | L11202(1) |  |  |
| 圖靈測試（Turing Test） | `turing-test` | 1 | — |  |  |

### L11102 AI 治理概念（23 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 可解釋 AI（XAI） | `xai` | 17 | L11101(1) L12303(4) |  |  |
| 演算法偏見與公平性（Fairness） | `algorithmic-bias` | 13 | L12303(6) |  |  |
| LIME（局部可解釋模型無關解釋） | `lime` | 6 | — |  |  |
| 全域解釋 vs 局部解釋 | `global-local-explanation` | 6 | — |  |  |
| 當責性／責任歸屬（Accountability） | `accountability` | 5 | L12303(2) | 🌐 | 治理概念 |
| 顯著性圖（Saliency Map） | `saliency-map` | 4 | — |  |  |
| 金融機構運用人工智慧技術作業規範 | `fsc-ai-guidelines` | 3 | — | 🌐 | 金管會規範 |
| AI 產品與系統評測中心（數位發展部） | `ai-evaluation-center` | 3 | — | 🌐 | 政府機關評測項目 |
| SHAP 值（Shapley 值） | `shap` | 3 | — |  |  |
| 代理變數（Proxy Variable）與間接歧視 | `proxy-variable` | 3 | L12303(1) |  |  |
| 資料去偏（Data Debiasing） | `data-debiasing` | 3 | L12303(1) |  |  |
| 人工智慧基本法 | `ai-basic-act` | 2 | — | 🌐 | 法規，可能已有更新 |
| AI 倫理原則（透明、公平、隱私、當責…） | `ai-ethics-principles` | 2 | L11203(1) | 🌐 | 各機構原則清單不同，需確認題目所指版本 |
| 部分依賴圖 PDP | `pdp` | 2 | — |  |  |
| 反事實解釋（Counterfactual Explanation） | `counterfactual-explanation` | 2 | — |  |  |
| 代理模型（Surrogate Model） | `surrogate-model` | 2 | — |  | 易與「代理變數」混淆 |
| 特徵選擇（Feature Selection） | `feature-selection` | 2 | L11202(1) |  |  |
| 越獄（Jailbreak） | `jailbreak` | 2 | L12303(1) |  |  |
| 人在迴圈上（Human-over-the-loop, HOTL） | `human-over-the-loop` | 1 | — | 🌐 | HITL／HOTL 定義各家說法不一 |
| 監理沙盒（Regulatory Sandbox） | `regulatory-sandbox` | 1 | — | 🌐 | 法規／政策 |
| 公部門人工智慧應用參考手冊 | `public-sector-ai-handbook` | 1 | — | 🌐 | 政府指引 |
| 排列特徵重要性（Permutation Feature Importance） | `permutation-importance` | 1 | — |  |  |
| 事後解釋（Post-hoc）vs 內建可解釋 | `post-hoc-explanation` | 1 | — |  |  |

### L11201 資料基本概念與來源（5 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 結構化／半結構化／非結構化資料 | `data-structure-types` | 15 | L11101(1) L11302(1) L11401(1) L12101(1) L12201(4) L12202(3) |  |  |
| 感測器網路（Sensor Network）與物聯網 IoT | `sensor-network` | 3 | L11302(1) L12303(1) |  | 題目用「感知器網路」，常見譯名為「感測器網路」 |
| 專家系統與規則引擎 | `expert-system` | 3 | L12101(1) L12202(1) |  |  |
| 資料整合（Data Integration） | `data-integration` | 3 | L11202(1) L12101(1) |  |  |
| 大數據 V 特性（Volume、Velocity、Variety…） | `big-data-v` | 2 | — | 🌐 | 3V／4V／5V 說法不一 |

### L11202 資料整理與分析流程（27 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 特徵工程（Feature Engineering） | `feature-engineering` | 15 | L11301(1) L11302(1) L11402(1) L12101(4) L12102(1) L12303(1) |  |  |
| 標準化（Z-score）與正規化 | `standardization-normalization` | 11 | L11301(2) L11302(1) |  | 易與「正則化」混淆 |
| 集中趨勢與離散指標（平均數、中位數、標準差…） | `central-tendency` | 9 | — |  |  |
| 離群值（Outlier）與 IQR | `outlier` | 9 | L11301(2) |  |  |
| One-hot 編碼 | `one-hot` | 8 | — |  |  |
| 偏態（左偏／右偏） | `skewness` | 7 | — |  |  |
| 梯度下降與反向傳播 | `gradient-descent` | 6 | L11301(1) L11302(2) L12202(1) |  |  |
| 資料清理與前處理 | `data-cleaning` | 5 | L11102(1) L11201(1) |  |  |
| 資料洩漏（Data Leakage） | `data-leakage` | 5 | L11301(1) L12303(1) |  | 題目有時把隱私外洩也寫成「資料外洩」，意義不同 |
| 合成資料（Synthetic Data）擴增訓練集 | `synthetic-data` | 5 | L11402(1) L12201(1) L12202(1) L12303(1) |  |  |
| 主成分分析 PCA（降維） | `pca` | 4 | L11301(1) L12202(1) |  |  |
| 遺漏值處理（Missing Value） | `missing-value` | 4 | L11102(1) L12303(1) |  |  |
| 直方圖（Histogram） | `histogram` | 3 | — |  |  |
| 寬深模型（Wide & Deep） | `wide-and-deep` | 3 | L11302(1) |  |  |
| 對數轉換（Log Transformation） | `log-transform` | 2 | — |  |  |
| Label Encoding（標籤編碼） | `label-encoding` | 2 | — |  |  |
| 特徵交叉（Feature Cross） | `feature-cross` | 2 | — |  |  |
| 特徵萃取（Feature Extraction） | `feature-extraction` | 2 | L11302(1) |  |  |
| SMOTE 過採樣 | `smote` | 2 | L11302(1) |  |  |
| 時間序列資料的切分與抽樣 | `time-series-split` | 2 | L11301(1) |  |  |
| 梯度提升（XGBoost） | `gradient-boosting` | 2 | L11302(1) |  |  |
| ETL（萃取、轉換、載入） | `etl` | 1 | — |  |  |
| 探索性資料分析 EDA | `eda` | 1 | — |  |  |
| 散佈圖（Scatter Plot） | `scatter-plot` | 1 | — |  |  |
| 區間化（Binning） | `binning` | 1 | — |  |  |
| 序數編碼（Ordinal Encoding） | `ordinal-encoding` | 1 | — |  |  |
| 二分搜尋（Binary Search） | `binary-search` | 1 | — |  |  |

### L11203 資料隱私與安全（9 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 去識別化與匿名化 | `de-identification` | 11 | L11402(1) L12302(1) L12303(4) | 🌐 | 涉及個資法定義 |
| 差分隱私（Differential Privacy） | `differential-privacy` | 5 | L11401(1) L12303(1) |  |  |
| 雜湊（Hashing） | `hashing` | 4 | L12303(2) |  |  |
| 資料遮罩（Data Masking） | `data-masking` | 3 | L12302(1) L12303(1) |  |  |
| 情感分析（Sentiment Analysis） | `sentiment-analysis` | 3 | L12101(1) L12302(1) |  |  |
| k-匿名化（k-Anonymity） | `k-anonymity` | 2 | — |  |  |
| 假名化（Pseudonymization） | `pseudonymization` | 2 | — |  |  |
| 個人資料保護法（目的外利用） | `personal-data-act` | 2 | — | 🌐 | 法規 |
| 中間人攻擊與傳輸加密 | `mitm` | 1 | — |  |  |

### L11301 機器學習基本原理（37 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 叢集分析（Clustering）與 K-means | `clustering` | 25 | L11202(2) L11302(5) L11401(1) L12202(1) |  |  |
| 強化式學習（Reinforcement Learning） | `reinforcement-learning` | 24 | L11302(2) L11401(4) L12201(2) L12202(2) L12303(1) |  |  |
| 監督式學習（Supervised Learning） | `supervised-learning` | 18 | L11302(2) L11401(1) |  |  |
| 非監督式學習（Unsupervised Learning） | `unsupervised-learning` | 18 | L11401(1) |  |  |
| 深度學習（Deep Learning） | `deep-learning` | 16 | L11102(2) L11202(1) L11302(2) L11401(1) L11402(2) L12101(3) L12303(1) |  |  |
| 過擬合與欠擬合（Overfitting／Underfitting） | `overfitting` | 13 | L11102(1) L11302(1) L11401(2) L12202(1) L12303(2) |  |  |
| 迴歸 vs 分類任務 | `regression-vs-classification` | 12 | L11302(5) L12202(2) |  |  |
| 異常偵測（Anomaly Detection） | `anomaly-detection` | 10 | L11101(1) L11302(3) L12303(1) |  |  |
| 半監督式學習（Semi-supervised Learning） | `semi-supervised-learning` | 10 | — |  |  |
| 損失函數（Loss Function） | `loss-function` | 8 | L11102(1) L11202(1) |  |  |
| 精確率（Precision） | `precision` | 8 | L11202(1) L12201(1) |  |  |
| 召回率（Recall） | `recall` | 8 | L11302(1) L12201(1) |  |  |
| 梯度消失／梯度爆炸 | `vanishing-gradient` | 8 | L11302(3) L11401(2) |  |  |
| 迴歸評估指標（MSE、MAE、RMSE、MAPE、R²） | `regression-metrics` | 7 | L11302(2) |  |  |
| k-fold 交叉驗證（Cross-Validation） | `k-fold` | 6 | L11202(1) L11203(1) |  |  |
| 啟動函數（ReLU、Sigmoid、Tanh） | `activation-function` | 6 | L11302(2) |  |  |
| F1 分數（F1-score） | `f1-score` | 5 | L11302(1) L12201(1) |  |  |
| 準確率（Accuracy） | `accuracy` | 5 | L11302(2) |  |  |
| 類別不平衡（Class Imbalance） | `class-imbalance` | 4 | L11202(1) L11302(1) |  |  |
| 混淆矩陣（TP、FP、FN、TN） | `confusion-matrix` | 4 | L11302(1) |  |  |
| 遷移學習（Transfer Learning） | `transfer-learning` | 3 | — |  |  |
| 關聯規則（Association Rules） | `association-rules` | 3 | — |  |  |
| 判定門檻（Decision Threshold） | `decision-threshold` | 3 | L11302(1) L12303(1) |  |  |
| 正則化 L1／L2（Lasso／Ridge） | `regularization` | 3 | L11102(1) |  | 易與「正規化」混淆 |
| 資料增強（Data Augmentation） | `data-augmentation` | 3 | — |  |  |
| 自監督式學習（Self-supervised Learning） | `self-supervised-learning` | 2 | L11401(1) |  |  |
| 交叉熵損失（Cross-Entropy Loss） | `cross-entropy` | 2 | L12201(1) |  |  |
| 偏差與變異的權衡（Bias-Variance Tradeoff） | `bias-variance` | 2 | — |  |  |
| 優化器（Optimizer） | `optimizer` | 2 | — |  |  |
| 概念漂移（Concept Drift） | `concept-drift` | 2 | L12303(1) |  |  |
| 命名實體辨識 NER | `ner` | 2 | L11401(1) |  |  |
| LoRA 低秩適配與 PEFT | `lora-peft` | 2 | L12202(1) |  |  |
| 探索與利用的權衡 | `exploration-exploitation` | 1 | — |  |  |
| ROC 曲線與 AUC | `roc-auc` | 1 | — |  |  |
| 隨機數種子（Random Seed） | `random-seed` | 1 | — |  |  |
| 批次正規化（Batch Normalization） | `batch-normalization` | 1 | — |  |  |
| 結構化預測（Structured Prediction） | `structured-prediction` | 1 | — |  |  |

### L11302 常見的機器學習模型（15 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| CNN 卷積神經網路 | `cnn` | 15 | L11102(2) L11401(3) L12201(2) L12202(1) |  |  |
| 支援向量機 SVM | `svm` | 11 | L11301(1) L11401(1) |  |  |
| 決策樹（Decision Tree） | `decision-tree` | 10 | L11401(3) |  |  |
| 自編碼器（Autoencoder） | `autoencoder` | 8 | L11401(4) |  |  |
| RNN 循環神經網路 | `rnn` | 7 | L12201(1) |  | 題目亦譯「遞迴神經網路」 |
| LSTM 長短期記憶網路 | `lstm` | 6 | — |  |  |
| K 近鄰演算法 KNN | `knn` | 4 | L11401(2) |  |  |
| 多層感知機 MLP（前饋神經網路） | `mlp` | 4 | L12202(1) |  |  |
| Q-Learning／Deep Q-Learning | `q-learning` | 3 | L11401(1) |  |  |
| 線性迴歸（Linear Regression） | `linear-regression` | 3 | — |  |  |
| 邏輯迴歸（Logistic Regression） | `logistic-regression` | 3 | L11202(1) |  |  |
| Softmax 函數 | `softmax` | 2 | L11401(1) |  |  |
| 序列到序列（Seq2Seq） | `seq2seq` | 2 | L12201(1) |  |  |
| 貝氏分類器（Naive Bayes） | `naive-bayes` | 1 | — |  |  |
| 孤立森林（Isolation Forest） | `isolation-forest` | 1 | — |  |  |

### L11401 鑑別式 AI 與生成式 AI 的基本原理（25 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| GAN 生成對抗網路 | `gan` | 15 | L11101(1) L11302(3) L11402(1) L12201(2) L12202(1) |  |  |
| Transformer | `transformer` | 9 | L11302(1) L12201(2) |  |  |
| 鑑別式 AI vs 生成式 AI | `discriminative-vs-generative` | 9 | L11102(1) L11302(2) L11402(2) L12201(1) |  |  |
| 延遲（Latency）與吞吐量（Throughput） | `latency-throughput` | 7 | L12102(1) L12202(1) L12301(2) |  |  |
| 自注意力機制（Self-Attention） | `self-attention` | 6 | L11102(1) L11302(1) L12201(1) |  |  |
| 對抗性攻擊與對抗性測試 | `adversarial-attack` | 6 | L11302(1) L12201(1) L12303(2) |  |  |
| 隨機森林（Random Forest） | `random-forest` | 5 | L11202(1) L11301(1) L11302(1) |  |  |
| RLHF 人類回饋強化學習 | `rlhf` | 5 | L12202(2) L12303(1) |  |  |
| VAE 變分自編碼器 | `vae` | 4 | L11302(1) |  | 題目亦譯「隱變量自編碼器」 |
| 模式崩潰（Mode Collapse） | `mode-collapse` | 4 | L12202(1) |  |  |
| 批次推論 vs 即時推論 | `batch-vs-realtime-inference` | 4 | L12302(1) |  |  |
| 邊緣運算（Edge Computing） | `edge-computing` | 3 | L12102(1) |  |  |
| 擴展定律（Scaling Law） | `scaling-law` | 2 | L12301(1) |  |  |
| 專家混合模型 MoE | `moe` | 2 | L11402(1) |  |  |
| CLIP（對比式語言-影像預訓練） | `clip` | 2 | L12201(1) |  |  |
| GPT-OSS（OpenAI 開源權重模型） | `gpt-oss` | 2 | L12302(1) | 🌐 | 較新的模型，需確認規格 |
| 條件隨機場 CRF | `crf` | 1 | — |  |  |
| 條件語言模型（Conditional Language Model） | `conditional-lm` | 1 | — |  |  |
| 災難性遺忘（Catastrophic Forgetting） | `catastrophic-forgetting` | 1 | — |  |  |
| 剪枝（Pruning） | `pruning` | 1 | — |  |  |
| 模型量化（Quantization） | `quantization` | 1 | — |  |  |
| GRPO（群組相對策略優化） | `grpo` | 1 | — | 🌐 | 較新的技術 |
| Flash Attention | `flash-attention` | 1 | — |  |  |
| DINO（自監督影像模型） | `dino` | 1 | — |  |  |
| 長上下文資訊遺失（Lost in the Middle） | `long-context-degradation` | 1 | — | 🌐 | 研究名詞，需確認出處 |

### L11402 鑑別式 AI 與生成式 AI 的整合應用（2 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 增量索引更新（Incremental Indexing） | `incremental-indexing` | 4 | L12202(2) |  |  |
| AutoSkill 框架 | `autoskill` | 1 | — | 🌐 | 冷門名詞，需確認出處 |

### L12101 No Code / Low Code 的基本概念（10 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| No-Code 無程式碼 | `no-code` | 18 | L12102(9) |  |  |
| 自動化機器學習 AutoML | `automl` | 5 | L11402(1) |  |  |
| Vibe Coding | `vibe-coding` | 4 | L12202(1) L12303(1) | 🌐 | 新名詞（2025） |
| 工作流程自動化工具（n8n、Zapier、Make） | `workflow-automation` | 2 | — | 🌐 | 工具功能可能更新 |
| 條件分支節點（Router／Branching） | `router-node` | 2 | — |  |  |
| 聚合器節點（Aggregator） | `aggregator-node` | 2 | — |  |  |
| 迭代器節點（Iterator） | `iterator-node` | 2 | — |  |  |
| 篩選器（Filter）與格式化（Formatter）節點 | `filter-formatter-node` | 2 | — |  |  |
| Webhook | `webhook` | 2 | — |  |  |
| Agentic Coding（如 Claude Code） | `agentic-coding` | 2 | L12201(1) | 🌐 | 新名詞 |

### L12102 No Code / Low Code 的優勢與限制（7 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| Low-Code 低程式碼 | `low-code` | 24 | L12101(11) L12202(1) |  |  |
| 角色權限控管（RBAC）與稽核日誌 | `rbac` | 3 | L12303(1) |  |  |
| 公民開發者與 AI 民主化 | `citizen-developer` | 2 | — |  |  |
| 自動化測試與服務虛擬化（Mock） | `automated-testing` | 2 | — |  |  |
| 影子 IT（Shadow IT） | `shadow-it` | 2 | — |  |  |
| 供應商鎖定（Vendor Lock-in） | `vendor-lock-in` | 2 | — |  |  |
| 多雲架構（Multi-Cloud） | `multi-cloud` | 1 | — |  |  |

### L12201 生成式 AI 應用領域與常見工具（24 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| AI Agent（AI 代理）／Agentic AI | `ai-agent` | 21 | L11301(1) L12202(3) L12303(1) |  |  |
| 自迴歸模型（Autoregressive Model） | `autoregressive` | 8 | L11401(2) |  |  |
| 多模態（Multimodal） | `multimodal` | 8 | L11401(1) L12202(3) |  |  |
| 規則式自動化（Rule-based）與 RPA | `rule-based-automation` | 7 | L11202(1) L12101(1) L12202(2) L12302(1) |  |  |
| 解決方案圖（Solution Graph） | `solution-graph` | 7 | — | 🌐 | 非通用術語，需確認出處 |
| 函數呼叫／工具呼叫（Function Calling／Tool Calling） | `function-calling` | 7 | L12202(1) L12301(2) |  |  |
| 擴散模型（Diffusion Model） | `diffusion-model` | 6 | L11202(1) L11401(2) |  |  |
| MCP 模型上下文協定（Model Context Protocol） | `mcp` | 6 | — | 🌐 | 新標準（2024），題目亦譯「模型內容協定」 |
| AI 程式設計助手（GitHub Copilot 等） | `ai-coding-assistant` | 4 | — | 🌐 | 產品功能可能更新 |
| 多代理系統（Multi-Agent） | `multi-agent` | 4 | — |  |  |
| 文生圖工具（Midjourney、DALL·E、Stable Diffusion） | `image-gen-tools` | 3 | L12202(1) | 🌐 | 產品功能可能更新 |
| Encoder–Decoder vs Decoder-only | `encoder-decoder` | 2 | — |  |  |
| A2A（Agent-to-Agent）協定 | `a2a` | 2 | — | 🌐 | 新標準（2025） |
| 知識圖譜（Knowledge Graph） | `knowledge-graph` | 2 | L12202(1) |  |  |
| 任務規劃器（Task Planner） | `task-planner` | 2 | — |  |  |
| 共享記憶與上下文同步 | `shared-memory` | 2 | — |  |  |
| 餘弦相似度（Cosine Similarity） | `cosine-similarity` | 1 | — |  |  |
| 遮罩語言建模（Masked Language Modeling） | `masked-lm` | 1 | — |  |  |
| 圖搜尋演算法（BFS、DFS、最佳優先） | `graph-search` | 1 | — |  |  |
| 情境感知代理（Context-aware Agent） | `context-aware-agent` | 1 | — |  |  |
| Titans 架構 Memory as Context（MAC） | `titans-mac` | 1 | — | 🌐 | 研究論文（2025） |
| GPT-Realtime（即時語音模型） | `gpt-realtime` | 1 | — | 🌐 | 新產品 |
| AgentKit（OpenAI） | `agentkit` | 1 | — | 🌐 | 新產品（2025） |
| Skill（AI 能力模組） | `agent-skill` | 1 | — | 🌐 | 新概念 |

### L12202 如何善用生成式 AI 工具（33 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 大型語言模型 LLM | `llm` | 75 | L11102(2) L11401(11) L11402(2) L12101(1) L12201(18) L12301(4) L12302(8) L12303(5) |  |  |
| 檢索增強生成 RAG | `rag` | 36 | L11401(1) L11402(5) L12201(5) L12302(1) L12303(1) |  |  |
| 微調（Fine-tuning） | `fine-tuning` | 34 | L11301(2) L11401(3) L11402(3) L12102(1) L12201(1) L12302(2) L12303(2) |  |  |
| Token 與斷詞（Tokenization） | `token` | 22 | L11401(3) L11402(1) L12201(4) L12301(6) |  |  |
| 幻覺（Hallucination） | `hallucination` | 19 | L11102(1) L11402(2) L12101(1) L12201(3) L12301(2) L12302(1) L12303(3) |  |  |
| 預訓練（Pre-training） | `pretraining` | 16 | L11301(2) L11401(3) L11402(1) L12101(1) L12201(3) L12303(2) |  |  |
| 向量資料庫與嵌入（Embedding） | `vector-database` | 16 | L11401(1) L11402(1) L12201(5) |  |  |
| 少樣本提示（Few-shot Prompting） | `few-shot` | 16 | L11301(2) L12303(1) |  |  |
| 溫度參數（Temperature） | `temperature` | 12 | L12201(2) L12302(1) |  |  |
| 上下文窗口（Context Window） | `context-window` | 11 | L11401(2) L12201(3) |  |  |
| 提示工程（Prompt Engineering） | `prompt-engineering` | 11 | L12101(1) L12302(1) |  |  |
| 零樣本提示（Zero-shot Prompting） | `zero-shot` | 10 | L12301(1) |  |  |
| 語音辨識 ASR（語音轉文字） | `asr` | 9 | L11101(1) L11203(1) L11302(1) L11402(1) L12201(1) L12302(2) |  |  |
| 思維鏈 CoT（Chain-of-Thought） | `chain-of-thought` | 9 | — |  |  |
| 知識蒸餾（Knowledge Distillation） | `knowledge-distillation` | 5 | L11401(1) L12201(1) |  |  |
| 文本切分（Chunking） | `chunking` | 5 | L11402(1) |  |  |
| 監督式微調 SFT | `sft` | 3 | L11401(1) |  |  |
| 思維樹 ToT（Tree of Thoughts） | `tree-of-thoughts` | 3 | — |  |  |
| ReAct（推理與行動） | `react` | 3 | — |  |  |
| 圖提示（Graph Prompting） | `graph-prompting` | 3 | — | 🌐 | 定義來源不一 |
| 強化微調 RFT | `rft` | 2 | — | 🌐 | 較新的技術名稱 |
| 自我一致性（Self-consistency） | `self-consistency` | 2 | — |  |  |
| 自動提示工程 APE | `ape` | 2 | — |  |  |
| 上下文工程（Context Engineering） | `context-engineering` | 2 | — | 🌐 | 新名詞（2025） |
| 角色設定提示（Role Prompting／Context Prompting） | `role-prompting` | 2 | — | 🌐 | 題目把角色設定稱為「情境設定提示(Context Prompting)」，與常見說法不同 |
| 提示鏈（Prompt Chaining） | `prompt-chaining` | 2 | — |  |  |
| 領域偏移（Domain Shift） | `domain-shift` | 2 | — |  |  |
| 推理模型的思考預算（Thinking Budget） | `reasoning-budget` | 2 | — | 🌐 | 新功能 |
| 訓練資料記憶（Memorization） | `memorization` | 2 | L12303(1) |  |  |
| 控制標記（Control Tokens） | `control-tokens` | 1 | — |  |  |
| 多向量檢索器（Multi-vector Retriever） | `multi-vector-retriever` | 1 | — | 🌐 | 框架專有名詞 |
| 重排序器（Reranker） | `reranker` | 1 | — |  |  |
| LLM 無狀態與對話歷史（Chat History） | `llm-stateless` | 1 | — |  |  |

### L12301 生成式 AI 導入評估（6 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| Token 經濟（Token Economics） | `token-economics` | 6 | L11402(1) L12202(1) |  |  |
| 基準測試（Benchmark） | `benchmark` | 3 | — |  |  |
| 總體擁有成本 TCO | `tco` | 3 | — |  |  |
| MMLU（大規模多任務語言理解） | `mmlu` | 2 | — |  |  |
| 投資報酬率 ROI | `roi` | 2 | — |  |  |
| 概念驗證 PoC | `poc` | 1 | — |  |  |

### L12302 生成式 AI 導入規劃（5 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 地端／私有化部署（On-Premises） | `on-premises` | 8 | L11402(1) L12101(1) L12303(1) |  |  |
| 關鍵績效指標 KPI | `kpi` | 3 | L11301(1) |  |  |
| 負載平衡與高可用性 | `load-balancing` | 3 | L12101(1) |  |  |
| 最小可行產品 MVP | `mvp` | 2 | L12303(1) |  |  |
| 模型路由（Model Routing） | `model-routing` | 1 | — |  |  |

### L12303 生成式 AI 風險管理（18 個）

| 名詞 | id | 題數 | 也出現在 | 需上網查證 | 備註 |
|---|---|---:|---|:---:|---|
| 系統提示詞（System Prompt） | `system-prompt` | 10 | L11401(1) L12202(3) L12302(1) |  |  |
| 護欄（Guardrails） | `guardrails` | 6 | L12202(1) L12302(1) |  |  |
| 提示詞注入（Prompt Injection） | `prompt-injection` | 6 | — |  |  |
| 聯邦學習（Federated Learning） | `federated-learning` | 5 | L11102(1) L11203(1) |  |  |
| 資料漂移（Data Drift） | `data-drift` | 4 | L11301(1) |  |  |
| 人在迴圈內（Human-in-the-loop, HITL） | `human-in-the-loop` | 3 | L11102(1) | 🌐 | HITL／HOTL 定義各家說法不一 |
| MLOps | `mlops` | 3 | L12102(1) |  |  |
| 間接提示詞注入（Indirect Prompt Injection） | `indirect-prompt-injection` | 3 | — |  |  |
| 同態加密（Homomorphic Encryption） | `homomorphic-encryption` | 2 | — |  |  |
| 零知識證明（Zero-knowledge Proof） | `zero-knowledge-proof` | 2 | — |  |  |
| 資料最小化（Data Minimization） | `data-minimization` | 2 | — | 🌐 | 個資法／GDPR 原則 |
| 資料投毒（Data Poisoning） | `data-poisoning` | 2 | — |  |  |
| 偏見檢測 vs 偏見緩解 | `bias-detection-mitigation` | 1 | — |  |  |
| 提示洩漏（Prompt Leakage） | `prompt-leakage` | 1 | — |  |  |
| C2PA 內容憑證（Content Credentials） | `c2pa` | 1 | — | 🌐 | 標準與產品政策 |
| SynthID 數位浮水印 | `synthid` | 1 | — | 🌐 | 產品政策 |
| 選擇性偏差（Selection Bias） | `selection-bias` | 1 | — |  |  |
| 最小權限原則（Least Privilege） | `least-privilege` | 1 | — |  |  |
