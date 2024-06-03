import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	try {
		const order = await prisma.order.findUnique({
			where: { id: params.id },
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		if (!order) return NextResponse.json({ message: 'Order not found' })

		return NextResponse.json(order)
	} catch (error: any) {
		return NextResponse.json(error)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	try {
		const order = await prisma.order.findUnique({
			where: { id: params.id },
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		if (!order) return NextResponse.json({ message: 'Order not found' })

		await prisma.order.delete({
			where: { id: params.id }
		})

		return NextResponse.json({ message: 'Order deleted' })
	} catch (error: any) {
		return NextResponse.json(error)
	}
}
