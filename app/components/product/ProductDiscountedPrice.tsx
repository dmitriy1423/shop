'use client'

import { ExtendedProduct } from '@/types'
import { FC } from 'react'

interface ProductDiscountedPriceProps {
	product: ExtendedProduct
}

const ProductDiscountedPrice: FC<ProductDiscountedPriceProps> = ({
	product
}) => {
	const discountedPrice = Math.round(
		product.price * (1 - product.discountPercent / 100)
	)

	return (
		<div className="flex items-baseline mb-4">
			{product.discountPercent > 0 ? (
				<>
					<p className="text-gray-600 line-through mr-2">
						{product.price} руб.
					</p>
					<p className="text-red-600">{discountedPrice} руб.</p>
				</>
			) : (
				<p className="text-gray-600">{product.price} руб.</p>
			)}
		</div>
	)
}

export default ProductDiscountedPrice
