import prisma from '@/libs/prisma'

export async function getFilteredSearchedProducts(
	currentPage: number,
	/* query: string, */
	search: { [key: string]: string }
) {
	const perPage = 2
	const offset = (currentPage - 1) * perPage

	try {
		const { page, query } = search

		let where: {
			name?: { contains: string; mode: 'insensitive' }
		} = {}

		if (query) {
			where.name = { contains: query, mode: 'insensitive' }
		}

		// Запрос продуктов с фильтрами и сортировкой
		const products = await prisma.product.findMany({
			where,
			skip: offset,
			take: perPage,
			orderBy: {
				createdAt: 'desc'
			}
		})

		// Подсчет общего количества продуктов для пагинации
		const totalProducts = await prisma.product.count({
			where
		})

		return {
			products,
			totalProducts,
			totalPages: Math.ceil(totalProducts / perPage)
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
