<script setup>
import { ref } from 'vue'

const props = defineProps({
  games: Array,
  sortBy: String,
  sortOrder: String,
  sortedGames: Array
})

const emit = defineEmits(['delete-game', 'reset-all', 'back', 'update-sort', 'edit-name'])

const editingId = ref(null)
const editingName = ref('')

const startEditing = (game) => {
  editingId.value = game.id
  editingName.value = game.playerName
}

const saveName = (gameId) => {
  if (editingName.value.trim()) {
    emit('edit-name', gameId, editingName.value.trim())
    editingId.value = null
  }
}

const cancelEditing = () => {
  editingId.value = null
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    saveName(editingId.value)
  } else if (e.key === 'Escape') {
    cancelEditing()
  }
}

const confirmReset = () => {
  if (confirm('Êtes-vous sûr? Cela supprimera toutes les parties.')) {
    emit('reset-all')
  }
}

const getDifficultyEmoji = (difficulty) => {
  if (difficulty === '4x4') return '😊'
  if (difficulty === '5x5') return '😐'
  return '😰'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="history-container">
    <div class="history-content">
      <header class="history-header">
        <button class="btn-back" @click="$emit('back')">
          <span class="icon">←</span> Menu
        </button>
        <h1>Tableau des <span class="accent">Scores</span></h1>
        <div class="header-spacer"></div>
      </header>

      <div v-if="games.length === 0" class="empty-state glass-card">
        <span class="empty-icon">🎮</span>
        <p>Aucune partie enregistrée</p>
        <button class="btn btn-primary" @click="$emit('back')">Jouer maintenant</button>
      </div>

      <template v-else>
        <div class="controls glass-card">
          <div class="sort-controls">
            <label>Trier par</label>
            <div class="select-wrapper">
              <select
                :value="sortBy"
                @change="$emit('update-sort', $event.target.value)"
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
                <option value="difficulty">Difficulté</option>
                <option value="time">Temps</option>
              </select>
            </div>
            <button
              class="btn-sort-order"
              @click="$emit('update-sort', null, sortOrder === 'desc' ? 'asc' : 'desc')"
            >
              {{ sortOrder === 'desc' ? '↓' : '↑' }}
            </button>
          </div>
          <button class="btn btn-danger" @click="confirmReset">
            Effacer tout
          </button>
        </div>

        <div class="games-list">
          <TransitionGroup name="list">
            <div
              v-for="game in sortedGames"
              :key="game.id"
              class="game-card glass-card"
            >
              <div class="game-card-content">
                <div class="player-info">
                  <span class="difficulty-emoji">{{ getDifficultyEmoji(game.difficulty) }}</span>
                  <div class="name-container">
                    <span v-if="editingId !== game.id" class="name-display">
                      {{ game.playerName }}
                    </span>
                    <input
                      v-else
                      v-model="editingName"
                      type="text"
                      class="name-input"
                      @keypress="handleKeyPress"
                      autofocus
                    />
                  </div>
                </div>

                <div class="game-stats">
                  <div class="stat">
                    <span class="stat-label">Niveau</span>
                    <span class="stat-value">{{ game.difficulty }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Temps</span>
                    <span class="stat-value">{{ formatTime(game.time) }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Date</span>
                    <span class="stat-value date">{{ game.date }}</span>
                  </div>
                </div>

                <div class="game-actions">
                  <template v-if="editingId !== game.id">
                    <button class="btn-action" @click="startEditing(game)" title="Modifier">✏️</button>
                    <button class="btn-action delete" @click="$emit('delete-game', game.id)" title="Supprimer">🗑️</button>
                  </template>
                  <template v-else>
                    <button class="btn-action save" @click="saveName(game.id)">✓</button>
                    <button class="btn-action cancel" @click="cancelEditing">✕</button>
                  </template>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: var(--primary-gradient);
}

.history-content {
  max-width: 900px;
  margin: 0 auto;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}

.history-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.accent {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-back {
  background: var(--glass-bg);
  color: var(--text-primary);
  padding: 10px 20px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--glass-border);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-spacer { width: 100px; }

.empty-state {
  text-align: center;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-icon { font-size: 4rem; }

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-controls label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 8px;
  font-family: inherit;
  cursor: pointer;
}

.btn-sort-order {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn {
  padding: 12px 24px;
  border-radius: var(--border-radius-md);
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-primary { background: var(--accent-gradient); color: white; }
.btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }
.btn-danger:hover { background: var(--danger); color: white; }

.games-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.game-card {
  padding: 20px 30px;
  transition: transform 0.3s ease;
}

.game-card:hover {
  transform: translateX(10px);
  border-color: rgba(99, 102, 241, 0.3);
}

.game-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  min-width: 200px;
}

.difficulty-emoji { font-size: 1.5rem; }

.name-display {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.name-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #6366f1;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 1.1rem;
  width: 150px;
}

.game-stats {
  display: flex;
  gap: 40px;
  flex: 2;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.date { font-size: 0.85rem; color: var(--text-secondary); }

.game-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.btn-action:hover { background: rgba(255, 255, 255, 0.1); }
.btn-action.delete:hover { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
.btn-action.save { color: var(--success); }
.btn-action.cancel { color: var(--danger); }

/* List Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from { opacity: 0; transform: translateX(-30px); }
.list-leave-to { opacity: 0; transform: translateX(30px); }

@media (max-width: 768px) {
  .game-card-content { gap: 15px; }
  .game-stats { gap: 20px; flex-direction: column; }
  .history-header h1 { font-size: 1.8rem; }
  .header-spacer { display: none; }
}
</style>