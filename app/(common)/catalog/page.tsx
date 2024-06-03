import { getCategories } from '@/actions/getCategories'
import CatalogClient from './CatalogClient'
import { getFilteredProducts } from '@/actions/getFilteredProducts'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Каталог',
	description: 'Магазин товаров цифровой техники'
}

const Catalog = async ({ searchParams }: any) => {
	const user = await getCurrentUser()
	const categories = await getCategories()
	const currentPage = Number(searchParams?.page) || 1
	const { products, totalPages } = await getFilteredProducts(
		currentPage,
		searchParams
	)

	return (
		<>
			<CatalogClient
				categories={categories}
				products={products}
				totalPages={totalPages}
				user={user}
			/>
		</>
	)
}

export default Catalog
