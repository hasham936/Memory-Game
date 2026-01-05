<script setup>
import { ref } from 'vue'

const props = defineProps({
  difficulty: String,
  time: Number,
  attempts: Number
})

const emit = defineEmits(['save-score', 'cancel'])

const playerName = ref('')

const saveScore = () => {
  if (playerName.value.trim()) {
    emit('save-score', playerName.value.trim())
  }
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    saveScore()
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="overlay">
    <div class="score-input-card glass-card">
      <div class="header">
        <span class="trophy">🏆</span>
        <h2>Félicitations !</h2>
        <p>Vous avez relevé le défi</p>
      </div>
      
      <div class="score-details">
        <div class="detail-item">
          <span class="label">Difficulté</span>
          <span class="value">{{ difficulty }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Temps</span>
          <span class="value">{{ formatTime(time) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Essais</span>
          <span class="value">{{ attempts }}</span>
        </div>
      </div>

      <div class="input-section">
        <label for="playerName">Votre nom de champion</label>
        <input
          id="playerName"
          v-model="playerName"
          type="text"
          placeholder="Entrez votre nom..."
          @keypress="handleKeyPress"
          autofocus
        />
      </div>

      <div class="button-group">
        <button class="btn btn-save" @click="saveScore" :disabled="!playerName.trim()">
          Enregistrer le score
        </button>
        <button class="btn btn-cancel" @click="$emit('cancel')">
          Passer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.score-input-card {
  padding: 40px;
  max-width: 450px;
  width: 100%;
  border: 1px solid var(--glass-border);
}

.header {
  text-align: center;
  margin-bottom: 35px;
}

.trophy {
  font-size: 4rem;
  display: block;
  margin-bottom: 10px;
}

.header h2 {
  font-size: 2rem;
  font-weight: 800;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.score-details {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: var(--border-radius-md);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.value {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
}

.input-section {
  margin-bottom: 30px;
}

.input-section label {
  display: block;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.input-section input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  color: var(--text-primary);
  transition: var(--transition);
}

.input-section input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 16px;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 700;
}

.btn-save {
  background: var(--accent-gradient);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: var(--text-secondary);
}

.btn-cancel:hover {
  color: var(--text-primary);
}
</style>