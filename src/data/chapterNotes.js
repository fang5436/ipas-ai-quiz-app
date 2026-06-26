export const chapterNotes = {
  p1_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、AI 基本定義與分類</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">弱 AI (Narrow AI) vs 強 AI (AGI)</strong>：弱 AI 專精於特定任務（如語音辨識）；強 AI 具備等同人類的全面認知能力（目前尚未實現）。</li>
      <li><strong class="text-slate-100">通用智慧</strong>：指學習和獲取知識並廣泛應用於多種領域的能力，非侷限於單一領域的預設規則。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、核心技術架構</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">機器學習 (ML)</strong>：不依賴明確指令，讓模型從資料中找出規律。</li>
      <li><strong class="text-slate-100">深度學習 (DL)</strong>：ML 的子領域，使用多層神經網路，適合圖像、語音等非結構化資料。</li>
    </ul>`,

  p1_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、AI 治理與核心目標</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">治理核心目標</strong>：確保 AI 的可信度（安全、公平、可解釋、透明），符合人類價值觀。</li>
      <li><strong class="text-slate-100">可信賴 AI 六大元素</strong>：人類監管、問責制、安全性、公平性、透明度、可解釋性。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、國際法規框架</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">NIST</strong>：提供風險管理和資訊安全指導標準，管理 AI 生命週期。</li>
      <li><strong class="text-slate-100">GDPR</strong>：全球最嚴隱私法，強調個人資料處理的透明度與明確同意。</li>
      <li><strong class="text-slate-100">CCPA</strong>：強調消費者對個人資料的控制權與透明化。</li>
      <li><strong class="text-slate-100">歐盟 AI 法案</strong>：世界首次 AI 立法，確保技術開發符合社會利益。</li>
    </ul>`,

  p2_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、資料型態分類</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">結構化資料</strong>：行列固定格式（關聯式資料庫、CSV），易搜尋分析。</li>
      <li><strong class="text-slate-100">非結構化資料</strong>：無固定格式（音訊、圖像、影片），需 ML/DL 處理。</li>
      <li><strong class="text-slate-100">半結構化資料</strong>：JSON、XML，有組織元素但不完全遵循表格格式。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、資料集劃分</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">訓練集 (70%)</strong>：讓模型學習特徵與輸入輸出的關係。</li>
      <li><strong class="text-slate-100">驗證集 (15%)</strong>：調整超參數，評估模型防過擬合。</li>
      <li><strong class="text-slate-100">測試集 (15%)</strong>：模型未見過，用於最終公平評估泛化能力。</li>
    </ul>`,

  p2_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、資料清理與預處理</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">資料清理目的</strong>：確保準確性、一致性及無錯誤，是建立高準確度模型的基礎。</li>
      <li><strong class="text-slate-100">異常值處理</strong>：通常截斷到合理範圍內，降低對模型的不良影響。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、資料編碼與縮放</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">獨熱編碼 (One-Hot)</strong>：無順序的類別（如顏色、車型）轉為數字格式。</li>
      <li><strong class="text-slate-100">標籤編碼 (Label)</strong>：有自然順序的分類資料。</li>
      <li><strong class="text-slate-100">資料正規化/標準化</strong>：確保不同度量尺度的特徵能被公平比較。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、降維</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">PCA 主成分分析</strong>：提取具代表性的特徵降低維度，保留資料最大變異性。</li>
    </ul>`,

  p2_c3: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、隱私風險與威脅</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">核心風險</strong>：推理攻擊（從模型輸出反推敏感資料）、黑箱決策、資料集中化帶來的駭客風險。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、三大隱私保護技術 (PPML)</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">差分隱私 (DP)</strong>：在訓練資料中加入隨機雜訊，防止推斷個人特定屬性。</li>
      <li><strong class="text-slate-100">同態加密 (HE)</strong>：在不解密狀態下直接進行機器學習計算。</li>
      <li><strong class="text-slate-100">聯合學習 (FL)</strong>：資料留在本地訓練，各設備只上傳模型參數，原始資料不外流。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、公平性與法規</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">隱私設計 (Privacy by Design)</strong>：在產品開發每個階段預先融入隱私保護，從根本減少洩漏風險。</li>
    </ul>`,

  p3_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、機器學習四大範式</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">監督式學習</strong>：依賴標記資料建立輸入輸出映射（如郵件垃圾分類）。</li>
      <li><strong class="text-slate-100">無監督式學習</strong>：未標記資料，探索隱藏模式（如 K-均值聚類）。</li>
      <li><strong class="text-slate-100">半監督式學習</strong>：少量標記 + 大量未標記，降低標記成本。</li>
      <li><strong class="text-slate-100">強化學習 (RL)</strong>：智慧體與環境互動，透過獎勵/懲罰優化動態決策。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、演算法與模型診斷</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">SVM 支持向量機</strong>：尋找最大化不同類別間距離的超平面進行分類。</li>
      <li><strong class="text-slate-100">過擬合 (Overfitting)</strong>：模型過度依賴訓練集雜訊，泛化能力差。</li>
      <li><strong class="text-slate-100">正則化 (L1/L2)</strong>：在訓練中加入懲罰項限制模型複雜度。</li>
      <li><strong class="text-slate-100">LSTMs</strong>：RNN 變體，擅長處理具長期依賴的序列資料（語音、文本）。</li>
    </ul>`,

  p3_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、監督與非監督核心模型</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">分類 vs 迴歸</strong>：分類預測「離散」類別；迴歸預測「連續」數值（如房價）。</li>
      <li><strong class="text-slate-100">決策樹與隨機森林</strong>：隨機森林由多棵決策樹組成，提升準確性與穩定性。</li>
      <li><strong class="text-slate-100">K-Means（非監督）</strong>：將資料點分配到相似群集，使群內相似度最大化。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、深度學習架構</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">CNN 卷積神經網路</strong>：專為計算機視覺設計，自動提取圖像空間特徵。</li>
      <li><strong class="text-slate-100">RNN 循環神經網路</strong>：記住過去訊息，適合語音識別與時間序列。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、模型評估指標</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">迴歸指標</strong>：MSE、RMSE、MAE、R²（注意：Accuracy 不適用迴歸）。</li>
      <li><strong class="text-slate-100">分類指標</strong>：Accuracy、Precision、Recall。</li>
      <li><strong class="text-slate-100">F1-score</strong>：Precision 和 Recall 的調和平均數，類別不平衡時特別有用。</li>
    </ul>`,

  p4_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、鑑別式 vs 生成式 AI</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">鑑別式 AI</strong>：專注區分類別，學習特徵來「識別和分類」（需標記資料）。</li>
      <li><strong class="text-slate-100">生成式 AI</strong>：學習資料的機率分布，創造全新內容（文本、圖像、音樂）。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、生成對抗網路 (GANs)</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">生成器</strong>：生成偽造資料混淆判別器。</li>
      <li><strong class="text-slate-100">判別器</strong>：區分真實資料與生成器偽造的資料。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、擴散模型與 Transformer</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">擴散模型</strong>：加入雜訊後逐步消除還原，生成高品質圖像（Midjourney、Stable Diffusion）。</li>
      <li><strong class="text-slate-100">Transformer 自注意力機制</strong>：捕捉序列中長距離依賴，是現代 LLM 的基石。</li>
    </ul>`,

  p4_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、LLM 基礎與應用</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">Transformer 預訓練</strong>：海量文本資料訓練，具語義理解、翻譯、摘要與生成能力。</li>
      <li><strong class="text-slate-100">多模態整合</strong>：整合文本、圖像、聲音等多種資料來源（如 GPT-4）。</li>
      <li><strong class="text-slate-100">提示工程 (Prompt Engineering)</strong>：結構化自然語言指令，引導 LLM 產生精準輸出。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、模型優化技術</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">RAG 檢索增強生成</strong>：從外部知識庫檢索相關資訊再生成答案，降低「幻覺」並保護隱私。</li>
      <li><strong class="text-slate-100">微調 (Fine-Tuning)</strong>：用特定領域資料對預訓練模型進行二次訓練。</li>
    </ul>`,

  p5_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、LCNC 核心概念</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">民主化編程</strong>：視覺化拖放介面，讓非技術的「公民開發者」快速構建應用。</li>
      <li><strong class="text-slate-100">加速迭代</strong>：快速建立原型，收集反饋並快速迭代。</li>
      <li><strong class="text-slate-100">降低技術門檻</strong>：釋放 IT 團隊資源，專注複雜核心難題。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、LCNC 的挑戰</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">客製化限制</strong>：依賴預先配置的模版，面對複雜業務邏輯靈活性受限。</li>
      <li><strong class="text-slate-100">供應商鎖定 (Vendor Lock-in)</strong>：遷移到其他平台技術成本極高。</li>
      <li><strong class="text-slate-100">影子 IT 與資安盲區</strong>：非 IT 人員開發繞過正規審核，易產生資料洩漏漏洞。</li>
    </ul>`,

  p5_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、生成式 AI 與 LCNC 整合</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">自然語言轉程式碼 (NL2Code)</strong>：用自然語言描述需求，AI 自動生成對應程式碼。</li>
      <li><strong class="text-slate-100">無縫接軌企業系統</strong>：將生成式 AI 直接嵌入 CRM、ERP 等現有系統。</li>
      <li><strong class="text-slate-100">減少技術債務</strong>：AI 協助優化底層程式碼，縮小技術與非技術人員間的溝通鴻溝。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、挑戰</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">黑盒效應</strong>：生成式 AI 決策不透明，需精確提示工程控制輸出品質。</li>
      <li><strong class="text-slate-100">Create ML 生態系</strong>：Apple 生態，無需深入資料科學即可訓練並整合 iOS/macOS 模型。</li>
    </ul>`,

  p6_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、跨產業應用場景</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">媒體娛樂</strong>：加速內容創建與個性化推薦；遊戲 NPC 提供動態擬真互動。</li>
      <li><strong class="text-slate-100">醫療保健</strong>：醫學圖像分析、病理檢測，生成合成資料保護患者隱私。</li>
      <li><strong class="text-slate-100">零售金融</strong>：庫存優化、量身定制金融服務、風險預測與詐欺偵測。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、主流工具</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">ChatGPT</strong>：RLHF 微調，強大對話與自然語言理解。</li>
      <li><strong class="text-slate-100">Midjourney / DALL-E</strong>：頂尖文本到圖像生成工具。</li>
      <li><strong class="text-slate-100">GitHub Copilot</strong>：即時程式碼建議，提升開發效率。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、挑戰</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">幻覺 (Hallucination)</strong>：缺乏資訊時基於機率推斷出看似合理卻錯誤的內容。</li>
      <li><strong class="text-slate-100">版權與深偽問題</strong>：生成素材面臨智財權法律挑戰，易被用來創建 Deepfake。</li>
    </ul>`,

  p6_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、提示工程框架</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">RTF 結構</strong>：Role（角色）、Task（任務）、Format（格式）。</li>
      <li><strong class="text-slate-100">CTF 結構</strong>：Context（背景）、Task（任務）、Format（格式）。</li>
      <li><strong class="text-slate-100">設定角色 (Role)</strong>：賦予特定身分，優化回應語氣與專業度。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、高階思維技巧</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">思維鏈提示 (CoT)</strong>：引導模型逐步推理，提高數學與邏輯問題準確率。</li>
      <li><strong class="text-slate-100">思維樹提示 (ToT)</strong>：樹狀結構探索多重解決路徑，適合複雜決策。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、優化技術</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">RAG</strong>：無需重訓練即可讓 AI 獲取企業內部或最新外部知識。</li>
      <li><strong class="text-slate-100">LoRA 低秩適應微調</strong>：引入低秩矩陣，大幅減少需更新的參數量，降低 GPU 成本。</li>
    </ul>`,

  p7_c1: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、導入策略與可行性</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">商業目標優先</strong>：實施前先明確商業目標，確保技術選擇能創造實質價值。</li>
      <li><strong class="text-slate-100">技術可行性評估</strong>：評估現有基礎設施能否承載所選模型。</li>
      <li><strong class="text-slate-100">用例優先級矩陣</strong>：按技術複雜性、資源需求、預期回報評分，優先執行最具價值的 PoC。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、四大風險領域</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">資料風險</strong>：隱私洩露、未授權存取。</li>
      <li><strong class="text-slate-100">模型風險</strong>：幻覺問題、輸出不穩定、不可解釋性。</li>
      <li><strong class="text-slate-100">操作風險</strong>：人為錯誤、系統不兼容、流程中斷。</li>
      <li><strong class="text-slate-100">倫理法律風險</strong>：侵權、不公正偏見、違反法規合規。</li>
    </ul>`,

  p7_c2: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、部署與整合</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">環境架構匹配</strong>：設計時考慮與現有系統（資料庫、業務流程）的整合能力。</li>
      <li><strong class="text-slate-100">Human-in-the-loop</strong>：高風險場景（醫療診斷、放貸審核）維持人類在迴圈中的監管。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、模型監控與調校</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">參數優化</strong>：持續調整學習率、批次大小等超參數，解決過擬合或欠擬合問題。</li>
      <li><strong class="text-slate-100">獨立測試集驗證</strong>：訓練後在獨立測試集上評估泛化能力。</li>
      <li><strong class="text-slate-100">持續微調</strong>：結合新資料不斷修正模型適應最新業務需求。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、員工培訓</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">循序漸進策略</strong>：設立明確里程碑，評估實際成效後再擴大部署範圍。</li>
    </ul>`,

  p7_c3: `
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">一、風險評估實務</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">首要步驟</strong>：導入 AI 專案第一步永遠是進行全面的風險評估。</li>
      <li><strong class="text-slate-100">分級與 SWOT 分析</strong>：高/中/低影響級別排序；SWOT 識別內外部風險因素。</li>
      <li><strong class="text-slate-100">風險轉移</strong>：透過保險或外包合約，將高風險損失轉嫁給第三方。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">二、NIST AI RMF</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">自願性非強制</strong>：適用 AI 生命週期各階段的彈性指導方針。</li>
      <li><strong class="text-slate-100">四大核心功能</strong>：治理 (Govern)、映射 (Map)、測量 (Measure)、管理 (Manage)。</li>
    </ul>
    <h3 class="text-base font-bold text-blue-400 mb-2 mt-3">三、偏見緩解</h3>
    <ul class="list-disc pl-5 space-y-1.5 text-slate-300 mb-3 text-sm">
      <li><strong class="text-slate-100">主動去偏見</strong>：定期測試模型公平性，不可只依賴自動化工具。</li>
      <li><strong class="text-slate-100">第三方供應鏈審查</strong>：不能完全信任供應商，必須主動審查第三方軟體元件。</li>
    </ul>`
}
