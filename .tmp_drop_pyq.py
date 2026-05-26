import sys
path = r'c:\Users\ankit\OneDrive\Desktop\sem\iks-exam-guide.html'
with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

drop_ids = [
    'pyq-4-bsc25-doshas',
    'pyq-4-bsc25-pancha',
    'pyq-4-bsc24-q5',
    'pyq-4-bsc25-yoga-healthcare',
]

original_len = len(src)
removed = []

for did in drop_ids:
    pat = '<div class="pyq" id="' + did + '">'
    idx = src.find(pat)
    if idx < 0:
        print('NOT FOUND:', did, file=sys.stderr)
        continue
    depth = 0
    i = idx
    n = len(src)
    matched_end = -1
    while i < n:
        if src[i] == '<':
            if src[i:i+4] == '<div' and i+4 < n and src[i+4] in ' >\n\t':
                depth += 1
                end = src.find('>', i)
                if end < 0: break
                i = end + 1
                continue
            if src[i:i+6] == '</div>':
                depth -= 1
                i += 6
                if depth == 0:
                    matched_end = i
                    break
                continue
        i += 1
    if matched_end < 0:
        print('NO CLOSE:', did, file=sys.stderr)
        continue
    end = matched_end
    while end < n and src[end] in ' \t':
        end += 1
    if end < n and src[end] == '\n':
        end += 1
        save = end
        while end < n and src[end] in ' \t':
            end += 1
        if end < n and src[end] == '\n':
            end += 1
        else:
            end = save
    src = src[:idx] + src[end:]
    removed.append(did)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(src)

print('REMOVED:', removed)
print('BYTES:', original_len, '->', len(src), '(-' + str(original_len - len(src)) + ')')
