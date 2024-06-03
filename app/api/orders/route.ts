import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(req: NextRequest) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	const orders = await prisma.order.findMany({
		include: {
			items: {
				include: {
					product: true
				}
			},
			user: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	revalidatePath('/orders')

	return NextResponse.json(orders)
}
