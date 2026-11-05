# Project architecture
- Institutional video embeds share a client-effect YouTube API loader and a per-player first-play tracker; this preserves native controls without autoplay or duplicate resume events.
- Video activation uses existing marketing consent or an explicit per-player permission, while analytics always requires existing Analytics consent; no global legal copy is changed.
- Initialize the linked GA4 browser tag only after Analytics consent and only when no existing gtag is present; this avoids a second property or duplicate script.