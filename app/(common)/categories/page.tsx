import { getCategories } from '@/actions/getCategories'
import CategoriesClient from './CategoriesClient'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Категории товаров',
	description: 'Магазин товаров цифровой техники'
}

const CategoriesPage = async () => {
	const categories = await getCategories()
	const user = await getCurrentUser()

	return (
		<>
			<CategoriesClient categories={categories} user={user} />
		</>
	)
}

export default CategoriesPage
