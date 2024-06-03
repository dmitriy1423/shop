'use client'

import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { SafeUser } from '@/types'
import { FC, useEffect } from 'react'

interface Props {
	user: SafeUser | null
}

const LoadCartAndFav: FC<Props> = ({ user }) => {
	const { getCartItems } = useCartStore()
	const { getFavorites } = useFavoritesStore()
	useEffect(() => {
		if (user) {
			getCartItems()
			getFavorites()
		}
	}, [getCartItems, getFavorites, user])

	if (!user) return null

	return <></>
}

export default LoadCartAndFav
