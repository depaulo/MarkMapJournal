// ================================
// Shiki HTML syntax highlighting
// Uses dynamic ESM import instead of global window.shiki
// ================================

let __shikiHighlighterPromise = null;

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeShikiLang(lang) {
  const l = String(lang || '')
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  const aliases = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    md: 'markdown',
  };

  return aliases[l] || l || 'text';
}

async function initShiki() {
  if (!__shikiHighlighterPromise) {
    // @ts-expect-error - Dynamic import from CDN URL
    __shikiHighlighterPromise = import('https://cdn.jsdelivr.net/npm/shiki@4.0.2/+esm').then(
      ({ createHighlighter }) => {
        return createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: [
            'text',
            'javascript',
            'jsx',
            'typescript',
            'tsx',
            'python',
            'bash',
            'json',
            'markdown',
            'html',
            'css',
            'yaml',
            'xml',
          ],
        });
      }
    );
  }

  return __shikiHighlighterPromise;
}

export async function renderHtmlWithShiki(mdText) {
  const highlighter = await initShiki();

  const isDark = document.documentElement.classList.contains('dark');
  const theme = isDark ? 'github-dark' : 'github-light';

  const markedLib = window.marked;
  const renderer = new markedLib.Renderer();

  markedLib.setOptions({
    gfm: true,
    breaks: false,
  });

  renderer.heading = function (token) {
    const text = typeof token === 'object' ? token.text : String(token || '');
    const depth = typeof token === 'object' ? token.depth : 2;
    const id = slugifyHeading(text);

    return `<h${depth} id="${id}">
		${text}
		<a href="#${id}" style="text-decoration:none; opacity:.5;">🔗</a>
	  </h${depth}>`;
  };

  renderer.code = function (codeOrToken, infostring) {
    let code;
    let lang;

    // Supports both older and newer marked renderer signatures
    if (codeOrToken && typeof codeOrToken === 'object') {
      code = codeOrToken.text ?? codeOrToken.raw ?? '';
      lang = codeOrToken.lang ?? '';
    } else {
      code = codeOrToken ?? '';
      lang = infostring ?? '';
    }

    const normalizedLang = normalizeShikiLang(lang);

    try {
      const html = highlighter.codeToHtml(String(code), {
        lang: normalizedLang,
        theme,
      });

      return `
<div class="code-block">
  <button class="copy-btn" type="button">Copy</button>
  ${html}
</div>
`;
    } catch (e) {
      return `
<div class="code-block">
  <button class="copy-btn" type="button">Copy</button>
  <pre><code>${escapeHtml(code)}</code></pre>
</div>
`;
    }
  };

  return markedLib.parse(mdText, { renderer });
}

export function slugifyHeading(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
