import prisma from '@/libs/prisma'

export async function getProductById(id: string) {
	const product = await prisma.product.findUnique({
		where: { id },
		include: {
			category: true,
			reviews: {
				include: {
					user: true,
					product: true
				}
			}
		}
	})

	return product
}
