import prisma from '@/libs/prisma'

export async function getProducts(ids?: string[] | null) {
	if (ids) {
		return await prisma.product.findMany({
			where: {
				id: {
					in: ids
				}
			}
		})
	}

	return await prisma.product.findMany({})
}
