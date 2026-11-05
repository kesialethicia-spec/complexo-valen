# Project architecture
- Institutional video embeds share a client-effect YouTube API loader and a per-player first-play tracker; this preserves native controls without autoplay or duplicate resume events.
- Video activation uses existing marketing consent or an explicit per-player permission, while analytics always requires existing Analytics consent; no global legal copy is changed.