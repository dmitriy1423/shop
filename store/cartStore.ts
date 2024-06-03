import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { ExtendedCart, SafeUser } from '@/types'
import { CartItem } from '@prisma/client'
import axios from 'axios'
import { StateCreator, create } from 'zustand'
import { PersistOptions, devtools, persist } from 'zustand/middleware'

type CartState = {
	cartItems: ExtendedCart[]
	isLoading: boolean
	getCartItems: () => void
	addToCart: (productId: string, quantity: number) => void
	removeFromCart: (productId: string) => void
	increaseQuantity: (productId: string) => void
	decreaseQuantity: (productId: string) => void
	clearCart: () => void
	getTotalQuantity: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
	cartItems: [],
	isLoading: false,

	getCartItems: async () => {
		set({ isLoading: true })
		try {
			const response = await axios.get('/api/cart')
			const items: ExtendedCart[] = response.data
			set({ cartItems: items })
		} catch (error) {
			console.error('Error fetching cart items:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	addToCart: async (productId: string, quantity: number) => {
		set({ isLoading: true })
		try {
			await axios.post('/api/cart/add', { productId, quantity })
			await get().getCartItems() // Обновляем корзину после добавления товара
		} catch (error) {
			console.error('Error adding item to cart:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	removeFromCart: async (productId: string) => {
		set({ isLoading: true })
		try {
			await axios.post(`/api/cart/remove`, { productId })
			await get().getCartItems() // Обновляем корзину после удаления товара
		} catch (error) {
			console.error('Error removing item from cart:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	increaseQuantity: async (productId: string) => {
		set({ isLoading: true })
		try {
			await axios.put(`/api/cart/increase-qty`, { productId })
			await get().getCartItems() // Обновляем корзину после увеличения количества товара
		} catch (error) {
			console.error('Error increasing item quantity:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	decreaseQuantity: async (productId: string) => {
		set({ isLoading: true })
		try {
			await axios.put(`/api/cart/decrease-qty`, { productId })
			await get().getCartItems() // Обновляем корзину после уменьшения количества товара
		} catch (error) {
			console.error('Error decreasing item quantity:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	clearCart: async () => {
		set({ isLoading: true })
		try {
			await axios.delete('/api/cart/clear')
			set({ cartItems: [] }) // Очищаем корзину в локальном состоянии
		} catch (error) {
			console.error('Error clearing cart:', error)
		} finally {
			set({ isLoading: false })
		}
	},

	getTotalQuantity: () => {
		return get().cartItems.reduce((total, item) => total + item.quantity, 0)
	}
}))
