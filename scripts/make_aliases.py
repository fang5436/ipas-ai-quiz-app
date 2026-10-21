# 產生課程用的「名詞 → 名詞卡」對照表：src/data/lessons/term-aliases.json
# 候選別名來自名詞卡名稱；太籠統的字排除；一個別名對到多張卡時，用 PREFER 指定單一名詞的那張
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')
src = sys.argv[1]
T = json.load(open(src + '/data/terms/terms.json', encoding='utf-8'))
ids = {t['id'] for t in T}

BLOCK = set('''迴歸 AI in 損失 函數 Code 生成式 編碼 代理 轉換 分數 鑑別式 VM 可解釋 Prompt 架構 隱私 Agent vs of Coding 治理 公平 透明
框架 Vibe Graph 角色 Client 環境 延遲 Prompting 最大 結構化 特性 服務 Learning Agentic 協定 as Host Server Remote Map Label Deep
檢定 安全性 Data Encoding Engineering Drift Batch Normalization Token 價值 資料集 Mode Context Make 節點 IT GitHub Solution Knowledge
Task Calling Memory Chat Bias Indirect Variance Query Semantic Cache Expansion 社會 指引 Sandbox Regulatory 萃取 Random Seed Function
Concept Collapse Wide Poisoning Saliency 資料量大 嵌入 如_Claude_Code AI_Host 散度 KL Hinge 篩選器 Leakage Formatter Filter Iterator
Planner Router Branching Aggregator 差分 Injection Chaining Engine 生成器 鑑別器 Skill'''.replace('_', ' ').split())

PREFER = {
    'MSE': 'mse', 'R²': 'r-squared', 'MAE': 'mae', 'MAPE': 'mape', 'RMSE': 'rmse', '梯度消失': 'vanishing-gradient-single',
    '標準化': 'standardization', 'Z-score': 'standardization', '中位數': 'median', '平均數': 'mean', 'MCP': 'mcp', 'API': 'api',
    'LLM': 'llm', 'Few-shot': 'few-shot', 'Zero-shot': 'zero-shot', 'K-means': 'k-means', '右偏': 'right-skew', '左偏': 'left-skew',
    'IQR': 'iqr', 'ReLU': 'relu', 'Sigmoid': 'sigmoid', 'Q-Learning': 'q-learning-single', 'Deep Q-Learning': 'dqn',
    '預訓練': 'pretraining', 'LoRA': 'lora', 'PEFT': 'peft', 'A2A': 'a2a', 'Fine-tuning': 'fine-tuning', '正則化': 'regularization',
    '梯度爆炸': 'exploding-gradient', '情境設定提示': 'context-prompting', 'Context Prompting': 'context-prompting',
    '局部解釋': 'local-explanation', '全域解釋': 'global-explanation', '事後解釋': 'post-hoc', '非結構化資料': 'unstructured-data',
    '偏見緩解': 'bias-mitigation', '偏見檢測': 'bias-detection', '過擬合': 'overfitting-single', '鑑別式 AI': 'discriminative-ai',
    '生成式 AI': 'generative-ai', 'L1': 'l1-regularization', 'L2': 'l2-regularization', 'Lasso': 'l1-regularization',
    'Ridge': 'l2-regularization', 'Stable Diffusion': 'stable-diffusion', 'Midjourney': 'midjourney', 'DALL·E': 'dall-e',
    'AGI': 'agi', 'Role Prompting': 'role-prompting-single', 'Overfitting': 'overfitting-single',
}
EXTRA = {
    '決定係數': 'r-squared', '判定係數': 'r-squared', '叢集': 'clustering', '分群': 'clustering', 'K-Means': 'k-means',
    '隨機種子': 'random-seed', '全連接': 'fcnn', '前饋': 'mlp', '多層感知機': 'mlp', '支援向量機': 'svm', 'K 近鄰': 'knn',
    '極限梯度提升': 'gradient-boosting', '交叉熵': 'cross-entropy', '變分自編碼器': 'vae', '長短期記憶': 'lstm',
    '循環神經網路': 'rnn', 'Wide & Deep': 'wide-and-deep', '寬深': 'wide-and-deep', '均方根誤差': 'rmse',
    '平均絕對百分比誤差': 'mape', 'ROC-AUC': 'roc-auc', '門檻': 'decision-threshold', '混淆矩陣': 'confusion-matrix',
    '自注意力': None,
}

cands = {}
for t in T:
    pieces = set()
    for p in re.split(r'[（）()／/、，]', t['name']):
        p = p.strip()
        if not p: continue
        pieces.add(p)
        for w in p.split(' '):
            if len(w) >= 2: pieces.add(w)
    for p in pieces:
        cands.setdefault(p, set()).add(t['id'])

out, skipped = {}, []
for alias, s in cands.items():
    if alias in BLOCK or len(alias) < 2: continue
    if alias in PREFER:
        out[alias] = PREFER[alias]
    elif len(s) == 1:
        out[alias] = next(iter(s))
    else:
        skipped.append((alias, sorted(s)))
for alias, tid in EXTRA.items():
    if tid: out[alias] = tid
# 只留課程與圖鑑裡真的出現的別名（這些都已人工看過一次）
L = json.load(open(src + '/data/lessons/lessons.json', encoding='utf-8'))
G = json.load(open(src + '/data/lessons/glossary.json', encoding='utf-8'))
corpus = json.dumps(L, ensure_ascii=False) + json.dumps(G, ensure_ascii=False)
out = {a: t for a, t in out.items() if a in corpus}
# 名稱拆開後留下的半截英文字與殘字
DROP = {'Cross', 'Line', 'Log', 'Logistic', 'Rule', 'Rules', 'Threshold', 'Similarity', 'Isolation', 'Association', 'Cosine',
        '曲線與', 'AI Host', '如 Claude Code'}
out = {a: t for a, t in out.items() if a not in DROP}
bad = {a: t for a, t in out.items() if t not in ids}
print('aliases', len(out), 'bad ids', bad)
print('skipped (多張卡，未指定):', len(skipped))
for a, s in sorted(skipped):
    print('  ', a, s)
json.dump(dict(sorted(out.items())), open(src + '/data/lessons/term-aliases.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
