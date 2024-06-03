'use client'

import { ExtendedProduct } from '@/types'
import { FC } from 'react'

interface ProductDiscountCardProps {
	product: ExtendedProduct
}

const ProductDiscountCard: FC<ProductDiscountCardProps> = ({ product }) => {
	if (product.discountPercent > 0) {
		return (
			<div className="p-2 bg-red-600 text-white text-sm font-bold rounded-full absolute right-5 top-5 shadow-lg transform transition-transform hover:scale-110">
				-{product.discountPercent}%
			</div>
		)
	}

	return null
}

export default ProductDiscountCard
