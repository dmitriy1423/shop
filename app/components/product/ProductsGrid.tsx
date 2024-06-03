'use client'

import { Product } from '@prisma/client'
import { FC } from 'react'
import { RevealWrapper } from 'next-reveal'
import ProductCard from './ProductCard'
import { SafeUser } from '@/types'

interface ProductsGridProps {
	products: Product[]
	user: SafeUser | null
	type: 'default' | 'catalog'
}

const ProductsGrid: FC<ProductsGridProps> = ({ products, user, type }) => {
	if (type === 'catalog') {
		return (
			<>
				{products.length > 0 && (
					<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 2xl:grid-cols-3">
						{products.map((product, index) => (
							<RevealWrapper delay={index * 50} key={product.id}>
								<ProductCard product={product} user={user} />
							</RevealWrapper>
						))}
					</div>
				)}
			</>
		)
	}

	return (
		<>
			{products.length > 0 && (
				<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
					{products.map((product, index) => (
						<RevealWrapper delay={index * 50} key={product.id}>
							<ProductCard product={product} user={user} />
						</RevealWrapper>
					))}
				</div>
			)}
		</>
	)
}

export default ProductsGrid
