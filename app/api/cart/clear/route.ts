import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		await prisma.cartItem.deleteMany({
			where: {
				userId: currentUser.id
			}
		})

		return NextResponse.json({ message: 'Cart clear' })
	} catch (error) {
		return NextResponse.json(error)
	}
}
