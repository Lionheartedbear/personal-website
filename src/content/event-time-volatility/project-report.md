# Volatility on an Event Clock

**Physical time moves uniformly. Markets do not.**

A second of foreign-exchange trading can contain very little price movement or a rapid sequence of revisions. A volatility measure built on equally spaced timestamps therefore observes a market whose activity is uneven. At quote frequency, bid/ask effects and small oscillations also complicate the distinction between movement and noise.

This project changes the clock before measuring volatility. It turns a public EUR/USD quote stream into a sequence of qualifying price movements, then applies causal filters to that sequence. The question is how this change of coordinates represents market activity, rather than whether it produces a profitable trading signal.

The main example surrounds the February 11, 2026 NFP / Employment Situation release at 13:30 UTC. Its visible price response makes the construction easy to follow: the same observations can be examined first in physical time and then in event time.

## 1. Let price movement define the clock

For each quote, the mid-price is the average of bid and ask. Detection uses a second, deliberately modest average: the current mid-price and the immediately preceding mid-price. Writing these as p_i and p_{i-1}, the causal trigger is:

$$q_i = (p_{i-1}+p_i)/2.$$

The initial price seeds the clock. A new observation is accepted when the trigger moves at least **0.2 pip**, or **0.00002 EUR/USD price units**, from its last accepted value. The comparison includes only a negligible floating-point boundary tolerance.

Crucially, detection and recording are distinct. The two-quote average controls acceptance, but the recorded observation is the **actual current mid-price**, with its actual timestamp. Overshoot is retained, and the accepted trigger becomes the next reference. Prices are neither replaced by averages nor forced onto a ladder of exact threshold-sized steps.

![EUR/USD mid-price, two-quote trigger and accepted crossings around the February NFP release](assets/main-case/figure_01_physical_price_threshold.svg)

![The same physical-time price and threshold construction, zoomed around the release](assets/main-case/figure_01b_physical_price_threshold_zoom.svg)

The zoom separates the raw path, detection signal and accepted observations. Its x-axis remains physical UTC time; irregular spacing between accepted points is part of the result.

## 2. From physical time to event time

Accepted crossings cluster when qualifying movements arrive quickly and spread apart when they arrive slowly. The normalized cumulative-crossing curve makes that changing pace visible: a steeper segment means more crossings per unit of physical time. It divides cumulative crossings by the complete plotted-day total, starts at zero and ends at one.

![Normalized cumulative threshold crossings over the full physical-time day](assets/main-case/figure_02_normalized_cumulative_crossings.svg)

This curve is retrospective because its denominator uses the whole day. It explains the clock; it is **not an estimator input**.

Now give the accepted prices consecutive indices, n = 0, 1, 2, … . Their values and ordering are unchanged, but their horizontal spacing becomes uniform. Active periods consume indices quickly in physical time; quiet periods consume them slowly. One event increment represents a qualifying trigger movement rather than a fixed number of seconds.

![The accepted EUR/USD price history on consecutive event indices](assets/main-case/figure_03_event_time_price.svg)

![Accepted event prices around the release, using the shared event-index zoom](assets/main-case/figure_03b_event_time_price_zoom.svg)

That coordinate change is the central idea. A fixed amount of event history has a variable physical duration. It does not make volatility constant or establish that every retained move is informative. It changes which observations define the measurement horizon.

## 3. Measuring return volatility in event time

Let X_n = log(P_n), where P_n is the accepted price. A smooth return operator distributes weight across **20 event prices**:

$$R_n=\sum_{j=0}^{19}h_jX_{n-j}.$$

Recent and older prices receive opposite signs. Small edge weights and two smooth lobes replace a hard two-endpoint difference with a distributed return measurement. The public Kaiser-derived kernel is approximately zero-sum and oriented so a rising log-price trend produces a positive response.

The squared filtered returns are then averaged with **60 nonnegative Kaiser weights**, summing to one:

$$V^R_n=\sum_{j=0}^{59}w^R_jR_{n-j}^{2},\qquad
\sigma^R_{n,\mathrm{unscaled}}=\sqrt{V^R_n}.$$

![Return volatility across the broad event-index period](assets/main-case/figure_04_event_time_return_volatility.svg)

![Actual 20-coefficient return kernel and 60-weight variance profile](assets/global/figure_06_return_volatility_weights.svg)

The first kernel has random-walk variance gain **24**. Its **20-coefficient support** and **24-increment normalization target** are different quantities. This normalization matches an independent-increment reference scale; it does not make the estimator unbiased in empirical markets. All weights act on current or past observations, although smooth trailing weights introduce lag.

## 4. A high-frequency counterpart

A second measure emphasizes rapid event-to-event variation. Its first stage uses **12 coefficients** with alternating signs inside a symmetric Kaiser envelope:

$$J_n=\sum_{j=0}^{11}g_jX_{n-j},\qquad
g_{0,j}=(-1)^j\operatorname{Kaiser}_{12}(j;8).$$

The kernel is scaled to the same random-walk gain of 24. Squared outputs are averaged with **12 nonnegative, unit-sum Kaiser weights**, then square-rooted.

![Jump volatility across the same broad event-index period](assets/main-case/figure_05_event_time_jump_volatility.svg)

![Actual alternating-sign jump kernel and its 12-weight variance profile](assets/global/figure_07_jump_volatility_weights.svg)

“Jump volatility” is an illustrative high-frequency measure designed to emphasize rapid event-to-event variation. It can respond to abrupt movement, rapid oscillation and microstructure effects. It is not a formal detector or decomposition of continuous versus discontinuous price moves. Its different spectral weights and shorter averaging history explain why it need not trace the return-volatility curve.

## 5. Around the February NFP release

The broad **13:00–14:15 UTC** window contains **17,598 quotes** and **5,359 accepted threshold crossings**. EUR/USD spans approximately **71.3 pips** within that interval. The price moves sharply near the scheduled release, while the cumulative diagnostic shows crossings accumulating faster around the same period.

The first accepted observation at or after release is **13:30:01.183 UTC**, display index **382**. That reference is shared by the price, return-volatility and jump-volatility views. Their event-index zooms all cover **322–442**, so differences between the curves reflect their operators rather than mismatched samples.

![Return volatility around the February release on the shared event-index zoom](assets/main-case/figure_04b_event_time_return_volatility_zoom.svg)

![Jump volatility over exactly the same event-index zoom](assets/main-case/figure_05b_event_time_jump_volatility_zoom.svg)

Both measures show pronounced responses near the marked release. These plots document timing and price variation; they do not establish which component of the announcement caused the movement. This case was selected for visual clarity, without a strategy-performance selection criterion.

## 6. Same method, different releases

The same threshold, filters, normalizations and scale are applied without release-specific retuning to three supporting examples. Each pair shows the physical-time price zoom beside event-time return volatility. They provide context for the construction across distinct releases, rather than a statistical ranking of outcomes.

**March 6, 2026 — NFP, 13:30 UTC.**

![March NFP physical-time price and threshold zoom](assets/supporting-events/nfp-2026-03-06-physical.svg)
![March NFP event-time return-volatility zoom](assets/supporting-events/nfp-2026-03-06-return-volatility.svg)

**February 18, 2026 — FOMC minutes, 19:00 UTC.**

![February FOMC minutes physical-time price and threshold zoom](assets/supporting-events/fomc-2026-02-18-physical.svg)
![February FOMC minutes event-time return-volatility zoom](assets/supporting-events/fomc-2026-02-18-return-volatility.svg)

**March 18, 2026 — FOMC policy statement, 18:00 UTC.**

![March FOMC statement physical-time price and threshold zoom](assets/supporting-events/fomc-2026-03-18-physical.svg)
![March FOMC statement event-time return-volatility zoom](assets/supporting-events/fomc-2026-03-18-return-volatility.svg)

## 7. What this project demonstrates

Changing the clock links sampling and measurement. Threshold acceptance defines an irregular observation sequence; event indexing gives it a regular computational axis; causal signal processing measures variation over that history. The two public filter constructions expose different frequencies of movement while keeping the accepted prices fixed. Explicit alignment and reproducible figures make each step inspectable.

## Methodology and limitations

The examples use public HistData EUR/USD quotes, interpreting provider timestamps as **fixed EST, UTC−05:00 without daylight-saving adjustment**, then converting to UTC. Raw data are not redistributed. These are public illustrative Kaiser filters, with no proprietary coefficients or exact proprietary Bessel-filter claim.

A fixed multiplier **0.179224** is applied once after each square root, identically across all four releases. It was chosen retrospectively from an August public example as an illustrative scale calibration. It is not a theoretical convexity correction, an unbiasedness theorem, a pip-to-bp identity or an event-specific fit. Figures show 10,000 times the scaled log-return volatility in basis-point units, without annualization.

The filters are causal conditional on their fixed parameters; the scale selection and case study are retrospective. There is no trading strategy, alpha claim or forecasting-superiority claim. The [technical methodology](methodology-summary.md) details normalization, warm-up and units.

[View implementation on GitHub →](https://github.com/Lionheartedbear/event-time-fx-volatility)
