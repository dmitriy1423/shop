import prisma from '@/libs/prisma'

export async function getAllOrders() {
	const orders = await prisma.order.findMany({
		include: {
			items: {
				include: {
					product: true
				}
			},
			user: true
		}
	})

	return orders
}
