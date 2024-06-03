'use client'

import Image from 'next/image'
import { FC, useState } from 'react'
import { MdArrowBack, MdArrowForward, MdOutlineImage } from 'react-icons/md'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

interface ProductImagesProps {
	images: string[]
}

const ProductImages: FC<ProductImagesProps> = ({ images }) => {
	const [activeImage, setActiveImage] = useState(images[0])
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
	const [activeIndex, setActiveIndex] = useState(0)

	const handleMainSlideChange = (swiper: SwiperClass) => {
		setActiveIndex(swiper.activeIndex)
		if (thumbsSwiper) {
			thumbsSwiper.slideTo(swiper.activeIndex)
		}
	}

	return (
		<div className="relative bg-white p-5 text-center rounded-lg">
			<Swiper
				spaceBetween={10}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[Navigation, Thumbs]}
				navigation={{
					prevEl: '.swiper-button-prev',
					nextEl: '.swiper-button-next'
				}}
				className="aspect-square overflow-hidden relative"
				onSlideChange={swiper => handleMainSlideChange(swiper)}
			>
				{images.length > 0 ? (
					images.map((image, index) => (
						<SwiperSlide key={`main-image-${index}`}>
							<Image
								src={image}
								fill
								alt={'image of product'}
								className="max-w-full object-contain"
							/>
						</SwiperSlide>
					))
				) : (
					<SwiperSlide>
						<MdOutlineImage className="w-full h-full" />
					</SwiperSlide>
				)}
			</Swiper>

			<Swiper
				onSwiper={setThumbsSwiper}
				spaceBetween={10}
				slidesPerView={4}
				watchSlidesProgress
				modules={[Thumbs, Navigation]}
			>
				{images.map((image, index) => (
					<SwiperSlide
						key={`thumb-image-${index}`}
						className={`product-slide cursor-pointer aspect-square overflow-hidden relative border border-1 border-gray-200 rounded-md ${
							activeIndex === index
								? 'border-red-400 opacity-100'
								: 'opacity-70'
						}`}
						onClick={() => thumbsSwiper?.slideTo(index)}
					>
						<Image
							width={50}
							height={50}
							src={image}
							alt={`${index + 1} image of product`}
							className="w-full h-full object-contain"
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<button
				className={
					'swiper-button-prev w-5 h-5 absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full z-10 hover:bg-opacity-80'
				}
			>
				<MdArrowBack fill="white" />
			</button>
			<button
				className={
					'swiper-button-next w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full z-10 hover:bg-opacity-80'
				}
			>
				<MdArrowForward fill="white" />
			</button>
		</div>
	)
}

export default ProductImages
