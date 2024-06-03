'use client'

import { ExtendedProduct, SafeUser } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import AddToCartBtn from '../buttons/AddToCartBtn'
import AddToFavBtn from '../buttons/AddToFavBtn'
import ProductDiscountCard from './ProductDiscountCard'
import ProductDiscountedPrice from './ProductDiscountedPrice'
import ProductRating from './ProductRating'

interface ProductCardProps {
	product: ExtendedProduct
	user: SafeUser | null
}

const ProductCard: FC<ProductCardProps> = ({ product, user }) => {
	return (
		<div className="relative bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition">
			<ProductDiscountCard product={product} />
			<Link href={`/product/${product.id}`}>
				<div className="relative w-full h-48 mb-4 aspect-square">
					<Image
						src={product.images[0]}
						alt={product.name}
						fill
						className="object-contain rounded-t-lg"
					/>
				</div>
			</Link>
			<Link href={`/product/${product.id}`}>
				<h3 className="text-lg font-bold mb-2">{product.name}</h3>
			</Link>
			<ProductRating product={product} />
			<ProductDiscountedPrice product={product} />
			<div className="flex justify-between items-center gap-3">
				<AddToCartBtn product={product} user={user} size="small" />
				<AddToFavBtn product={product} user={user} size="small" />
			</div>
		</div>
	)
}

export default ProductCard
