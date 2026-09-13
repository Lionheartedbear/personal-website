import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

// Frozen Markdown documents are embedded below the page's section headings.
function embeddedHeadings() {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type === 'heading') node.depth = Math.min(node.depth + 2, 6);
    }
  };
}

function accessibleEquations() {
  return (tree) => {
    function visit(node) {
      const classes = node.properties?.className ?? [];
      if (classes.includes('katex-error')) throw new Error('Invalid frozen equation');
      if (classes.includes('katex') && node.children?.some((child) => child.tagName === 'math' && child.properties?.display === 'block')) {
        Object.assign(node.properties, { className: [...classes, 'equation'], tabIndex: 0, role: 'region', ariaLabel: 'Equation' });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

const mathMarkdown = unified({
  smartypants: false,
  remarkPlugins: [remarkMath, embeddedHeadings],
  // Native MathML: accessible static equations, no client JS or font files.
  rehypePlugins: [[rehypeKatex, { output: 'mathml', strict: 'error' }], accessibleEquations],
});

export default defineConfig({
  site: 'https://wangdong-jia.github.io',
  output: 'static',
  markdown: {
    processor: {
      name: 'frozen-math',
      async createRenderer(options) {
        const renderer = await mathMarkdown.createRenderer(options);
        return {
          render(content, renderOptions) {
            // The frozen file uses same-line $$ delimiters, including multiline
            // formulas. Normalize delimiter placement in memory for remark-math;
            // neither the source bytes nor the formula contents are changed.
            const normalized = content.replace(/\$\$([\s\S]*?)\$\$/g,
              (_, tex) => `\n$$\n${tex.trim()}\n$$\n`);
            return renderer.render(normalized, renderOptions);
          },
        };
      },
    },
  },
});
