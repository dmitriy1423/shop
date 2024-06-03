import { ExtendedProduct } from '@/types'
import { FC } from 'react'

interface ProductRatingProps {
	product: ExtendedProduct
}

const ProductRating: FC<ProductRatingProps> = ({ product }) => {
	const productRating =
		(product.reviews &&
			product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
				product.reviews?.length) ||
		0

	return (
		<div className="p-2 bg-transparent text-white text-sm flex gap-2 items-center font-bold rounded-full absolute left-5 top-5 shadow-lg">
			<div className="text-yellow-500 text-2xl">★</div>
			<div className="text-black">{productRating}</div>
		</div>
	)
}

export default ProductRating
