import { getCurrentUser } from '@/actions/getCurrentUser'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function POST(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()

	const { orderId } = body

	try {
		const order = await prisma.order.update({
			where: { id: orderId },
			data: {
				deliveryStatus: 'CANCELED'
			}
		})

		return NextResponse.json(order)
	} catch (error) {
		console.error('Error cancelling order:', error)
		return NextResponse.json(error)
	}
}
