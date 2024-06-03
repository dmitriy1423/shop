import { getCategories } from '@/actions/getCategories'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { getNewProducts } from '@/actions/getNewProducts'
import { getProducts } from '@/actions/getProducts'
import { getSettingValue } from '@/actions/getSettingsValue'
import { Product } from '@prisma/client'
import Categories from '../components/category/Categories'
import FeaturedProducts from '../components/featured/FeaturedProducts'
import NewProducts from '../components/product/NewProducts'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Главная',
	description: 'Магазин товаров цифровой техники'
}

export default async function Home() {
	const user = await getCurrentUser()
	const featuredProductSetting = await getSettingValue('featuredProducts')

	const featuredProducts: Product[] | null = await getProducts(
		featuredProductSetting?.values
	)

	const newProducts = await getNewProducts()
	const categories = await getCategories()

	return (
		<>
			<FeaturedProducts products={featuredProducts} user={user} />
			<NewProducts products={newProducts} user={user} />
			<Categories categories={categories} />
		</>
	)
}
