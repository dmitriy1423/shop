import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function PUT(req: NextRequest) {
	const user = await getCurrentUser()

	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const { orderId, status } = body

	const order = await prisma.order.update({
		where: { id: orderId },
		data: { deliveryStatus: status }
	})

	if (!order) throw new Error('Order not found')

	return NextResponse.json(order)
}
