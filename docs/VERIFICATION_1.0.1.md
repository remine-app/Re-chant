# v1.0.1 verification

Node regression tests: 16 passed. TypeScript and production build: passed. Chromium E2E: 2 passed.

New coverage: 59.9s does not count; 60s counts once; 180s still one count. Pause/background gaps excluded. Home restores saved silent-tail position, song-list selection starts at zero. Settings no longer offers delete. All 11 songs' rendered whole/hint strings remain exactly equal to exported runtime strings despite dot styling. Real audio pack install/playback/tail pause/resume continues to pass.

Limits: physical mobile devices and Safari have not been tested. Existing historical counts remain as stored. This changes only the web app, not Studio. No remote Git push or deployment was performed.
