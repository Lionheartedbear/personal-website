# Wangdong Jia — personal website

A static Astro website for quantitative research. TypeScript, custom CSS, system fonts, and no client-side JavaScript in the production pages.

## Local development

Use Node.js 24 (`nvm use` if you use nvm), then:

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:4321. Run these commands from the repository directory, which currently sits inside the outer workspace's `personal-website/` folder.

If Node was installed with Homebrew as `node@24`, add it to the current shell first:

```sh
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
```

## Validation and production preview

```sh
npm run check
npm run verify:portfolio
npm run build
npm run preview -- --host 127.0.0.1
```

The static site is generated in `dist/`. GitHub Pages, a deployment base path, and a custom domain are intentionally not configured.

Astro 7 runs the preview server in the background. Stop it with `npm run preview -- stop`. The development server stays in the terminal; stop it with Ctrl+C.

## Architecture

- `src/pages/index.astro`: homepage with hero, selected work, background, research and experience, and teaching.
- `src/pages/projects/event-time-volatility.astro`: the complete frozen case study, seven narrative sections, and methodology disclosure.
- `src/layouts/`: shared document and project structure.
- `src/components/`: shared navigation, project feature, external SVG figures, static math, research sections, profile links, and portrait.
- `src/data/projects.ts`: typed project metadata imported directly from the frozen card JSON.
- `src/data/site.ts`: personal profile URLs, email, and optional portrait configuration.
- `src/content/event-time-volatility/`: exact copies of the five frozen handoff documents, plus a figure catalog using report alt text and original aspect ratios.
- `src/styles/global.css`: colors, typography, spacing, components, and responsive rules.
- `public/projects/event-time-volatility/`: 17 unchanged SVGs, retaining the `main-case/`, `global/`, and `supporting-events/` directories and filenames.
- `public/resume/`, `public/images/`: reserved resume and portrait directories; no PDF or portrait has been fabricated.
- `scripts/verify-portfolio.mjs`: verifies frozen document/asset SHA-256 hashes, figure integration, report alt text, and aspect ratios against the copied manifest.

## Frozen research integration

The only research source is `/Users/jiawangdong/Documents/githubfiles/event-time-fx-volatility/portfolio/`. The website includes a local snapshot and builds independently of that external directory. No research data, development notes, or unpublished research is consumed.

The case study follows the frozen report and handoff order. Figures use external `<img>` elements without image-opening links. The homepage shows the broad physical-time preview and one project CTA. Supporting releases appear as physical-time / event-time pairs. Physical time, event time, return volatility, and jump volatility each show the base figure before its zoom. The physical-time broad view opens the case study; its zoom follows the clock construction. Return and jump pairs remain visible by default. Weight profiles and the event-price zoom use native `<details>` disclosures. The original methodology Markdown is rendered in full inside a separate disclosure.

KaTeX renders equations into native MathML at build time, with no runtime scripts or bundled font files. The Markdown processor normalizes only `$$` delimiter placement in memory so the frozen multiline equations parse correctly, shifts embedded heading levels, and makes wide equation regions keyboard accessible. The original methodology file remains byte-identical to the handoff. `npm run verify:portfolio` checks this.

The provided project GitHub URL is `https://github.com/Lionheartedbear/event-time-fx-volatility`. An unauthenticated HTTP check during integration returned 404; the canonical link is retained and its public availability still needs confirmation.

## Profile destinations and remaining assets

All personal destinations live in `src/data/site.ts`. LinkedIn is configured as `https://www.linkedin.com/in/wangdong-jia` and opens in a new tab with `noopener noreferrer` and an accessible label. No personal GitHub destination is currently displayed.

`RESUME_HREF` is `/resume/Wangdong-Jia-Resume.pdf`. The PDF is not present; `public/resume/` is reserved with `.gitkeep`. Resume remains a non-interactive label with a forthcoming description, so the site does not publish a broken link. Once the real PDF is added, set the Resume entry’s `available` flag to `true`. The link will then use the already configured path.

Email remains a `pending` placeholder. Add the approved portrait to `public/images/`, then set `PORTRAIT.src`, alt text, and dimensions in `src/data/site.ts`. The existing portrait region remains unchanged until then.

## Curated homepage content

The supplied content brief is the source for the new resume-based facts; no additional dates, degrees, institutions, achievements, or unpublished paper details are inferred. Background summarizes Berkeley IEOR research and undergraduate training in applied mathematics and physics. Four short entries cover Morgan Stanley quantitative research, stochastic systems/optimization/learning, healthcare overutilization detection, and noise-robust fractional-process estimation with its Journal of Applied Probability publication. Teaching names the four supplied Berkeley courses without adding a timeline.

## Visual system — warm Mondrian composition

The homepage is a personal landing page; the project page is a quieter research presentation. Both use the token block in `src/styles/global.css`:

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#EEE9E9` | Very light, low-saturation warm gray-red ground |
| `--surface` | `#F6F3F3` | Retained neutral token; the hero uses the page ground instead |
| `--ink` | `#161616` | Text, keyboard focus, and structural rules |
| `--accent-a` | `#EA9694` | Airy soft red |
| `--accent-b` | `#B9D9EB` | Official Columbia Blue |
| `--accent-c` | `#FFE66D` | Softened clear flag-inspired yellow |

Columbia Blue follows the [university’s official digital color specification](https://visualidentity.columbia.edu/content/color). Near-black text is used on all pale accent fills. The independent `--figure-paper: #FAF8F3` matches the unchanged frozen SVG ground; research figures retain their original colors.

### Homepage composition

The desktop hero retains its roughly 6:10 height-to-width ratio. The name stays on one line inside the light-blue left panel. The academic identity and short statement below it use the unchanged warm gray-red page ground. The central-right portrait region remains reserved. Only Resume and LinkedIn occupy the top-right yellow box. The existing tall rectangle below contains a restrained four-link internal section menu, retaining its page-ground fill and boundaries. The research-interests row uses pale red. There is no lower-right links block. Black rules follow cell boundaries.

The supplied brief described a Mondrian reference, but its attachment contained only text. The composition interprets that description through unequal rectangles, a dominant portrait region, controlled empty space, and slim colored bands; it does not claim to reproduce an unseen image.

The homepage and Selected Work band share C (`38.2%`) and D (`84.55%`) alignment guides. Track padding preserves these boundaries. Tablet widens the utility column while retaining the left guide. Mobile uses a 61.8% / 38.2% split for the single-line name and top-right yellow links box, with the portrait and quiet rectangle below; the bio and pale-red interests row then span the full width. Profiles remain stacked in the top-right box at every width.

### Research presentation

The project opening is on the neutral background, introduced by one slim yellow–blue–red label band. Section labels §1–§8 (including methodology) use short, single-line titles in narrow strips: a yellow number field, Columbia-blue title field, and soft-red terminal. A consistent 64px number track (36px on mobile) gives titles enough room without wrapping, truncation, or tiny type. The article keeps its existing narrative, formulas, supporting releases, and native technical disclosures. Shared project-level math tokens set display equations to `clamp(22px, 1.85vw, 26px)` everywhere, including technical methodology; inline MathML uses `1.08em`. Native MathML handles baselines and script sizing, while long display equations scroll within their keyboard-focusable regions.

The opening note reads:

> The exact numerical settings used in this project are for illustrative purposes only. In practical use, parameter choices should be adapted to the market and to the model-selection objective.

All 17 frozen SVGs remain. Main-case figure families follow 01 → 01B, 03 → 03B, 04 → 04B, and 05 → 05B; no 02B exists in the frozen bundle. Broad/zoom views retain matching bounds and captions. Return/jump pairs use a 36px gap (28px on mobile). The homepage now previews Figure 01 as well.

### Navigation and accessibility

The yellow block shows Resume (forthcoming) and the active LinkedIn link. The adjacent internal menu links to `#selected-work`, `#background`, `#research-experience`, and `#teaching`, in page order. Each target is a semantic section with a heading and `tabindex="-1"`, allowing native anchor navigation to move keyboard focus. There is no sticky navigation. Explore project remains the single project CTA; the title and preview figure are not duplicate links. The footer keeps only identity/copyright and the existing email placeholder. The homepage currently has seven anchors, including the accessibility skip link; activating the real Resume will add one.

The project page retains its eight section-navigation links, now labeled §1–§8, one GitHub link, and “Back to Main Page” links at the top and bottom, both pointing to `/`. Figure labels remain 01, 01B, and so on, distinct from section numbers. Including the skip link, it has 12 anchors. All image-opening links and fine-grained figure-reference links are removed. Native `<details>` controls still expose technical figures and methodology without JavaScript.

System serif/sans-serif/monospace fonts avoid remote requests. Wide equations scroll locally. Browser validation covers six widths (320, 375, 768, 1024, 1440, 1920px), single-line name and heading fit, exact hero fill colors, top-right profile placement, unchanged hero geometry, section numbering, display/inline math size, four keyboard-operable homepage anchors, link counts, figure order, frozen SVG hashes, local navigation, native keyboard controls, and automated WCAG accessibility checks.
