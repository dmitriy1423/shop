import { getCurrentUser } from '@/actions/getCurrentUser'
import CartClient from './CartClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Корзина товаров',
	description: 'Магазин товаров цифровой техники'
}

const Cart = async () => {
	const user = await getCurrentUser()

	if (!user) return null

	return (
		<>
			<CartClient user={user} />
		</>
	)
}

export default Cart
