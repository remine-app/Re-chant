# V1.0.0 verification

2026-11-01

- TypeScript checking and production Vite build: PASS.
- Node regression tests: 16 PASS, 0 failures, 0 skipped.
- Chromium browser E2E: 2 PASS.
- All 11 songs: rendered whole-text and hint-mode row strings compared exactly against the uploaded runtime pack, preserving exported row/span order.
- Glow Up: 41 events preserved; whole/hint/original switching verified.
- Pretty Girl: original `(함성)` hints retained; post-audio group at 210181 ms displayed.
- Viewports: 320, 390 and 1280 px checked for horizontal overflow.
- Actual supplied MP3 pack installed through the UI; media position advanced; silent-tail seek, pause/resume and installed audio after refresh verified.
- Clock unit test covers media time, ended transition, pause/resume, seek back into media, bounds and completion.
- Loader test covers one broken song with ten healthy songs remaining and a failed manifest surfaced as an error.
- Existing localStorage backup/restore and IndexedDB atomic install failure preservation tests pass; storage keys and database version remain unchanged.
- The latest uploaded content JSON files are copied unchanged. Web code does not rewrite timing or hints.

Comparison scope: exact runtime data and browser DOM compared against the Studio-exported presentation. Studio and web were not visually inspected side-by-side for all time positions. Real iOS/Android devices, Safari, physical audio output and background OS suspension were not tested. Chromium playback advancement does not constitute a listening audit of every song. Final deployment should receive a short real-device check.

Browser-test audio is not bundled in the deliverable. For another machine, set RECHANT_AUDIO_PACK to the supplied audio ZIP path before running npm run test:e2e; otherwise only the actual-audio scenario is skipped with an explicit reason.

No Git remote write or live deployment was performed. The included workflow runs tests/build and publishes a complete GitHub Pages artifact when pushed to main.
