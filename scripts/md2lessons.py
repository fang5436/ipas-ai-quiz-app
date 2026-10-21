"""把組合觀念課 Markdown 轉成 lessons.json。用法：py -I md2lessons.py <md資料夾> <輸出json>"""
import glob, json, re, sys
src, out = sys.argv[1:]
PART_ORDER = '一二三四五六七'
lessons = []
for f in glob.glob(src + '/2026-10-20_組合觀念課_第*篇.md'):
    text = open(f, encoding='utf-8').read()
    part_title = re.search(r'^# 組合觀念課・(.+)$', text, re.M).group(1)
    part_no = PART_ORDER.index(re.search(r'第(.)篇', part_title).group(1)) + 1
    for chunk in re.split(r'^## ', text, flags=re.M)[1:]:
        head, _, body = chunk.partition('\n')
        m = re.match(r'(\d-\d)\s+(.*)', head.strip())
        lesson = {'id': m.group(1), 'part': part_no, 'partTitle': part_title, 'title': m.group(2).replace('（★）', '').strip(),
                  'star': '★' in m.group(2), 'sections': []}
        for sec in re.split(r'^### ', body, flags=re.M)[1:]:
            sh, _, sb = sec.partition('\n')
            blocks, lines, i = [], sb.split('\n'), 0
            while i < len(lines):
                ln = lines[i]
                if ln.startswith('```'):
                    j = i + 1
                    while not lines[j].startswith('```'): j += 1
                    blocks.append({'type': 'tree', 'lines': lines[i + 1:j]}); i = j + 1; continue
                if ln.startswith('|'):
                    rows = []
                    while i < len(lines) and lines[i].startswith('|'):
                        cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                        if not all(re.fullmatch(r':?-+:?', c) for c in cells): rows.append(cells)
                        i += 1
                    blocks.append({'type': 'table', 'header': rows[0], 'rows': rows[1:]}); continue
                if ln.startswith('- '):
                    items = []
                    while i < len(lines) and lines[i].startswith('- '):
                        items.append(lines[i][2:]); i += 1
                    blocks.append({'type': 'list', 'items': items}); continue
                if ln.strip() and ln.strip() != '---':
                    blocks.append({'type': 'p', 'text': ln.strip()})
                i += 1
            lesson['sections'].append({'heading': sh.strip(), 'blocks': blocks})
        lessons.append(lesson)
lessons.sort(key=lambda l: (l['part'], l['id']))
json.dump(lessons, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(lessons), 'lessons', [l['id'] for l in lessons])
print('sections per lesson', {len(l['sections']) for l in lessons})
