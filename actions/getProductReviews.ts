import prisma from '@/libs/prisma'

export async function getProductReviews(productId: string) {
	const reviews = await prisma.review.findMany({
		where: { productId },
		include: {
			user: true,
			product: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 4
	})

	return reviews
}
