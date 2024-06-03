import prisma from '@/libs/prisma'

export async function getOrder(orderId: string) {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			items: {
				include: {
					product: true
				}
			},
			user: true
		}
	})

	return order
}
