import ProductReviewsClient from './ProductReviewsClient'
import { getProductById } from '@/actions/getProductById'
import { getFilteredReviews } from '@/actions/getFilteredReviews'
import { ExtendedProduct } from '@/types'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const id = params.id
	const product = await getProductById(id)

	return {
		title: `ElectroShop | отзывы о товаре ${product?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

const ProductReviews = async ({ params, searchParams }: any) => {
	const productId = params.id
	const product = await getProductById(productId)

	const currentPage = Number(searchParams?.page) || 1
	const { reviews, totalPages } = await getFilteredReviews(
		currentPage,
		searchParams
	)

	return (
		<>
			<ProductReviewsClient
				reviews={reviews}
				product={product as ExtendedProduct}
				totalPages={totalPages}
			/>
		</>
	)
}

export default ProductReviews
