import { API_BASE_URL, ENDPOINTS } from '../config/api'

export const gameService = {
  async getGames() {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GAMES}`)
    return response.json()
  },

  async getGame(id) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GAME_BY_ID(id)}`)
    return response.json()
  }
}
