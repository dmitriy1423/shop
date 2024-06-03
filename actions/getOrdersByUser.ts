import prisma from '@/libs/prisma'

export async function getOrdersByUser(userId: string) {
	const orders = await prisma.order.findMany({
		where: { userId },
		include: {
			items: {
				include: {
					product: true
				}
			},
			user: true
		},
		take: 2,
		orderBy: {
			createdAt: 'desc'
		}
	})

	return orders
}
