<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start-game', 'show-history'])

const difficulties = [
  { name: '4x4 (Facile)', size: 4 },
  { name: '5x5 (Moyen)', size: 5 },
  { name: '6x6 (Difficile)', size: 6 }
]

const selectedDifficulty = ref(4)

const startGame = () => {
  emit('start-game', selectedDifficulty.value)
}

const showHistory = () => {
  emit('show-history')
}
</script>

<template>
  <div class="menu">
    <div class="menu-box apple-card">
      <h1 class="title">Memory</h1>
      
      <div class="difficulty-section">
        <h2>Difficulté</h2>
        <div class="difficulty-buttons">
          <button
            v-for="difficulty in difficulties"
            :key="difficulty.size"
            class="difficulty-btn"
            :class="{ active: selectedDifficulty === difficulty.size }"
            @click="selectedDifficulty = difficulty.size"
          >
            {{ difficulty.name.split(' ')[0] }}
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="start-btn" @click="startGame">
          Jouer
        </button>
        <button class="history-btn" @click="showHistory">
          Historique
        </button>
      </div>

      <div class="rules">
        <h3>Règles</h3>
        <ul>
          <li>Trouvez toutes les paires identiques.</li>
          <li>Retournez deux cartes à la fois.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--bg-primary);
}

.menu-box {
  padding: 48px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--text-primary);
  letter-spacing: -0.015em;
}

.difficulty-section h2 {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 32px;
  background: #f2f2f7;
  padding: 4px;
  border-radius: 10px;
}

.difficulty-btn {
  padding: 10px;
  background: transparent;
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.difficulty-btn:hover:not(.active) {
  background: rgba(0, 0, 0, 0.03);
}

.difficulty-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.start-btn {
  padding: 16px;
  background-color: var(--accent);
  color: white;
  border-radius: var(--border-radius-md);
  font-size: 17px;
  font-weight: 600;
}

.start-btn:hover {
  background-color: var(--accent-hover);
}

.history-btn {
  padding: 16px;
  background: transparent;
  color: var(--accent);
  font-size: 17px;
  font-weight: 500;
}

.history-btn:hover {
  text-decoration: underline;
}

.rules {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f2f2f7;
  text-align: left;
}

.rules h3 {
  font-size: 13px;
  margin-bottom: 8px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rules ul {
  list-style: none;
}

.rules li {
  margin: 6px 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
}

.rules li::before {
  content: '•';
  color: var(--text-secondary);
  margin-right: 8px;
}
</style>