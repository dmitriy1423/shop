'use client'

import { ExtendedCategory, SafeUser } from '@/types'
import Link from 'next/link'
import { FC } from 'react'
import { MdArrowForward } from 'react-icons/md'
import SubHeading from '../heading/SubHeading'
import ProductsGrid from '../product/ProductsGrid'

interface CategoryProductsProps {
	category: ExtendedCategory
	user: SafeUser | null
}

const CategoryProducts: FC<CategoryProductsProps> = ({ category, user }) => {
	return (
		<>
			{category.products && category.products.length > 0 && (
				<>
					<div className="flex items-center gap-5 mb-3">
						<SubHeading title={category.name} />
						<Link
							href={`/category/${category.id}`}
							className="flex items-center gap-2 underline"
						>
							Подробнее <MdArrowForward />
						</Link>
					</div>

					<div className="mb-5">
						<ProductsGrid
							products={category.products.slice(0, 3)}
							user={user}
							type="default"
						/>
					</div>
				</>
			)}
		</>
	)
}

export default CategoryProducts
