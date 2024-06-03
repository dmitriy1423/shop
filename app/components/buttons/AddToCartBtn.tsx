'use client'

import { Product } from '@prisma/client'
import { FC } from 'react'
import Button from './Button'
import { FaCartArrowDown, FaCartPlus } from 'react-icons/fa'
import { useCartStore } from '@/store/cartStore'
import { SafeUser } from '@/types'
import toast from 'react-hot-toast'

interface AddToCartBtnProps {
	product: Product
	size: 'small' | 'default'
	user: SafeUser | null
}

const AddToCartBtn: FC<AddToCartBtnProps> = ({ product, size, user }) => {
	const { addToCart, removeFromCart, cartItems, isLoading } = useCartStore()
	const isProductInCart = cartItems.some(item => item.productId === product.id)

	const handleClick = () => {
		if (!user) {
			toast.error('Войдите или зарегистрируйтесь')
			return
		}

		if (!isProductInCart) {
			addToCart(product.id, 1)
			toast.success('Товар добавлен в корзину')
		} else {
			removeFromCart(product.id)
			toast.success('Товар убран из корзины')
		}
	}

	if (size === 'small') {
		return isProductInCart ? (
			<Button
				icon={FaCartArrowDown}
				onClick={handleClick}
				outline
				ariaLabel="Убрать из корзины"
				disabled={isLoading}
			/>
		) : (
			<Button
				icon={FaCartPlus}
				onClick={handleClick}
				ariaLabel="Добавить в корзину"
				disabled={isLoading}
			/>
		)
	}

	return isProductInCart ? (
		<Button
			icon={FaCartArrowDown}
			onClick={handleClick}
			label="Убрать из корзины"
			outline
			ariaLabel="Убрать из корзины"
			disabled={isLoading}
		/>
	) : (
		<Button
			icon={FaCartPlus}
			onClick={handleClick}
			label="Добавить в корзину"
			ariaLabel="Добавить в корзину"
			disabled={isLoading}
		/>
	)
}

export default AddToCartBtn
