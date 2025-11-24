# GeoKahoot (Turkey) — README

This small web game asks players to find Turkish provinces on a Leaflet map.

Two game modes:
- `Easy`: the hint shows the province plate number (e.g. `34` for İstanbul); the player clicks the map near the province. Points are awarded by distance.
- `Hard`: the hint shows a short cultural / encyclopedic text about the province; the player must click near the right province. Cultural hints come from `data/cultural_questions.json` (see below).

Files you may want to know about
- `index.html` — main page and UI.
- `script.js` — game logic and map interactions.
- `style.css` — basic styling.
- `data/cultural_questions_sample.json` — small sample of cultural hints used as a fallback.
- `scripts/fetch_cultural_questions.py` — helper that fetches Turkish Wikipedia summaries and builds `data/cultural_questions.json`.

How to run locally (Windows PowerShell)
1. (Optional) Populate full cultural question set from Turkish Wikipedia. From the project folder run:

```powershell
python .\scripts\fetch_cultural_questions.py
```

This will create `data/cultural_questions.json` with Wikipedia summary text for each province. The script is polite (adds a short delay between requests). Internet access is required.

2. Start a simple static server so `fetch()` and assets work correctly. From the project root run:

```powershell
python -m http.server 8000
```

3. Open the game in your browser:

```
http://localhost:8000/
```

Usage notes
- The app no longer depends on a GeoJSON file. It uses `plateCentroids` fallback coordinates when a GeoJSON isn't provided.
- If `data/cultural_questions.json` exists, Hard mode will use that file. Otherwise the app falls back to `data/cultural_questions_sample.json`.
- If you want to customize or extend the cultural hints, edit or replace `data/cultural_questions.json` (JSON object with province names as keys and short hint strings as values).

Troubleshooting
- If you see CORS or `fetch` errors while loading the questions, ensure you started the local static server and you opened the game via `http://localhost:8000` and not `file://`.
- If the fetcher script fails, it will print per-province errors; you can re-run it later. The script uses the Turkish Wikipedia REST summary API and may be blocked if run too frequently.

Want me to do the fetch for you?
- I cannot run network requests from here, but I prepared `scripts/fetch_cultural_questions.py` so you can run it locally with a single command above. If you want, I can tweak the script to fetch different lengths or to store the Wikipedia URL alongside each hint.

If you'd like, I can also:
- Increase the number of sample hints in `data/cultural_questions_sample.json`.
- Add UI text that credits the source (e.g., "Source: Wikipedia (tr)").
- Make Hard mode require a smaller distance threshold (harder scoring).

Enjoy — tell me which next tweak you prefer.
