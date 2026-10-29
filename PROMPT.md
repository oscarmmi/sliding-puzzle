Build a 15-puzzle in THIS folder: C:\xampp\htdocs\sliding-puzzle

A recruiter-ready browser sliding puzzle. Playable, polished, no backend.

## Game
- Call it "Tile Shift". Original numbered neon tiles, no licensed logos.
- 4×4 grid, tiles 1–15 plus one empty cell. Click/tap a tile adjacent to the empty cell to slide it. Keyboard arrows slide the tile into the empty cell from that direction. R shuffles a new solvable board.
- Shuffle must produce a solvable permutation (even inversion count with the blank on the correct parity).
- Moves counter and timer. Win when tiles sit 1–15 in row-major order with the empty cell last. Local best (fewest moves) in localStorage.

## UI
- Dark board, glowing numbered tiles, empty cell inset. Not a default Vite page. No Vue logo.
- 390px phone and 1280px desktop.

## Tests
- Vitest (pure logic): a tile adjacent to the empty cell slides; a non-adjacent tile is rejected; a solved board is a win; the shuffle helper returns a solvable board.
- `npm test` and `npm run build` must pass.

## GitHub
- Repo: https://github.com/oscarmmi/sliding-puzzle
- Pages: https://oscarmmi.github.io/sliding-puzzle/
- vite base `/sliding-puzzle/`
- Commit: feat: add sliding puzzle
- First commit must `git add -A` so package.json, vite.config.ts, tsconfigs, src/main.ts, index.html, .gitignore, and .github/workflows/pages.yml ship with the game.
- gh repo edit --description "Tile Shift 15-puzzle in Vue 3 + TypeScript, playable on GitHub Pages." --add-topic vue --add-topic typescript --add-topic game --add-topic puzzle --add-topic sliding-puzzle
- Stop. Print the repo URL and Pages URL.
