import { getCurrentUser } from '@/actions/getCurrentUser'
import FavoritesClient from './FavoritesClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Избранные товары',
	description: 'Магазин товаров цифровой техники'
}

const Favorites = async () => {
	const user = await getCurrentUser()

	return (
		<>
			<FavoritesClient user={user} />
		</>
	)
}

export default Favorites
