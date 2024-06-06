'use client'

import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { MdOutlineImage } from 'react-icons/md'
import Container from '../ui/Container'
import AddToCartBtn from '../buttons/AddToCartBtn'
import { SafeUser } from '@/types'
import { truncateTextDesc } from '@/utils'

interface FeaturedProductProps {
	product: Product
	user: SafeUser | null
}

const FeaturedProduct: FC<FeaturedProductProps> = ({ product, user }) => {
	return (
		<div className="bg-blue-700/50 text-white py-6">
			<Container>
				<div className="flex flex-col gap-5 items-center justify-center md:px-14 md:grid md:grid-cols-2">
					<div className="flex items-center">
						<div className="order-1 md:order-2">
							<h2 className="text-2xl">{product.name}</h2>
							<p className="text-gray-200">
								{truncateTextDesc(product.description)}
							</p>
							<div className="flex gap-3 mt-6">
								<Link
									href={`/product/${product.id}`}
									className="flex items-center border border-white rounded-lg px-2 transition hover:text-black hover:bg-white"
								>
									Подробнее
								</Link>
								<div className="max-w-[600px]">
									<AddToCartBtn size="default" product={product} user={user} />
								</div>
							</div>
						</div>
					</div>
					<div
						className={`flex justify-center -order-1 md:order-1 ${
							!!product.images[0] === false && 'aspect-square'
						}`}
					>
						{!!product.images[0] ? (
							<Image
								src={product.images[0]}
								alt={product.name}
								width={250}
								height={250}
							/>
						) : (
							<MdOutlineImage
								className="w-full h-full"
								width={250}
								height={250}
							/>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}

export default FeaturedProduct
