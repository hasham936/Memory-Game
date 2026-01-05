<script setup>
defineProps({
  card: Object,
  isFlipped: Boolean,
  isMatched: Boolean
})

defineEmits(['flip'])

const emojis = ['🐕', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🦜', '🦆', '🐢', '🦕', '🐙', '🦄', '🦋', '🐉', '🦗']
</script>

<template>
  <div
    class="card-scene"
    @click="$emit('flip')"
  >
    <div 
      class="card-inner" 
      :class="{ 'is-flipped': isFlipped, 'is-matched': isMatched }"
    >
      <div class="card-face card-front">
        <div class="pattern"></div>
        <span class="question-mark">?</span>
      </div>
      <div class="card-face card-back">
        <span class="emoji">{{ emojis[card.value] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-scene {
  width: 100%;
  height: 100%;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-inner.is-matched {
  transform: rotateY(180deg) scale(0.95);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  border: 2px solid var(--glass-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-front {
  background: var(--accent-gradient);
  overflow: hidden;
}

.pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
  background-size: 12px 12px;
}

.question-mark {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card-back {
  background: white;
  transform: rotateY(180deg);
}

.emoji {
  font-size: 2.5rem;
}

.is-matched .card-back {
  background: var(--success);
  border-color: transparent;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

@media (max-width: 600px) {
  .question-mark, .emoji {
    font-size: 1.5rem;
  }
}
</style>