import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'
import { ExtendedCart, ExtendedProduct } from '@/types'
import { CartItem } from '@prisma/client'

export async function POST(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { cartItems } = body

	const amount = Math.round(
		cartItems.reduce((acc: number, item: ExtendedCart) => {
			const originalPrice = item.product.price
			const discount = item.product.discountPercent
			const discountedPrice = originalPrice * (1 - discount / 100)
			const finalPrice = discount > 0 ? discountedPrice : originalPrice

			return acc + finalPrice * item.quantity
		}, 0)
	)

	try {
		const order = await prisma.order.create({
			data: {
				userId: currentUser.id,
				amount,
				isPaid: false,
				deliveryStatus: 'PENDING',
				items: {
					create: cartItems.map((item: ExtendedCart) => {
						const originalPrice = item.product.price
						const discount = item.product.discountPercent
						const discountedPrice = originalPrice * (1 - discount / 100)
						const finalPrice = discount > 0 ? discountedPrice : originalPrice

						return {
							productId: item.product.id,
							price: Math.round(finalPrice),
							quantity: item.quantity
						}
					})
				}
			}
		})

		await prisma.cartItem.deleteMany({
			where: { userId: currentUser.id }
		})

		return NextResponse.json(order)
	} catch (error: any) {
		return NextResponse.json(error)
	}
}
