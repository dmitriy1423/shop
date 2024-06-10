import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { productId } = body

	try {
		await prisma.favoriteItem.delete({
			where: { userId_productId: { productId, userId: currentUser.id } }
		})

		const updatedFavorites = await prisma.favoriteItem.findMany({
			where: {
				userId: currentUser.id
			}
		})
		return NextResponse.json(updatedFavorites)
	} catch (error) {
		return NextResponse.json(error)
	}
}
