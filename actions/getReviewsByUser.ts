import prisma from '@/libs/prisma'

export async function getReviewsByUser(userId: string) {
	const reviews = await prisma.review.findMany({
		where: { userId },
		include: {
			product: true,
			user: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	return reviews
}
