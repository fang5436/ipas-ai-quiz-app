import json
import os

file_path = "public/questions.json"

if not os.path.exists(file_path):
    print("❌ 錯誤：找不到 public/questions.json 檔案！")
    exit()

try:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"✅ 成功：JSON 語法完全合法！目前偵測到總共有 {len(data)} 題。")
    
    # 初始化統計字典
    source_counts = {}
    detail_code_counts = {}
    errors = []
    
    for idx, q in enumerate(data):
        # 1. 檢查必填欄位是否存在
        required_fields = ["id", "category", "sub_category_code", "detail_code", "source", "question", "options", "correctIndex", "explanation"]
        for field in required_fields:
            if field not in q:
                errors.append(f"第 {idx+1} 題 (ID: {q.get('id', '未知')}) 缺少欄位: {field}")
        
        # 2. 檢查選項數量
        if "options" in q and len(q["options"]) != 4:
            errors.append(f"第 {idx+1} 題 (ID: {q['id']}) 的選項不是 4 個！目前有 {len(q['options'])} 個")
            
        # 3. 檢查答案索引
        if "correctIndex" in q and (q["correctIndex"] < 0 or q["correctIndex"] > 3):
            errors.append(f"第 {idx+1} 題 (ID: {q['id']}) 的 correctIndex 數值異常: {q['correctIndex']} (必須在 0~3 之間)")
            
        # 4. 統計來源與代碼
        source = q.get("source", "未知來源")
        source_counts[source] = source_counts.get(source, 0) + 1
        
        d_code = q.get("detail_code", "未知代碼")
        detail_code_counts[d_code] = detail_code_counts.get(d_code, 0) + 1

    # 輸出體檢報告
    print("\n📊 --- 題目來源分佈報告 ---")
    for src, count in source_counts.items():
        print(f" 📦 {src}: {count} 題")
        
    print("\n🔍 --- 官方評鑑指標細項統計 ---")
    for code in sorted(detail_code_counts.keys()):
        print(f" 🎯 {code}: {detail_code_counts[code]} 題")

    if errors:
        print(f"\n❌ 體檢失敗！總共抓到 {len(errors)} 個邏輯漏洞：")
        for err in errors[:10]: # 先列出前10個
            print(f"  - {err}")
    else:
        print("\n🏆 體檢完美通過！所有欄位、選項數量、答案索引與官方代碼完全合規！")

except json.JSONDecodeError as e:
    print(f"❌ 語法崩潰：JSON 檔案結構損壞！解析錯誤發生在第 {e.lineno} 行，第 {e.colno} 個字元。")
    print(f"錯誤訊息: {e.msg}")