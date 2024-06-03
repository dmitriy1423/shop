import { getCurrentUser } from '@/actions/getCurrentUser'
import { getFilteredOrders } from '@/actions/getFilteredOrders'
import OrdersClient from './OrdersClient'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const user = await getCurrentUser()

	return {
		title: `ElectroShop | Заказы пользователя ${user?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

const Orders = async ({ searchParams }: any) => {
	const user = await getCurrentUser()
	if (!user) return null

	const currentPage = Number(searchParams?.page) || 1

	const { orders, totalPages } = await getFilteredOrders(
		currentPage,
		user.id,
		searchParams
	)

	return (
		<>
			<OrdersClient orders={orders} user={user} totalPages={totalPages} />
		</>
	)
}

export default Orders
