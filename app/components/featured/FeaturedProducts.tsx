'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Product } from '@prisma/client'
import { FC } from 'react'
import FeaturedProduct from './FeaturedProduct'
import { SafeUser } from '@/types'

interface FeaturedProductsProps {
	products: Product[] | null
	user: SafeUser | null
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ products, user }) => {
	if (!products) return null

	return (
		<Swiper
			modules={[Pagination]}
			pagination={{ clickable: true, el: '.slider-pagination' }}
			spaceBetween={10}
			slidesPerView={1}
			autoHeight
			className="w-full h-full relative bg-gray-700 z-400"
		>
			{products.length > 0 &&
				products.map(product => (
					<SwiperSlide key={product.id}>
						<FeaturedProduct product={product} user={user} />
					</SwiperSlide>
				))}
			<div className="slider-pagination"></div>
		</Swiper>
	)
}

export default FeaturedProducts
