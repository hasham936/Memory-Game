import { ref } from 'vue'

export function useGame(gridSize = 4) {
  const cards = ref([])
  const flipped = ref(new Set())
  const matched = ref(new Set())
  const attempts = ref(0)
  const startTime = ref(null)
  const elapsedTime = ref(0)
  const gameOver = ref(false)
  const showingAll = ref(true)
  let timerInterval = null
  
  let winCallback = null

  const initGame = () => {
    const totalCards = gridSize * gridSize
    const cardArray = []
    
    if (totalCards % 2 === 1) {
      const pairs = Math.floor(totalCards / 2)
      for (let i = 0; i < pairs; i++) {
        cardArray.push(i)
        cardArray.push(i)
      }
      cardArray.push(pairs)
    } else {
      const pairs = totalCards / 2
      for (let i = 0; i < pairs; i++) {
        cardArray.push(i)
        cardArray.push(i)
      }
    }
    
    cards.value = cardArray.sort(() => Math.random() - 0.5).map((value, index) => ({
      id: index,
      value
    }))
    
    flipped.value = new Set()
    matched.value = new Set()
    attempts.value = 0
    gameOver.value = false
    showingAll.value = true
    startTime.value = null
    elapsedTime.value = 0
    
    setTimeout(() => {
      showingAll.value = false
      startTime.value = Date.now()
      
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = setInterval(() => {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
      }, 100)
    }, 3000)
  }

  const checkWin = () => {
    console.log('CheckWin - matched:', matched.value.size, 'total:', cards.value.length)
    if (matched.value.size === cards.value.length) {
      console.log('🎉 TOUTES LES CARTES MATCHÉES!')
      gameOver.value = true
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      
      console.log('winCallback existe?', !!winCallback)
      if (winCallback) {
        console.log('Appel du winCallback')
        winCallback()
      } else {
        console.error('❌ Pas de winCallback défini!')
      }
      return true
    }
    return false
  }
  
  const setOnWin = (callback) => {
    console.log('setOnWin appelé avec callback:', !!callback)
    winCallback = callback
  }

  const flipCard = (cardId) => {
    if (showingAll.value) return
    
    if (flipped.value.has(cardId) || matched.value.has(cardId) || gameOver.value) {
      return
    }

    flipped.value.add(cardId)

    const totalCards = gridSize * gridSize
    if (totalCards % 2 === 1 && flipped.value.size === 1) {
      const soloValue = Math.floor(totalCards / 2)
      if (cards.value[cardId].value === soloValue) {
        attempts.value++
        matched.value.add(cardId)
        flipped.value.clear()
        
        checkWin()
        return
      }
    }

    if (flipped.value.size === 2) {
      const [first, second] = Array.from(flipped.value)
      attempts.value++

      if (cards.value[first].value === cards.value[second].value) {
        matched.value.add(first)
        matched.value.add(second)
        flipped.value.clear()

        checkWin()
      } else {
        setTimeout(() => {
          flipped.value.clear()
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    if (timerInterval) clearInterval(timerInterval)
    initGame()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isCardFlipped = (cardId) => {
    return showingAll.value || flipped.value.has(cardId) || matched.value.has(cardId)
  }
  
  const isCardMatched = (cardId) => {
    return matched.value.has(cardId)
  }

  return {
    cards,
    flipped,
    matched,
    attempts,
    elapsedTime,
    gameOver,
    showingAll,
    setOnWin,
    initGame,
    flipCard,
    resetGame,
    formatTime,
    isCardFlipped,
    isCardMatched
  }
}