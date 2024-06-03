import { getProductById } from '@/actions/getProductById'
import ProductClient from './ProductClient'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { getProductReviews } from '@/actions/getProductReviews'
import { SafeUser } from '@/types'
import NullData from '@/app/components/ui/NullData'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const id = params.id
	const product = await getProductById(id)

	return {
		title: `ElectroShop | ${product?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

interface IParams {
	id: string
}

const Product = async ({ params }: { params: IParams }) => {
	const user = await getCurrentUser()
	const product = await getProductById(params.id)

	if (!product) return <NullData title="Товар не найден" />
	const reviews = await getProductReviews(product.id)

	return (
		<>
			<ProductClient
				product={product}
				user={user as SafeUser}
				reviews={reviews}
			/>
		</>
	)
}

export default Product
