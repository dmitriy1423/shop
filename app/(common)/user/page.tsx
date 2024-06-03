import { getCurrentUser } from '@/actions/getCurrentUser'
import UserClient from './UserClient'
import { getOrdersByUser } from '@/actions/getOrdersByUser'
import { getReviewsByUser } from '@/actions/getReviewsByUser'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const id = params.id
	const user = await getCurrentUser()

	return {
		title: `ElectroShop | Кабинет пользователя ${user?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

const UserPage = async () => {
	const user = await getCurrentUser()
	if (!user) return null

	const orders = await getOrdersByUser(user.id)
	const reviews = (await getReviewsByUser(user.id)).slice(0, 2)

	return (
		<>
			<UserClient user={user} orders={orders} reviews={reviews} />
		</>
	)
}

export default UserPage
