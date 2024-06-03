import prisma from '@/libs/prisma'

export async function getFilteredProducts(
	currentPage: number,
	search: { [key: string]: string }
) {
	const perPage = 2
	const offset = (currentPage - 1) * perPage

	const { page, sort, minPrice, maxPrice, categoryId, ...filteredSearch } =
		search

	try {
		let where: {
			categoryId?: { in: string[] }
			AND?: any[]
		} = {}

		// Извлекаем id категорий из параметров поиска
		const categoryIds = categoryId ? categoryId.split(',') : []

		if (categoryIds.length > 0) {
			where.categoryId = { in: categoryIds }
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

		// Запрос продуктов с фильтрами
		let products = await prisma.product.findMany({
			where,
			skip: offset,
			take: perPage,
			include: {
				reviews: true
			}
		})

		// Применяем скидку к цене для каждого продукта
		products = products.map(product => {
			const discountedPrice = Math.round(
				product.price * (1 - product.discountPercent / 100)
			)
			return {
				...product,
				discountedPrice
			}
		})

		// Фильтруем продукты по цене с учетом скидки
		if (minPrice || maxPrice) {
			products = products.filter(product => {
				if (minPrice && maxPrice) {
					return (
						product.discountedPrice >= parseFloat(minPrice) &&
						product.discountedPrice <= parseFloat(maxPrice)
					)
				} else if (minPrice) {
					return product.discountedPrice >= parseFloat(minPrice)
				} else if (maxPrice) {
					return product.discountedPrice <= parseFloat(maxPrice)
				}
				return true
			})
		}

		// Сортировка
		if (sort === 'cheap') {
			products.sort((a, b) => a.discountedPrice - b.discountedPrice)
		} else if (sort === 'expensive') {
			products.sort((a, b) => b.discountedPrice - a.discountedPrice)
		} else if (sort === 'new') {
			products.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
		} else if (sort === 'old') {
			products.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			)
		}

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
