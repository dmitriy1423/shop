import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { orderId } = body

	try {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: { items: true }
		})

		if (!order) return NextResponse.json({ message: 'Order not found' })

		for (const item of order.items) {
			await prisma.cartItem.create({
				data: {
					userId: user.id,
					productId: item.productId,
					quantity: item.quantity
				}
			})
		}

		return NextResponse.json({ message: 'Заказ успешно повторен' })
	} catch (error) {
		return NextResponse.json(error)
	}
}
