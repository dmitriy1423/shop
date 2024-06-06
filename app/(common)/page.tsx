import { getCategories } from '@/actions/getCategories'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { getNewProducts } from '@/actions/getNewProducts'
import { getProducts } from '@/actions/getProducts'
import { getSettingValue } from '@/actions/getSettingsValue'
import { Product } from '@prisma/client'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

const DF = dynamic(() => import('../components/featured/FeaturedProducts'))
const DN = dynamic(() => import('../components/product/NewProducts'))
const DC = dynamic(() => import('../components/category/Categories'))

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
			<DF products={featuredProducts} user={user} />
			<DN products={newProducts} user={user} />
			<DC categories={categories} />
		</>
	)
}
