<script setup>
import { computed } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  cards: Array,
  attempts: Number,
  elapsedTime: Number,
  gameOver: Boolean,
  showingAll: Boolean,
  isCardFlipped: Function,
  isCardMatched: Function
})

const emit = defineEmits(['flip-card', 'back-to-menu'])

const gridSize = computed(() => {
  const size = Math.sqrt(props.cards.length)
  console.log('Grid size calculated:', size, 'Cards length:', props.cards.length)
  return Math.floor(size)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleFlip = (cardId) => {
  emit('flip-card', cardId)
}
</script>

<template>
  <div class="game-container">
    <div class="game-content">
      <header class="game-header">
        <button class="back-btn" @click="$emit('back-to-menu')">
          Quitter
        </button>
        
        <div class="stats-container apple-card">
          <div class="stat-item">
            <span class="stat-label">Temps</span>
            <span class="stat-value">{{ formatTime(elapsedTime) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Essais</span>
            <span class="stat-value">{{ attempts }}</span>
          </div>
        </div>
      </header>

      <div class="memorize-status">
        <Transition name="fade">
          <p v-if="showingAll" class="memorize-text">Mémorisez les cartes</p>
        </Transition>
      </div>

      <main class="grid-container">
        <div 
          class="game-grid"
          :class="'grid-' + gridSize"
        >
          <Card 
            v-for="card in cards"
            :key="card.id"
            :card="card"
            :is-flipped="isCardFlipped(card.id)"
            :is-matched="isCardMatched(card.id)"
            @flip="handleFlip(card.id)"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 24px;
  background-color: var(--bg-primary);
}

.game-content {
  max-width: 800px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
}

.back-btn {
  background: transparent;
  color: var(--accent);
  font-size: 17px;
  font-weight: 500;
}

.back-btn:hover {
  text-decoration: underline;
}

.stats-container {
  display: flex;
  padding: 8px 24px;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.stat-value {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.memorize-status {
  height: 24px;
  margin-bottom: 32px;
  text-align: center;
}

.memorize-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
}

.grid-container {
  display: flex;
  justify-content: center;
}

.game-grid {
  display: grid;
  gap: 12px;
}

.grid-4 {
  grid-template-columns: repeat(4, 80px);
  grid-template-rows: repeat(4, 80px);
}

.grid-5 {
  grid-template-columns: repeat(5, 70px);
  grid-template-rows: repeat(5, 70px);
}

.grid-6 {
  grid-template-columns: repeat(6, 60px);
  grid-template-rows: repeat(6, 60px);
}

@media (max-width: 500px) {
  .grid-4 { grid-template-columns: repeat(4, 65px); grid-template-rows: repeat(4, 65px); }
  .grid-5 { grid-template-columns: repeat(5, 55px); grid-template-rows: repeat(5, 55px); }
  .grid-6 { grid-template-columns: repeat(6, 45px); grid-template-rows: repeat(6, 45px); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>