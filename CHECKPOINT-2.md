# Checkpoint 2: Application Readiness Tracker

## What changed

- Scheme document checklist checks persist across refreshes in the same browser and on the same device.
- Progress is stored locally in browser storage; the server receives no checklist state.
- Progress is keyed by scheme and document name so harmless list reordering does not mark the wrong item.
- Each scheme checklist has a clear-progress action.
- Storage errors and malformed saved data fall back safely to an empty checklist.

## What is intentionally not stored

- Citizen profile answers and chat history.
- Uploaded files; this prototype does not request or accept document uploads.
- Any application submission or official application status.

## Judge demo

1. Start the app and choose the Farmer demo.
2. Open a relevant scheme card.
3. Check a document in the checklist and close the scheme dialog.
4. Refresh the page and reopen the same scheme; the check remains and the progress count is shown.
5. Use **Clear checks** and reopen the scheme to show that the saved progress can be removed.

The tracker is a preparation aid only. SarkariSaathi does not submit applications or make official eligibility decisions.
