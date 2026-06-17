# OKF Workspace Beta — Source Split Notes

This package is the first safe source split of the original single-file `index.html`.

## What changed

- `index.html` now contains the app shell, external library scripts, import map, and a reference to `css/app.css` and `js/main.js`.
- All inline CSS was extracted to `css/app.css`.
- All inline non-importmap JavaScript was extracted to `js/main.js`.
- Planned module folders were created as placeholders so the next refactor can move features gradually without changing everything at once.

## Important

This is a **mechanical split**, not yet a full ES module refactor. That is intentional.

The app should behave like the current development version while making the project easier to organize.

## Recommended next move

1. Test that this split version boots.
2. If it boots, start moving one domain at a time out of `js/main.js`.
3. Begin with low-risk modules:
   - `core/logger.js`
   - `core/toast.js`
   - `ui/dark-mode.js`
   - `ui/menus.js`
4. Then move storage and render logic.
5. Add OKF Workspace only after the split version is stable.
