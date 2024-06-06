'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Checkbox from '@/app/components/inputs/Checkbox'
import ProductReviewCart from '@/app/components/product/ProductReviewCart'
import Container from '@/app/components/ui/Container'
import Pagination from '@/app/components/ui/Pagination'
import { ExtendedReview } from '@/types'
import { Rating } from '@mui/material'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { MdArrowBack } from 'react-icons/md'

interface ReviewsClientProps {
	reviews: ExtendedReview[]
	totalPages: number
}

const ReviewsClient: FC<ReviewsClientProps> = ({ reviews, totalPages }) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [selectedRatings, setSelectedRatings] = useState<string[]>(
		searchParams.get('rating')?.split(',') || []
	)

	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			ratings: selectedRatings,
			sort: searchParams.get('sort') || 'all'
		}
	})

	useEffect(() => {
		setValue('ratings', selectedRatings)
	}, [selectedRatings, setValue])

	const createPageURL = (ratings: string[], sort: string) => {
		const params = new URLSearchParams(searchParams)
		if (params.get('page')) {
			params.delete('page')
		}
		if (ratings.length > 0) {
			params.set('rating', ratings.join(','))
		} else {
			params.delete('rating')
		}
		if (sort === 'all') {
			params.delete('sort')
		} else {
			params.set('sort', sort)
		}

		return `${pathname}?${params.toString()}`
	}

	const handleRatingChange = (rating: string, isChecked: boolean) => {
		setSelectedRatings(prev =>
			isChecked ? [...prev, rating] : prev.filter(id => id !== rating)
		)
	}

	const searchReviews: SubmitHandler<FieldValues> = async data => {
		const selectedRatings = getValues('ratings') || []
		router.push(createPageURL(selectedRatings, data.sort))
	}

	const resetFilters = () => {
		setSelectedRatings([])
		reset({
			ratings: [],
			sort: 'all'
		})
		router.push(pathname)
	}

	const ratings = [
		{
			id: '111111111',
			value: '1'
		},
		{
			id: '222222222',
			value: '2'
		},
		{
			id: '33333333333',
			value: '3'
		},
		{
			id: '44444444444',
			value: '4'
		},
		{
			id: '555555555',
			value: '5'
		}
	]

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Ваши отзывы о товарах" />
				</div>
				<Link href={`/user`} className="flex items-center gap-1 mb-5">
					<MdArrowBack /> Назад
				</Link>
				<div className="mb-4">
					<SubHeading title="Фильтры" />
				</div>
				<form
					onSubmit={handleSubmit(searchReviews)}
					key={selectedRatings.join(',')}
					className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-md mb-5"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div className="flex flex-col gap-2">
							<span className="text-lg font-semibold">Рейтинг</span>
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 items-center">
								{ratings.length > 0 &&
									ratings.map(rating => (
										<div key={rating.id}>
											<Checkbox
												register={register}
												id={`ratings.${rating.id}`}
												label={<Rating value={+rating.value} readOnly />}
												defaultChecked={selectedRatings.includes(rating.value)}
												onChange={e =>
													handleRatingChange(rating.value, e.target.checked)
												}
											/>
										</div>
									))}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<span className="text-lg font-semibold">Сортировка</span>
							<label htmlFor="sort">Параметр сортировки:</label>
							<select
								id="sort"
								{...register('sort')}
								className="bg-white border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">Показать все</option>
								<option value="new">Сначала новые</option>
								<option value="old">Сначала старые</option>
							</select>
						</div>
					</div>

					<div className="max-w-[350px] flex gap-5 justify-between">
						<Button label="Применить" small type="submit" />
						<Button
							label="Сбросить фильтры"
							small
							outline
							onClick={resetFilters}
						/>
					</div>
				</form>
				{reviews.length > 0 ? (
					reviews.map(review => (
						<ProductReviewCart
							key={review.id}
							product={review.product}
							review={review}
						/>
					))
				) : (
					<div className="flex items-center justify-center text-center text-2xl font-semibold">
						Отзывы не найдены
					</div>
				)}
				{totalPages > 1 && (
					<div className="mt-5 flex w-full justify-center">
						<Pagination totalPages={totalPages} />
					</div>
				)}
			</Container>
		</div>
	)
}

export default ReviewsClient
