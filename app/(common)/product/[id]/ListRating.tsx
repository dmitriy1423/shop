'use client'

import Button from '@/app/components/buttons/Button'
import SubHeading from '@/app/components/heading/SubHeading'
import TextArea from '@/app/components/inputs/TextArea'
import Avatar from '@/app/components/ui/Avatar'
import { ExtendedProduct, ExtendedReview, SafeUser } from '@/types'
import { Rating } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdArrowForward } from 'react-icons/md'

interface ListRatingProps {
	product: ExtendedProduct
	reviews: ExtendedReview[]
	user: SafeUser
}

const ListRating: FC<ListRatingProps> = ({ product, reviews, user }) => {
	const router = useRouter()
	const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			rating: 0,
			comment: ''
		}
	})

	const handleEdit = (review: ExtendedReview) => {
		setEditingReviewId(review.id)
		setValue('rating', review.rating)
		setValue('comment', review.comment)
	}

	const handleCancelEdit = () => {
		setEditingReviewId(null)
		reset()
	}

	const handleSaveEdit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)
		try {
			await axios.put(`/api/review/${editingReviewId}`, data)
			toast.success('Отзыв обновлен')
			setEditingReviewId(null)
			reset()
			router.refresh()
		} catch (error) {
			toast.error('Ошибка при обновлении отзыва')
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (reviewId: string) => {
		setIsLoading(true)
		try {
			await axios.delete(`/api/review/${reviewId}`)
			toast.success('Отзыв удален')
			router.refresh()
		} catch (error) {
			toast.error('Ошибка при удалении отзыва')
		} finally {
			setIsLoading(false)
		}
	}

	if (product.reviews?.length === 0) return null

	return (
		<div>
			<SubHeading title="Отзывы о товаре" />
			<div className="text-sm mt-2">
				{reviews &&
					reviews.map(review => (
						<div key={review.id} className="max-w-[300px]">
							<div className="flex gap-2 items-center">
								<Avatar src={review.user.image ? review.user.image : ''} />
								<div className="font-semibold">{review.user.name}</div>
								<div className="font-light">
									{new Date(review.createdAt).toLocaleString()}
								</div>
							</div>
							{editingReviewId === review.id ? (
								<form
									onSubmit={handleSubmit(handleSaveEdit)}
									className="mt-2 space-y-2"
								>
									<Controller
										name="rating"
										control={control}
										render={({ field }) => (
											<Rating
												{...field}
												onChange={(_, newValue) => field.onChange(newValue)}
											/>
										)}
									/>
									<TextArea
										id="comment"
										register={register('comment', {
											required: 'Комментарий обязателен'
										})}
										errors={errors}
										label="Комметарий"
									/>
									<div className="flex gap-2">
										<Button
											label="Сохранить"
											type="submit"
											disabled={isLoading}
										/>
										<Button
											label="Отмена"
											onClick={handleCancelEdit}
											outline
											disabled={isLoading}
										/>
									</div>
								</form>
							) : (
								<div className="mt-2">
									<Rating value={review.rating} readOnly />
									<div className="ml-2">{review.comment}</div>
									{user?.id === review.user.id && (
										<div className="flex gap-2 mt-2">
											<Button
												label="Редактировать"
												onClick={() => handleEdit(review)}
												disabled={isLoading}
											/>
											<Button
												label="Удалить"
												onClick={() => handleDelete(review.id)}
												outline
												disabled={isLoading}
											/>
										</div>
									)}
								</div>
							)}
							<hr className="mt-4 mb-4" />
						</div>
					))}
			</div>
			<div>
				<Link
					href={`/product/${product.id}/reviews`}
					className="flex items-center gap-1"
				>
					Посмотреть все <MdArrowForward />
				</Link>
			</div>
		</div>
	)
}

export default ListRating
