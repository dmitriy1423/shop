'use client'

import { ExtendedProduct, SafeUser } from '@/types'
import { FC } from 'react'
import SubHeading from '../heading/SubHeading'
import Container from '../ui/Container'
import ProductsGrid from './ProductsGrid'

interface NewProductsProps {
	products: ExtendedProduct[]
	user: SafeUser | null
}

const NewProducts: FC<NewProductsProps> = ({ products, user }) => {
	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<SubHeading title="Новые товары" />
				</div>
				<ProductsGrid products={products} user={user} type="default" />
			</Container>
		</div>
	)
}

export default NewProducts
