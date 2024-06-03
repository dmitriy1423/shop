import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
	const body = await req.json()
	const { productId } = body

	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		const existingItem = await prisma.cartItem.findUnique({
			where: { userId_productId: { productId, userId: currentUser.id } }
		})

		if (existingItem && existingItem.quantity > 1) {
			await prisma.cartItem.update({
				where: { userId_productId: { productId, userId: currentUser.id } },
				data: { quantity: { decrement: 1 } }
			})
		} else {
			await prisma.cartItem.delete({
				where: { userId_productId: { productId, userId: currentUser.id } }
			})
		}

		const updatedCartItems = await prisma.cartItem.findMany()
		return NextResponse.json(updatedCartItems)
	} catch (error) {
		return NextResponse.json(error)
	}
}
