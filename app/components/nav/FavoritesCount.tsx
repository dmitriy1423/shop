'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AiOutlineHeart } from 'react-icons/ai'

const FavoritesCount = () => {
	const favoritesStore = useFavoritesStore()

	const totalQty = favoritesStore.getTotalFavorites()

	return (
		<Link
			href={'/favorites'}
			className="relative cursor-pointer"
			aria-label="Избранное"
		>
			<div className="text-2xl">
				<AiOutlineHeart />
			</div>
			{totalQty > 0 ? (
				<span className="absolute top-[-10px] right-[-10px] bg-blue-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm">
					{totalQty}
				</span>
			) : null}
		</Link>
	)
}

export default FavoritesCount
