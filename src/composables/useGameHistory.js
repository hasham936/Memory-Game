import { ref, computed } from 'vue'

export function useGameHistory() {
  const games = ref([])
  const sortBy = ref('date')
  const sortOrder = ref('desc')

  const loadGames = async () => {
    try {
      const result = await window.storage.get('memory-games')
      if (result && result.value) {
        games.value = JSON.parse(result.value)
      }
    } catch (error) {
      console.log('Aucune partie sauvegardée')
      games.value = []
    }
  }

  const saveGame = async (playerName, difficulty, time, attempts) => {
    const game = {
      id: Date.now(),
      playerName,
      difficulty,
      time,
      attempts,
      date: new Date().toLocaleString('fr-FR')
    }
    games.value.unshift(game)
    
    try {
      await window.storage.set('memory-games', JSON.stringify(games.value))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const deleteGame = async (gameId) => {
    games.value = games.value.filter(g => g.id !== gameId)
    
    try {
      await window.storage.set('memory-games', JSON.stringify(games.value))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const resetAllGames = async () => {
    games.value = []
    
    try {
      await window.storage.delete('memory-games')
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
    }
  }

  const updateGameName = async (gameId, newName) => {
    const game = games.value.find(g => g.id === gameId)
    if (game) {
      game.playerName = newName
      
      try {
        await window.storage.set('memory-games', JSON.stringify(games.value))
      } catch (error) {
        console.error('Erreur lors de la modification:', error)
      }
    }
  }

  const sortedGames = computed(() => {
    const sorted = [...games.value]
    
    if (sortBy.value === 'name') {
      sorted.sort((a, b) => a.playerName.localeCompare(b.playerName))
    } else if (sortBy.value === 'difficulty') {
      sorted.sort((a, b) => {
        const sizeOrder = { '4x4': 1, '5x5': 2, '6x6': 3 }
        return sizeOrder[a.difficulty] - sizeOrder[b.difficulty]
      })
    } else if (sortBy.value === 'time') {
      sorted.sort((a, b) => a.time - b.time)
    } else if (sortBy.value === 'attempts') {
      sorted.sort((a, b) => a.attempts - b.attempts)
    } else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    if (sortOrder.value === 'asc') {
      sorted.reverse()
    }

    return sorted
  })

  return {
    games,
    sortBy,
    sortOrder,
    sortedGames,
    loadGames,
    saveGame,
    deleteGame,
    resetAllGames,
    updateGameName
  }
}