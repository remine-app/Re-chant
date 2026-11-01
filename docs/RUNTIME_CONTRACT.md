# Re:chant V1 runtime contract

Web v1.0.0 consumes rechant-content-pack-1 / rechant-web-runtime-1 / web-runtime only. Each song uses rechant-song-content-1 and rechant-performance-1.

displayGroups are authoritative presentation data. Group/row/span order, whitespace, hints and event IDs are retained. A row start may be null (Busy Boy introductory row); its containing group supplies the presentation time. Original lyrics use lines, without derived chants. Matching groups with equal start times activate together. defaultOffsetMs is added to playback time for selection and subtracted for click seeking; seekLeadMs affects navigation only.

durationMs is media duration. practiceDurationMs includes the silent outro. After media ended, AudioEngine uses performance.now; pause freezes the tail, resume continues it, seeking into media restores media time. No scoring interpretation is attached to display cue times.

Manifest/song requests bypass browser HTTP cache. GitHub Pages publishes one complete build artifact, so operators must update the whole content directory and manifest in one deployment. Content profile is validated, not converted from editor backups. Errors are isolated per song; a broken manifest is an application-level error.

The audio IndexedDB name and user localStorage keys are unchanged. Required audio version, SHA-256, bytes and duration must match. Existing matching audio is reused. Static deployment contains no MP3.

Current fixture: 11 songs, 678 original lines, 431 events, 687 groups, 6 post-audio events across four songs. Glow Up has 41 events. These counts are regression assertions, not loader constraints.
