'use client'

import { ExtendedProduct, ExtendedReview } from '@/types'
import { Rating } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from '../buttons/Button'
import TextArea from '../inputs/TextArea'
import Avatar from '../ui/Avatar'
import { truncateText } from '@/utils'

interface ProductReviewCartProps {
	review: ExtendedReview
	product: ExtendedProduct
}

const ProductReviewCart: FC<ProductReviewCartProps> = ({ review, product }) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		getValues,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			rating: review.rating,
			comment: review.comment
		}
	})

	const watchedRating = watch('rating', review.rating)

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		try {
			await axios.put(`/api/review/${review.id}`, data)
			setIsEditing(false)
			toast.success('Отзыв отредактирован')
			router.refresh()
		} catch (error) {
			console.error('Error updating review:', error)
		}
	}

	const handleDelete = async (reviewId: string) => {
		try {
			await axios.delete(`/api/review/${reviewId}`)
			toast.success('Отзыв удален')
			router.refresh()
		} catch (error) {
			toast.error('Ошибка при удалении отзыва')
		}
	}

	return (
		<div className="border rounded-lg shadow-md p-4 mb-4 flex justify-between bg-white">
			<div className="flex flex-col items-center">
				<div className="relative w-24 h-24 sm:w-48 sm:h-48 mb-4 aspect-square">
					<Image
						src={product.images[0]}
						alt={product.name}
						fill
						className="object-contain rounded-t-lg"
					/>
				</div>
				<div className="sm:text-center">
					<h2 className="text-xl font-bold">{truncateText(product.name)}</h2>
				</div>
			</div>
			<div className="flex flex-col gap-2 justify-between sm:flex-grow">
				<div className="hidden sm:flex items-center justify-end">
					<div className="ml-2">
						<p className="text-xs sm:text-sm text-gray-500">
							{new Date(review.createdAt).toLocaleString()}
						</p>
						{new Date(review.updatedAt).toLocaleString() !==
							new Date(review.createdAt).toLocaleString() && (
							<p className="text-xs sm:text-sm text-gray-500">
								Изменено: {new Date(review.updatedAt).toLocaleString()}
							</p>
						)}
					</div>
				</div>
				{isEditing ? (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Рейтинг
							</label>
							<Rating
								value={watchedRating}
								onChange={(_, value) => setValue('rating', value || 0)}
							/>
						</div>
						<div className="mb-5">
							<TextArea
								id="comment"
								register={register('comment', {
									required: 'Комментарий обязателен'
								})}
								errors={errors}
								label="Комметарий"
							/>
						</div>
						<div className="max-w-[300px] flex gap-5 items-center">
							<Button label="Сохранить" type="submit" />
							<Button
								label="Отмена"
								type="button"
								onClick={() => setIsEditing(false)}
								outline
							/>
						</div>
					</form>
				) : (
					<>
						<div className="mb-4">
							<span className="block text-sm font-medium text-gray-700">
								Рейтинг
							</span>
							<Rating value={review.rating} readOnly />
						</div>
						<div>
							<span className="block text-sm font-medium text-gray-700">
								Текст отзыва
							</span>
							<p className=" text-gray-700">{review.comment}</p>
						</div>
						<div className="max-w-[300px] flex gap-5 items-center">
							<Button
								label="Редактировать"
								onClick={() => setIsEditing(true)}
							/>
							<Button
								label="Удалить"
								onClick={() => handleDelete(review.id)}
								outline
							/>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ProductReviewCart
