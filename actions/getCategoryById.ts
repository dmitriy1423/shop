import prisma from '@/libs/prisma'

export async function getCategoryById(id: string) {
	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			products: true,
			properties: true
		}
	})

	return category
}
