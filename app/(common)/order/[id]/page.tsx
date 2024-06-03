import { getCurrentUser } from '@/actions/getCurrentUser'
import OrderClient from './OrderClient'
import { getOrder } from '@/actions/getOrder'
import { Metadata } from 'next'
import { ExtendedOrder } from '@/types'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const id = params.id
	const order = await getOrder(id)

	return {
		title: `ElectroShop | заказ ${order?.id.slice(0, 8)}`,
		description: 'Магазин товаров цифровой техники'
	}
}

interface IParams {
	id: string
}

const OrderPage = async ({ params }: { params: IParams }) => {
	const user = await getCurrentUser()
	if (!user) return null

	const order = await getOrder(params.id)

	return (
		<>
			<OrderClient order={order as ExtendedOrder} />
		</>
	)
}

export default OrderPage
