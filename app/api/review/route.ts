import { getCurrentUser } from '@/actions/getCurrentUser'
import { Review } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function POST(req: Request) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { comment, rating, product, userId } = body

	const deliveredOrder = currentUser.orders.some(
		order =>
			order.items.find(item => item.productId === product.id) &&
			order.deliveryStatus === 'COMPLETED'
	)

	const userReview = product?.reviews.find((review: Review) => {
		review.userId === currentUser.id
	})

	if (userReview || !deliveredOrder) {
		return NextResponse.error()
	}

	const review = await prisma.review.create({
		data: {
			comment,
			rating,
			productId: product.id,
			userId
		}
	})

	return NextResponse.json(review)
}
