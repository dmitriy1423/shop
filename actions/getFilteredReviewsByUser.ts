import prisma from '@/libs/prisma'

export async function getFilteredReviewsByUser(
	currentPage: number,
	userId: string,
	search: { [key: string]: string }
) {
	const perPage = 2
	const offset = (currentPage - 1) * perPage

	const { page, sort, rating, ...filteredSearch } = search

	try {
		let where: {
			userId: string
			rating?: { in: number[] }
			AND?: any[]
		} = { userId }

		// Извлекаем id категорий из параметров поиска
		const ratings = rating ? rating.split(',') : []

		if (ratings.length > 0) {
			where.rating = { in: ratings.map(rating => parseInt(rating)) }
		}

		// Фильтруем только по тем параметрам, которые не равны 'all'
		const filterConditions = Object.entries(filteredSearch)
			.filter(([key, value]) => value !== 'all')
			.map(([key, value]) => ({
				properties: {
					path: [key],
					equals: value
				}
			}))

		if (filterConditions.length > 0) {
			where.AND = filterConditions
		}

		// Сортировка
		let orderBy: any = {
			createdAt: 'desc'
		}

		if (sort === 'new') {
			orderBy = {
				createdAt: 'desc'
			}
		} else if (sort === 'old') {
			orderBy = {
				createdAt: 'asc'
			}
		}

		// Запрос продуктов с фильтрами и сортировкой
		const reviews = await prisma.review.findMany({
			where,
			skip: offset,
			take: perPage,
			orderBy,
			include: {
				user: true,
				product: true
			}
		})

		// Подсчет общего количества продуктов для пагинации
		const totalReviews = await prisma.review.count({
			where
		})

		return {
			reviews,
			totalReviews,
			totalPages: Math.ceil(totalReviews / perPage)
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
