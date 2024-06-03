import { ExtendedFavorites, ExtendedProduct } from '@/types'
import { FavoriteItem } from '@prisma/client'
import axios from 'axios'
import { create } from 'zustand'

type FavoritesState = {
	/* favoriteItems: ExtendedFavorites[] */
	favorites: ExtendedFavorites[]
	isLoading: boolean
	getFavorites: () => void
	addToFavorites: (productId: string) => void
	removeFromFavorites: (productId: string) => void
	clearFavorites: () => void
	getTotalFavorites: () => number
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
	/* favoriteItems: [], */
	favorites: [],
	isLoading: false,

	getFavorites: async () => {
		set({ isLoading: true })
		try {
			const response = await axios.get('/api/favorites')
			const favorites: ExtendedFavorites[] = response.data
			set({ favorites })
		} catch (error) {
			console.error('Error fetching favorites:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	addToFavorites: async (productId: string) => {
		set({ isLoading: true })
		try {
			await axios.post('/api/favorites/add', { productId })
			await get().getFavorites() // Обновляем список избранных после добавления товара
		} catch (error) {
			console.error('Error adding item to favorites:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	removeFromFavorites: async (productId: string) => {
		set({ isLoading: true })
		try {
			await axios.post('/api/favorites/remove', { productId })
			await get().getFavorites() // Обновляем список избранных после удаления товара
		} catch (error) {
			console.error('Error removing item from favorites:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	clearFavorites: async () => {
		set({ isLoading: true })
		try {
			await axios.delete('/api/favorites/clear')
			set({ favorites: [] }) // Очищаем список избранных в локальном состоянии
		} catch (error) {
			console.error('Error clearing favorites:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	getTotalFavorites: () => {
		return get().favorites.length
	}
}))
