import prisma from '@/libs/prisma'

interface IParams {
	id?: string
}

export async function getCategoryByParams(params: IParams) {
	const { id } = params

	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			products: true,
			properties: true
		}
	})

	return category
}
