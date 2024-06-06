'use client'

import AddToCartBtn from '@/app/components/buttons/AddToCartBtn'
import AddToFavBtn from '@/app/components/buttons/AddToFavBtn'
import Heading from '@/app/components/heading/Heading'
import ProductDiscountedPrice from '@/app/components/product/ProductDiscountedPrice'
import ProductImages from '@/app/components/product/ProductImages'
import Container from '@/app/components/ui/Container'
import { ExtendedProduct, ExtendedReview, SafeUser } from '@/types'
import { Rating } from '@mui/material'
import { FC } from 'react'
import AddRating from './AddRating'
import ListRating from './ListRating'
import { pluralizeRu } from '@/utils'

interface ProductClientProps {
	product: ExtendedProduct
	user: SafeUser
	reviews: ExtendedReview[]
}

const Horizontal = () => {
	return <hr className="w-[30%] my-2" />
}

const ProductClient: FC<ProductClientProps> = ({ product, user, reviews }) => {
	const properties =
		typeof product.properties === 'object' ? product.properties : {}

	const productRating =
		(product.reviews &&
			product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
				product.reviews?.length) ||
		0

	const renderProperties = () => {
		return Object.entries(properties as any).map(
			([propertyName, propertyValue]) => (
				<div key={propertyName}>
					<span className="font-semibold">{propertyName}:</span>{' '}
					{propertyValue as string}
				</div>
			)
		)
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title={product.name} />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-16 mb-10">
					<div className="sm:col-span-2">
						<ProductImages images={product.images} />
					</div>
					<div className="flex flex-col items-start justify-center sm:col-span-3">
						<div className="flex items-center gap-2">
							<Rating value={productRating} readOnly />
							<div>
								{product.reviews?.length}{' '}
								{pluralizeRu(
									product.reviews?.length || 0,
									'отзыв',
									'отзыва',
									'отзывов'
								)}
							</div>
						</div>
						<Horizontal />
						<p className="text-justify">{product.description}</p>
						<Horizontal />
						<div>
							<span className="font-semibold">Категория:</span>{' '}
							{product.category?.name}
						</div>
						<Horizontal />
						<span className="font-semibold">Характеристики:</span>
						{renderProperties()}
						<Horizontal />
						<ProductDiscountedPrice product={product} />
						<div className="max-w-[350px] flex flex-col gap-5">
							<AddToCartBtn product={product} user={user} size="default" />
							<AddToFavBtn product={product} user={user} size="default" />
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
					<AddRating product={product} user={user} />
					<ListRating product={product} reviews={reviews} user={user} />
				</div>
			</Container>
		</div>
	)
}

export default ProductClient
