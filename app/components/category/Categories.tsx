'use client'

import { ExtendedCategory } from '@/types'
import { FC } from 'react'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'
import { Grid, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import SubHeading from '../heading/SubHeading'
import Container from '../ui/Container'
import Category from './Category'

interface CategoriesProps {
	categories: ExtendedCategory[]
}

const Categories: FC<CategoriesProps> = ({ categories }) => {
	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<SubHeading title="Категории товаров" />
				</div>
				<div className="relative w-full h-full px-5 sm:px-10">
					<Swiper
						modules={[Navigation, Grid]}
						navigation={{
							prevEl: '.swiper-button-prev',
							nextEl: '.swiper-button-next'
						}}
						spaceBetween={10}
						slidesPerView={1}
						breakpoints={{
							640: {
								slidesPerView: 2,
								spaceBetween: 10
							},
							1024: {
								slidesPerView: 3,
								spaceBetween: 15
							}
						}}
						autoHeight
						className="w-full h-full relative"
					>
						{categories.length > 0 &&
							categories.map((category, index) => (
								<SwiperSlide key={category.id} className="flex">
									<Category category={category} />
								</SwiperSlide>
							))}
					</Swiper>
					<button
						className={
							'swiper-button-prev w-5 h-5 absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full z-10 hover:bg-opacity-80'
						}
						aria-label="Назад"
					>
						<MdArrowBack fill="white" />
					</button>
					<button
						className={
							'swiper-button-next w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full z-10 hover:bg-opacity-80'
						}
						aria-label="Вперёд"
					>
						<MdArrowForward fill="white" />
					</button>
				</div>
			</Container>
		</div>
	)
}

export default Categories
