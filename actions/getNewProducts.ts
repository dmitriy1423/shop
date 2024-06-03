import prisma from '@/libs/prisma'

export async function getNewProducts() {
	return await prisma.product.findMany({
		take: 4,
		include: {
			category: true,
			reviews: {
				include: {
					product: true,
					user: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
}
