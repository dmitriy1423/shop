'use client'

import Button from '@/app/components/buttons/Button'
import SubHeading from '@/app/components/heading/SubHeading'
import Input from '@/app/components/inputs/Input'
import { ExtendedProduct, ExtendedReview, SafeUser } from '@/types'
import { Rating } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface AddRatingProps {
	product: ExtendedProduct
	user: SafeUser | null
}

const AddRating: FC<AddRatingProps> = ({ product, user }) => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			comment: '',
			rating: 0
		}
	})

	const setCustomValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldTouch: true,
			shouldDirty: true,
			shouldValidate: true
		})
	}

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)
		if (data.rating === 0) {
			setIsLoading(false)
			return toast.error('Не поставлен рейтинг')
		}
		const ratedData = { ...data, userId: user?.id, product: product }

		axios
			.post('/api/review', ratedData)
			.then(() => {
				toast.success('Отзыв опубликован')
				router.refresh()
				reset()
			})
			.catch(error => {
				toast.error('Something went wrong')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	if (!user || !product) return null

	const deliveredOrder = user.orders?.some(
		order =>
			order.items.find(item => item.productId === product.id) &&
			order.deliveryStatus === 'COMPLETED'
	)

	const userReview = product.reviews?.find((review: ExtendedReview) => {
		return review.userId === user.id
	})

	if (!deliveredOrder || userReview) return null

	return (
		<div className="flex flex-col gap-2 max-w-[500px]">
			<SubHeading title="Оставить отзыв" />
			<Rating
				onChange={(event, newValue) => {
					setCustomValue('rating', newValue)
				}}
			/>
			<Input
				id="comment"
				label="Отзыв"
				disabled={isLoading}
				register={register('comment', {
					required: { value: true, message: 'Оставьте комментарий' }
				})}
				errors={errors}
			/>
			<Button
				label={isLoading ? 'Загрузка' : 'Оставьте отзыв'}
				onClick={handleSubmit(onSubmit)}
				disabled={isLoading}
			/>
		</div>
	)
}

export default AddRating
