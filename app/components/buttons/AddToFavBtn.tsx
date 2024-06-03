'use client'

import { Product } from '@prisma/client'
import { FC } from 'react'
import Button from './Button'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavoritesStore } from '@/store/favoritesStore'
import { SafeUser } from '@/types'
import toast from 'react-hot-toast'

interface AddToFavBtnProps {
	product: Product
	size: 'small' | 'default'
	user: SafeUser | null
}

const AddToFavBtn: FC<AddToFavBtnProps> = ({ product, size, user }) => {
	const { favorites, addToFavorites, removeFromFavorites, isLoading } =
		useFavoritesStore()
	const isProductFavorite = favorites.some(
		item => item.productId === product.id
	)

	const handleClick = () => {
		if (!user) {
			toast.error('Войдите или зарегистрируйтесь')
			return
		}
		if (!isProductFavorite) {
			addToFavorites(product.id)
			toast.success('Товар добавлен в избранное')
		} else {
			removeFromFavorites(product.id)
			toast.success('Товар убран из избранных')
		}
	}

	if (size === 'small') {
		return isProductFavorite ? (
			<Button
				icon={FaHeart}
				onClick={handleClick}
				outline
				ariaLabel="Убрать из избранных"
				disabled={isLoading}
			/>
		) : (
			<Button
				icon={FaRegHeart}
				onClick={handleClick}
				ariaLabel="Добавить в избранное"
				disabled={isLoading}
			/>
		)
	}

	return isProductFavorite ? (
		<Button
			icon={FaHeart}
			onClick={handleClick}
			label="Убрать из избранных"
			outline
			ariaLabel="Убрать из избранных"
			disabled={isLoading}
		/>
	) : (
		<Button
			icon={FaRegHeart}
			onClick={handleClick}
			label="Добавить в избранное"
			ariaLabel="Добавить в избранное"
			disabled={isLoading}
		/>
	)
}

export default AddToFavBtn
