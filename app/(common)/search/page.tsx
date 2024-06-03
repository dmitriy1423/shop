import { getFilteredProducts } from '@/actions/getFilteredProducts'
import SearchClient from './SearchClient'
import { getFilteredSearchedProducts } from '@/actions/getFilteredSearchedProducts'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Поиск товаров',
	description: 'Магазин товаров цифровой техники'
}

const SearchPage = async ({ searchParams }: any) => {
	const user = await getCurrentUser()
	const currentPage = Number(searchParams?.page) || 1

	const { products, totalPages } = await getFilteredSearchedProducts(
		currentPage,
		searchParams
	)

	return (
		<>
			<SearchClient products={products} totalPages={totalPages} user={user} />
		</>
	)
}

export default SearchPage
