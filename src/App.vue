<script setup>
import { ref, onMounted, watch } from 'vue'
import Menu from './components/Menu.vue'
import GameBoard from './components/GameBoard.vue'
import GameHistory from './components/GameHistory.vue'
import ScoreInput from './components/ScoreInput.vue'
import { useGame } from './composables/useGame.js'
import { useGameHistory } from './composables/useGameHistory.js'

const currentView = ref('menu')
const gameLogic = ref(null)
const gridSize = ref(4)

const { games, sortBy, sortOrder, sortedGames, loadGames, saveGame, deleteGame, resetAllGames, updateGameName } = useGameHistory()

onMounted(() => {
  loadGames()
})

const startGame = (difficulty) => {
  gridSize.value = difficulty
  const game = useGame(difficulty)
  
  game.setOnWin(() => {
    setTimeout(() => {
      currentView.value = 'score-input'
    }, 1500)
  })
  
  gameLogic.value = game
  gameLogic.value.initGame()
  currentView.value = 'game'
}

const handleFlipCard = (cardId) => {
  gameLogic.value.flipCard(cardId)
}

const handleSaveScore = (playerName) => {  
  const time = gameLogic.value.elapsedTime
  const attempts = gameLogic.value.attempts.value
  const difficulty = gridSize.value === 4 ? '4x4' : gridSize.value === 5 ? '5x5' : '6x6'

  saveGame(playerName, difficulty, time, attempts)
  currentView.value = 'menu'
}

const handleDeleteGame = (gameId) => {
  deleteGame(gameId)
}

const handleResetAll = () => {
  resetAllGames()
}

const handleUpdateSort = (newSortBy, newSortOrder) => {
  if (newSortBy) {
    sortBy.value = newSortBy
  }
  if (newSortOrder) {
    sortOrder.value = newSortOrder
  }
}

const handleEditName = (gameId, newName) => {
  updateGameName(gameId, newName)
}

const goToHistory = () => {
  currentView.value = 'history'
}

const goToMenu = () => {
  if (gameLogic.value) {
    gameLogic.value.resetGame()
  }
  currentView.value = 'menu'
}
</script>

<template>
  <div id="app">
    <Menu
      v-if="currentView === 'menu'"
      @start-game="startGame"
      @show-history="goToHistory"
    />

    <GameBoard
      v-if="currentView === 'game' && gameLogic"
      :cards="gameLogic.cards"
      :attempts="gameLogic.attempts"
      :elapsed-time="gameLogic.elapsedTime"
      :game-over="gameLogic.gameOver"
      :showing-all="gameLogic.showingAll"
      :is-card-flipped="gameLogic.isCardFlipped"
      :is-card-matched="gameLogic.isCardMatched"
      @flip-card="handleFlipCard"
      @back-to-menu="goToMenu"
    />

    <ScoreInput
      v-if="currentView === 'score-input' && gameLogic"
      :difficulty="gridSize === 4 ? '4x4' : gridSize === 5 ? '5x5' : '6x6'"
      :time="gameLogic.elapsedTime"
      :attempts="gameLogic.attempts"
      @save-score="handleSaveScore"
      @cancel="goToMenu"
    />

    <GameHistory
      v-if="currentView === 'history'"
      :games="games"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :sorted-games="sortedGames"
      @delete-game="handleDeleteGame"
      @reset-all="handleResetAll"
      @back="goToMenu"
      @update-sort="handleUpdateSort"
      @edit-name="handleEditName"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>