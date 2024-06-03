import prisma from '@/libs/prisma'
import { OrderStatus } from '@prisma/client'

export async function getFilteredOrders(
	currentPage: number,
	userId: string,
	search: { [key: string]: string }
) {
	const perPage = 2
	const offset = (currentPage - 1) * perPage

	const { page, sort, status, success, cancelled, ...filteredSearch } = search

	try {
		let where: {
			userId: string
			deliveryStatus?: { in: OrderStatus[] }
			AND?: any[]
		} = {
			userId
		}

		// Извлекаем id категорий из параметров поиска
		const statuses = status ? status.split(',') : []

		if (statuses.length > 0) {
			where.deliveryStatus = { in: statuses as OrderStatus[] }
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
		const orders = await prisma.order.findMany({
			where,
			skip: offset,
			take: perPage,
			orderBy,
			include: {
				items: {
					include: {
						product: true
					}
				},
				user: true
			}
		})

		// Подсчет общего количества продуктов для пагинации
		const totalOrders = await prisma.order.count({
			where
		})

		return {
			orders,
			totalOrders,
			totalPages: Math.ceil(totalOrders / perPage)
		}
	} catch (error: any) {
		throw new Error(error.message)
	}
}
