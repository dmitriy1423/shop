import { getCurrentUser } from '@/actions/getCurrentUser'
import CreateOrderClient from './CreateOrderClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Оформление заказа',
	description: 'Магазин товаров цифровой техники'
}

const CreateOrder = async ({ searchParams }: any) => {
	const user = await getCurrentUser()

	if (!user) return null

	return (
		<>
			<CreateOrderClient orderId={searchParams.orderId} user={user} />
		</>
	)
}

export default CreateOrder
