'use client'

import { ExtendedReview } from '@/types'
import { Rating } from '@mui/material'
import { FC } from 'react'
import Avatar from '../ui/Avatar'

interface ReviewCartProps {
	review: ExtendedReview
}

const ReviewCart: FC<ReviewCartProps> = ({ review }) => {
	return (
		<div className="max-w-[400px] bg-white p-4 rounded-md shadow-md">
			<div className="flex gap-5 items-center">
				<Avatar src={review.user.image ? review.user.image : ''} />
				<div className="font-semibold">{review.user.name}</div>
				<div className="flex flex-col gap-1">
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
			<div className="mt-2">
				<Rating value={review.rating} readOnly />
				<div className="ml-2">{review.comment}</div>
			</div>
		</div>
	)
}

export default ReviewCart
