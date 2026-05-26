import re
path = r'c:\Users\ankit\OneDrive\Desktop\sem\iks-exam-guide.html'
with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

# Strip comments
src_nc = re.sub(r'<!--.*?-->', '', src, flags=re.DOTALL)

def count(tag):
    opens = len(re.findall(r'<' + tag + r'(?=[\s>])', src_nc, flags=re.IGNORECASE))
    closes = len(re.findall(r'</' + tag + r'\s*>', src_nc, flags=re.IGNORECASE))
    return opens, closes

for t in ['div', 'section', 'span', 'figure', 'figcaption', 'h3', 'h5', 'p', 'ol', 'ul', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody']:
    o, c = count(t)
    flag = '' if o == c else '  <-- MISMATCH'
    print(f'{t:10s} open={o:5d} close={c:5d}{flag}')
