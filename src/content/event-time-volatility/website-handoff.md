# Website handoff — Volatility on an Event Clock

## Destination and homepage

Project route: `/projects/event-time-volatility`.

Show a prominent Selected Work card using `project-card.json`:

- Title: **Volatility on an Event Clock**
- Subtitle: **Physical time moves uniformly. Markets do not.**
- CTA: **Explore project →**, linking to the dedicated project route.
- Hero/card asset: `assets/main-case/figure_01b_physical_price_threshold_zoom.svg`.

The card should signal quantitative research, market microstructure intuition, mathematical signal processing and clean empirical implementation. GitHub is the secondary destination, not the primary card link. Use the card's supplied description and tags rather than inventing performance claims.

## Content and progressive disclosure

Use `project-report.md` as the canonical public case study and `methodology-summary.md` as the expandable technical companion. This package is the source of truth for the public method. Do not pull older methodological descriptions from the research repository. Return supports are 20/60, jump supports 12/12, beta 8 throughout, normalization target 24, fixed post-root multiplier 0.179224 and threshold 0.2 pip.

Keep the report's section order. Use the following exact asset mapping; paths are relative to this package. Main-case files depict the February 11, 2026 NFP / Employment Situation release at 13:30 UTC.

| Page position | Default assets | Detail view / expansion |
|---|---|---|
| Hero and opening | `assets/main-case/figure_01b_physical_price_threshold_zoom.svg` | `assets/main-case/figure_01_physical_price_threshold.svg` |
| 1. Let price movement define the clock | `assets/main-case/figure_01_physical_price_threshold.svg` | `assets/main-case/figure_01b_physical_price_threshold_zoom.svg` |
| 2. From physical time to event time | `assets/main-case/figure_02_normalized_cumulative_crossings.svg` and `assets/main-case/figure_03_event_time_price.svg` | `assets/main-case/figure_03b_event_time_price_zoom.svg` |
| 3. Measuring return volatility in event time | `assets/main-case/figure_04b_event_time_return_volatility_zoom.svg` | `assets/main-case/figure_04_event_time_return_volatility.svg` and `assets/global/figure_06_return_volatility_weights.svg` |
| 4. A high-frequency counterpart | `assets/main-case/figure_05b_event_time_jump_volatility_zoom.svg` | `assets/main-case/figure_05_event_time_jump_volatility.svg` and `assets/global/figure_07_jump_volatility_weights.svg` |
| 5. Around the February NFP release | Shared event-index zooms from sections 2–4, compared with a common release marker | Reuse the existing views; do not add duplicate chart stacks |
| 6. Same method, different releases | The three compact pairs listed below | Enlarge existing SVGs on request |
| 7. What this project demonstrates | Report text | No additional diagnostics |
| Methodology and limitations | Concise report note and expandable `methodology-summary.md` | Existing weight profiles and equations |

The report contains the full editorial asset references. On the live page, avoid repeating the same image in the hero and later sections: use a thumbnail, an anchor or a shared expandable view. Make weights accessible beside their estimator explanation without forcing every reader through coefficient mathematics. Preserve captions, units, physical/event-axis distinctions and the shared broad/zoom mappings.

## Supporting releases

Show only these two views for each supporting release, with physical time and event time clearly labeled. Do not pretend their x-axes are interchangeable.

| Release | Physical-price zoom | Event-time return-volatility zoom |
|---|---|---|
| March 6, 2026 NFP, 13:30 UTC | `assets/supporting-events/nfp-2026-03-06-physical.svg` | `assets/supporting-events/nfp-2026-03-06-return-volatility.svg` |
| February 18, 2026 FOMC minutes, 19:00 UTC | `assets/supporting-events/fomc-2026-02-18-physical.svg` | `assets/supporting-events/fomc-2026-02-18-return-volatility.svg` |
| March 18, 2026 FOMC statement, 18:00 UTC | `assets/supporting-events/fomc-2026-03-18-physical.svg` | `assets/supporting-events/fomc-2026-03-18-return-volatility.svg` |

## Asset integrity and public language

Do not introduce V1/V2/V3/V4/V5 development terminology into page copy, navigation, captions or filenames. Do not link `Experimenting.md` or experiment selection documents. Do not expose raw data or copy market-data tables. Keep research diagnostics out of the main page and technical details behind progressive disclosure. Do not imply alpha, forecasting superiority or formal jump detection.

**Public exports:** assets are versionless public exports rendered from the exact approved V5 numerical inputs and plotting definitions. Numerical content is identical to that approved source; development/version wording is removed, and public accents, main titles and primary mathematical curves use deep green `#285447`. Experimental source assets remain preserved separately. The export validates all SVG graphical elements against the approved figures, allowing only the version-label removal, documented color changes and metadata replacement. No post-render XML editing is used.

Public SVGs are validated exports. Preserve their bytes, aspect ratios, axis titles, scales and data. Use `<img>` or equivalent external SVG loading rather than injecting multiple SVGs with colliding internal IDs. Reuse the descriptive report alt text; provide zoom/open controls for dense figures on small screens. Render the supplied equations with accessible math support. Provenance belongs in the manifest rather than the hero.

## Visual direction and CTA

Use a premium light editorial appearance: warm white, ivory or beige, restrained dark typography, generous whitespace and minimal ornament. The figures already use background `#faf8f3`, muted blue-grey `#667784`, deep green `#285447` for public accents, main titles and primary mathematical curves, and dark teal `#375b61` for the averaged trigger. Let mathematical figures supply the visual interest, combining research-paper precision with polished product-page presentation.

Avoid Bloomberg-terminal styling, neon trading aesthetics and generic Bootstrap student-portfolio cards. Do not redesign the approved figures to suit a theme. No website is implemented in this package.

Footer / secondary CTA: **[View code and methodology on GitHub →](https://github.com/Lionheartedbear/event-time-fx-volatility)**.

## Rebuild and provenance

From the research repository, run `.venv/bin/python scripts/build_portfolio_package.py`. The builder validates pinned source hashes, reads the existing processed numerical inputs, and renders 17 versionless public SVGs. It uses the fixed freeze timestamp by default and regenerates the handoff and manifest with updated export hashes; public copy and asset filenames remain unchanged. For an explicitly dated rebuild, pass `--generated-at` with an aware ISO timestamp; the same timestamp and sources reproduce identical output bytes. Saved normalized quotes and estimates are read only for plotting; no raw-data parsing, filtering or estimator recalibration occurs.

`manifest.json` records approved-source and destination hashes, final parameters, release metadata, numerical provenance references and the no-market-data-redistribution policy. The future website repository needs only this package to assemble the page; it does not need the research data directories or knowledge of the experiment history.
