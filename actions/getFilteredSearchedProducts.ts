import prisma from '@/libs/prisma'

export async function getFilteredSearchedProducts(
	currentPage: number,
	search: { [key: string]: string }
) {
	const perPage = 4
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
			orderBy: {
				createdAt: 'desc'
			}
		})

		const totalProducts = products.length
		const paginatedProducts = products.slice(offset, offset + perPage)

		return {
			products: paginatedProducts,
			totalProducts,
			totalPages: Math.ceil(totalProducts / perPage)
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
