<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { isSolved, moveTile, shuffleBoard, type Board, type Direction } from './game/puzzle'

const BEST_KEY = 'tile-shift-best'
const board = ref<Board>(shuffleBoard())
const moves = ref(0)
const elapsedSeconds = ref(0)
const best = ref<number | null>(null)
const hasStarted = ref(false)
const hasWon = computed(() => isSolved(board.value))

let clock: number | undefined

onMounted(() => {
  const savedBest = Number(window.localStorage.getItem(BEST_KEY))
  best.value = Number.isFinite(savedBest) && savedBest > 0 ? savedBest : null
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopClock()
  window.removeEventListener('keydown', handleKeydown)
})

function stopClock() {
  if (clock !== undefined) {
    window.clearInterval(clock)
    clock = undefined
  }
}

function startClock() {
  if (clock === undefined) clock = window.setInterval(() => elapsedSeconds.value++, 1000)
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

function slide(tile: number) {
  if (hasWon.value) return
  const next = moveTile(board.value, tile)
  if (!next) return
  board.value = next
  moves.value++
  if (!hasStarted.value) {
    hasStarted.value = true
    startClock()
  }
  if (isSolved(next)) {
    stopClock()
    if (best.value === null || moves.value < best.value) {
      best.value = moves.value
      window.localStorage.setItem(BEST_KEY, String(moves.value))
    }
  }
}

function startNewGame() {
  stopClock()
  board.value = shuffleBoard()
  moves.value = 0
  elapsedSeconds.value = 0
  hasStarted.value = false
}

const keyDirections: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key.toLowerCase() === 'r') {
    event.preventDefault()
    startNewGame()
    return
  }
  const direction = keyDirections[event.key]
  if (!direction) return
  event.preventDefault()
  const emptyIndex = board.value.indexOf(0)
  const row = Math.floor(emptyIndex / 4)
  const col = emptyIndex % 4
  const offsets: Record<Direction, [number, number]> = {
    up: [1, 0],
    right: [0, -1],
    down: [-1, 0],
    left: [0, 1],
  }
  const [rowOffset, colOffset] = offsets[direction]
  const sourceRow = row + rowOffset
  const sourceCol = col + colOffset
  if (sourceRow < 0 || sourceRow > 3 || sourceCol < 0 || sourceCol > 3) return
  slide(sourceRow * 4 + sourceCol)
}
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#top" aria-label="Tile Shift home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span class="brand-name">tile<span>shift</span></span>
      </a>
      <div class="topbar-meta">
        <span class="live-dot"></span>
        <span>THE DAILY BRAIN BREAK</span>
      </div>
      <a class="github-link" href="https://github.com/oscarmmi/sliding-puzzle" target="_blank" rel="noreferrer">
        <span>Made to be played</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
      </a>
    </header>

    <main id="top" class="game-layout">
      <section class="play-column" aria-labelledby="game-title">
        <div class="intro-row">
          <div>
            <p class="eyebrow"><span class="eyebrow-line"></span> A LITTLE LOGIC GOES A LONG WAY</p>
            <h1 id="game-title">Make it <span>click.</span></h1>
            <p class="intro-copy">Slide the tiles into order. Trust your instinct, then trust it again.</p>
          </div>
          <div class="difficulty-tag"><span>01</span> CLASSIC 15</div>
        </div>

        <div class="board-toolbar">
          <div class="board-label"><span class="board-label-dot"></span> PUZZLE IN PROGRESS</div>
          <div class="keyboard-hint" aria-label="Use arrow keys to slide tiles">
            <span>ARROWS</span><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
          </div>
        </div>

        <div class="board-frame" :class="{ 'board-frame--won': hasWon }">
          <div class="board-grid" role="group" aria-label="Sliding puzzle board, 4 by 4">
            <template v-for="(tile, index) in board" :key="tile || 'empty'">
              <button
                v-if="tile !== 0"
                class="tile"
                :class="[`tile--tone-${tile % 6}`, { 'tile--home': tile === index + 1 }]"
                :aria-label="`Tile ${tile}${tile === index + 1 ? ', in the correct position' : ''}`"
                :aria-disabled="!board.some((value, emptyIndex) => value === 0 && (Math.abs(Math.floor(emptyIndex / 4) - Math.floor(index / 4)) + Math.abs(emptyIndex % 4 - index % 4) === 1))"
                @click="slide(index)"
              >
                <span class="tile-number">{{ tile.toString().padStart(2, '0') }}</span>
                <span class="tile-orbit" aria-hidden="true"></span>
                <span class="tile-spark" aria-hidden="true">✳</span>
              </button>
              <div v-else class="empty-cell" role="img" aria-label="Empty space">
                <span></span>
              </div>
            </template>
          </div>
          <div v-if="hasWon" class="win-stamp" role="status">
            <span>✦</span> BEAUTIFULLY DONE <span>✦</span>
          </div>
        </div>

        <div class="board-footer">
          <span><span class="footer-star">✳</span> Every move gets you closer.</span>
          <button class="reset-button" @click="startNewGame"><span aria-hidden="true">↻</span> New shuffle <kbd>R</kbd></button>
        </div>
      </section>

      <aside class="side-column" aria-label="Game statistics and instructions">
        <div class="score-card">
          <div class="score-card-top"><span>YOUR RUN</span><span class="score-spark">✳</span></div>
          <div class="move-count" aria-live="polite">{{ moves.toString().padStart(2, '0') }}<span> moves</span></div>
          <div class="score-divider"></div>
          <div class="stats-row">
            <div class="stat"><span class="stat-label">TIME</span><strong>{{ formatTime(elapsedSeconds) }}</strong></div>
            <div class="stat"><span class="stat-label">PERSONAL BEST</span><strong>{{ best !== null ? `${best} moves` : '—' }}</strong></div>
          </div>
          <p class="best-note"><span>↗</span> {{ best === null ? 'Your first win sets the bar.' : 'Can you beat your best?' }}</p>
        </div>

        <div class="how-card">
          <div class="card-heading"><span class="how-icon">?</span><h2>How to play</h2></div>
          <p>Put every number back in its place, from <b>01</b> to <b>15</b>. One empty space, one tile at a time.</p>
          <div class="how-step"><span class="step-number">01</span><span>Tap a tile beside the empty space.</span></div>
          <div class="how-step"><span class="step-number">02</span><span>Or use your keyboard arrow keys.</span></div>
          <div class="how-step"><span class="step-number">03</span><span>Get the fewest moves you can.</span></div>
          <div class="arrow-demo" aria-hidden="true"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd><span>or tap to move</span></div>
        </div>

        <div class="note-card"><span class="note-icon">✦</span><p><b>Little tip</b><br />Build one row at a time. The rest tends to fall into place.</p></div>
      </aside>
    </main>

    <footer class="page-footer">
      <span>MADE FOR CURIOUS MINDS <span class="footer-heart">♥</span></span>
      <span>TAKE YOUR TIME. OR DON’T.</span>
    </footer>
  </div>
</template>
