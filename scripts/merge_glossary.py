import json, sys
src = sys.argv[1]
path = src + '/data/lessons/glossary.json'
old = json.load(open(path, encoding='utf-8'))
new = json.load(open(sys.argv[2], encoding='utf-8'))
LESSON = ['3-2', '3-2', '3-3', '3-4', '3-5', '3-5', '3-5']
# 舊版（沒有 part 欄位）才需要依 LESSON 補欄位；已有 part 的組全部保留，不能用 zip 截斷
merged = []
lessons = iter(LESSON)
for g in old:
    if 'part' not in g:
        g = {'part': 3, 'lesson': next(lessons), **g}
    merged.append(g)
have = {g['group'] for g in merged}
merged += [g for g in new if g['group'] not in have]
merged.sort(key=lambda g: (g['part'], g['lesson']))
json.dump(merged, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print([(g['lesson'], len(g['items'])) for g in merged], sum(len(g['items']) for g in merged))
