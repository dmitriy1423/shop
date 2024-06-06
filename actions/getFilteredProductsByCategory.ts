import prisma from '@/libs/prisma'
import { ExtendedProduct } from '@/types'
import { Prisma, Product } from '@prisma/client'

export async function getFilteredProductsByCategory(
	currentPage: number,
	categoryId: string,
	search: { [key: string]: string }
) {
	const perPage = 4
	const offset = (currentPage - 1) * perPage

	const { page, sort, minPrice, maxPrice, ...filteredSearch } = search

	try {
		let where: {
			categoryId: string
			AND?: any[]
			price?: any
		} = {
			categoryId
		}

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

		if (minPrice || maxPrice) {
			where.price = {}
			if (minPrice) {
				where.price.gte = parseFloat(minPrice)
			}
			if (maxPrice) {
				where.price.lte = parseFloat(maxPrice)
			}
		}

		let products = await prisma.product.findMany({
			where,
			include: {
				reviews: true
			}
		})

		products = products.map(product => {
			const discountedPrice = Math.round(
				product.price * (1 - product.discountPercent / 100)
			)
			return {
				...product,
				discountedPrice
			}
		})

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
