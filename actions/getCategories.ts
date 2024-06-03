import prisma from '@/libs/prisma'

export async function getCategories() {
	return await prisma.category.findMany({
		include: {
			products: {
				include: {
					reviews: true
				}
			}
		}
	})
}
