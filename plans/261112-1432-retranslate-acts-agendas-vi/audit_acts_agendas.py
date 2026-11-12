import json, re, sys, collections
FE = sys.argv[1]
en = {c['code']: c for c in json.load(open(FE+'/public/cards_en.json', encoding='utf-8'))}
vi = {c['code']: c for c in json.load(open(FE+'/public/cards_vi.json', encoding='utf-8'))}
F = ['name','text','flavor','back_name','back_text','back_flavor']
num = lambda s: sorted(re.findall(r'\d+', re.sub(r'<[^>]+>','',s or '')))
icon = lambda s: sorted(re.findall(r'\[[a-z_]+\]', s or ''))
out = []
# index vi values to detect copy from another card
where = collections.defaultdict(set)
for code, c in vi.items():
    if c.get('type_code') in ('act','agenda'):
        for f in F:
            v = (c.get(f) or '').strip()
            if len(v) > 25: where[v].add((code, f))
for code, e in en.items():
    if e.get('type_code') not in ('act','agenda'): continue
    v = vi.get(code)
    if not v: out.append((code, 'MISSING', '')); continue
    for f in F:
        a, b = (e.get(f) or '').strip(), (v.get(f) or '').strip()
        if bool(a) != bool(b):
            out.append((code, f, 'presence en=%d vi=%d' % (bool(a), bool(b)))); continue
        if not a: continue
        if f in ('name','back_name'): continue
        if a == b:
            if re.sub(r'<[^>]+>|\(→R\d+\)|\s', '', a):
                out.append((code, f, 'untranslated'))
            continue
        if f.endswith('text'):
            if num(a) != num(b): out.append((code, f, 'nums en=%s vi=%s' % (num(a), num(b))))
            if icon(a) != icon(b): out.append((code, f, 'icons en=%s vi=%s' % (icon(a), icon(b))))
        r = len(b) / max(len(a), 1)
        if r < 0.6 or r > 2.0: out.append((code, f, 'len ratio %.2f' % r))
        if len(where.get(b, ())) > 1:
            norm = lambda s: (s or '').replace("’", "'").replace("‘", "'").replace('”', '"').replace('“', '"').strip()
            en_vals = {norm(en.get(cd, {}).get(fd)) for cd, fd in where[b]}
            if len(en_vals) > 1:
                out.append((code, f, 'dup %s' % sorted(where[b])))
for o in out: print(*o, sep=' | ')
print('TOTAL', len(out), 'cards', len({o[0] for o in out}), file=sys.stderr)
