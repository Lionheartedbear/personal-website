# Methodology summary

This companion specifies the fixed construction behind the public EUR/USD figures. Return volatility uses **20 price coefficients and 60 variance weights**; jump volatility uses **12 and 12**. Every Kaiser profile uses beta 8. Both first-stage kernels have random-walk variance gain 24, and both displayed volatility measures use the fixed post-root multiplier 0.179224. These quantities describe different parts of the estimator and should not be conflated.

## Quotes, trigger and accepted observations

For bid b_i and ask a_i, the mid-price is p_i = (b_i+a_i)/2. HistData provider times follow fixed EST, UTC−05:00 without daylight-saving adjustment, and are converted to timezone-aware UTC. Existing normalization removes invalid and exact duplicate quotes and preserves the ordering of distinct observations with tied timestamps.

The first available quote seeds accepted price P_0, timestamp T_0 and trigger reference q_last = p_0. For i ≥ 1, including quotes that were not previously accepted,

$$q_i=(p_{i-1}+p_i)/2.$$

Accept a new observation when the nonzero trigger change satisfies

$$|q_i-q_{\mathrm{last}}|+\tau_i\geq 0.00002,$$

where the implementation uses

$$\tau_i=4\epsilon_{\mathrm{machine}}\max(|q_i|,|q_{\mathrm{last}}|).$$

This is a floating-point boundary tolerance, not an economic reduction of the 0.2-pip threshold. On acceptance, record the actual p_i and timestamp, retain overshoot, and set q_last = q_i. The two-mid-price average controls detection only; it never substitutes for the accepted market price. A constant trigger does not create crossings.

## The event axis and display mapping

Accepted observations form (T_n,P_n), with consecutive event indices n and irregular UTC timestamps T_n. All filtering uses X_n = log(P_n). Lag zero always denotes the newest accepted price. Display index zero is the first observation in the broad plotting window; numerical prehistory remains intact before that crop.

Broad physical windows are inclusive from 30 minutes before to 45 minutes after each release, with one further hour of numerical prehistory before the broad window. Physical zooms cover −5/+10 minutes. The release marker is the first accepted timestamp at or after the scheduled release. Event-index zooms retain that display index ±60, clipped only at a boundary. Price and both volatility measures share identical broad rows and identical zoom rows.

The full-day cumulative-crossing diagnostic runs from 22:00 UTC on the preceding date to 22:00 UTC on the release date. It excludes its initialization seed and divides cumulative accepted crossings by the entire day's total. Its normalization is retrospective; it is never fed into either filter.

## Return operator: 20 coefficients

The generalized return is

$$R_n=\sum_{j=0}^{19}h_jX_{n-j}.$$

To specify the actual public two-lobe construction, let A = numpy.kaiser(12, 8). Define the ten-element lobe u = A[1:-1] − A[0], then concatenate h0 = (u, −reverse(u)). Recent lags receive the positive lobe and older lags the negative lobe. The endpoint-baseline subtraction gives small weights at each lobe's edges.

The implementation validates the near-zero coefficient sum, subtracts only its numerical mean residual and checks that −Σ j h_j is positive. Consequently a rising linear log-price trend produces a positive filtered return. It then applies the random-walk normalization below. This is a Kaiser-derived public construction, not an exact proprietary Bessel filter.

## Random-walk-gain normalization

For any zero-sum lag kernel c of length L, define

$$G(c)=\sum_{k=0}^{L-2}\left(\sum_{j=0}^{k}c_j\right)^2.$$

This is `sum(cumsum(c)[:-1]**2)`. Under X_n = X_{n-1}+ε_n with independent increments of variance s², the filtered value has variance G(c)s². Multiplying c by sqrt(24/G(c)) therefore sets its gain to 24, the variance scale of a nominal 24-increment return under that reference model.

The return support is **20 prices**, spanning 19 increments. The jump support is **12 prices**, spanning 11 increments. The target **24** is independent of those support counts. Matching variance gain neither matches frequency response nor proves unbiased volatility estimation outside the reference model.

## Return second moment and volatility

With B = numpy.kaiser(60, 8), set w^R = B/ΣB. All 60 coefficients are nonnegative and sum to one. Then

$$V^R_n=\sum_{j=0}^{59}w^R_jR_{n-j}^{2},\qquad
\sigma^R_{n,\mathrm{unscaled}}=\sqrt{V^R_n}.$$

V^R is a weighted second moment, without subtraction of an estimated return mean. The symmetric weights are positioned on trailing observations, so their largest influence lies inside the available history rather than at the newest point.

## Jump operator and second moment: 12 / 12

Let a = numpy.kaiser(12, 8) and g0_j = (−1)^j a_j for j = 0,…,11. Set

$$g=g_0\sqrt{24/G(g_0)},\qquad J_n=\sum_{j=0}^{11}g_jX_{n-j}.$$

The signs alternate at every coefficient. Absolute magnitudes follow one symmetric Kaiser envelope: small at both edges and largest around the center. Even support cancels mirrored terms to floating-point tolerance. No mean subtraction, envelope reshaping or positive-trend-response constraint is applied to this oscillatory kernel.

Use w^J = a/Σa, the actual 12 nonnegative averaging weights:

$$V^J_n=\sum_{j=0}^{11}w^J_jJ_{n-j}^{2},\qquad
\sigma^J_{n,\mathrm{unscaled}}=\sqrt{V^J_n}.$$

This high-frequency counterpart emphasizes rapid event-to-event variation. Abrupt movement, rapid oscillation and microstructure effects can all contribute. It is not formal identification of discontinuities or a decomposition into continuous and jump variation.

## Scale, units and causality

For either measure K ∈ {R,J},

$$\sigma^K_n=0.179224\,\sigma^K_{n,\mathrm{unscaled}},\qquad
\mathrm{plotted\ bp}=10000\,\sigma^K_n.$$

The multiplier is applied once after the square root, across all four releases. It was retrospectively chosen from an August public example and is an illustrative scale calibration. It is not a theoretical convexity correction, an unbiasedness theorem, a pip-to-bp identity or a release-specific fitted parameter. Numerical second-moment columns remain unscaled; both unscaled and scaled volatility were retained in the research outputs.

An EUR/USD pip is 0.0001 absolute price units. A displayed bp is 0.0001 in scaled log-return units. Equal numerical unit sizes do not make the price trigger a volatility target. No annualization is applied.

Both stages require complete trailing windows. The first return estimate is valid at source index 19, and return volatility at index 78: 79 observations are required. Jump filtering first becomes valid at index 11 and jump volatility at index 22: 23 observations are required. Incomplete or missing histories remain NaN; there is no partial-window renormalization or future input. Symmetric trailing windows remain causal but introduce lag.

Event-index plots connect actual consecutive estimates. They introduce no intermediate observations or additional smoothing. Causality is conditional on fixed parameters; calibration and full-sample diagnostics are retrospective. Four selected releases illustrate the construction, not statistical superiority, alpha or forecasting performance. Public data and illustrative kernels do not reproduce proprietary methodology, and the handoff redistributes figures rather than raw or processed market-data tables.
