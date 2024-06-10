import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { productId, quantity } = body

	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		const existingItem = await prisma.cartItem.findUnique({
			where: { userId_productId: { productId, userId: currentUser.id } }
		})

		if (existingItem) {
			await prisma.cartItem.update({
				where: { userId_productId: { productId, userId: currentUser.id } },
				data: { quantity: { increment: quantity } }
			})
		} else {
			await prisma.cartItem.create({
				data: { productId, quantity, userId: currentUser.id }
			})
		}

		const updatedCartItems = await prisma.cartItem.findMany({
			where: {
				userId: currentUser.id
			}
		})
		return NextResponse.json(updatedCartItems)
	} catch (error) {
		return NextResponse.json(error)
	}
}
