import CategoryClient from './CategoryClient'
import { getFilteredProductsByCategory } from '@/actions/getFilteredProductsByCategory'
import { getCategoryById } from '@/actions/getCategoryById'
import { getCurrentUser } from '@/actions/getCurrentUser'
import NullData from '@/app/components/ui/NullData'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const id = params.id
	const category = await getCategoryById(id)

	return {
		title: `ElectroShop | ${category?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

const CategoryPage = async ({ params, searchParams }: any) => {
	const user = await getCurrentUser()
	const category = await getCategoryById(params.id)

	if (!category) return <NullData title="Категория не найдена" />

	const currentPage = Number(searchParams?.page) || 1
	const { products, totalPages } = await getFilteredProductsByCategory(
		currentPage,
		category.id,
		searchParams
	)

	return (
		<>
			<CategoryClient
				category={category}
				products={products}
				totalPages={totalPages}
				user={user}
			/>
		</>
	)
}

export default CategoryPage
