import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
	const body = await req.json()
	const { productId } = body

	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		await prisma.cartItem.update({
			where: { userId_productId: { productId, userId: currentUser.id } },
			data: { quantity: { increment: 1 } }
		})

		const updatedCartItems = await prisma.cartItem.findMany()
		return NextResponse.json(updatedCartItems)
	} catch (error) {
		return NextResponse.json(error)
	}
}
