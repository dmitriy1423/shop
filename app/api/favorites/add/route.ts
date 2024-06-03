import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const body = await req.json()
	const { productId } = body

	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		await prisma.favoriteItem.create({
			data: { productId, userId: currentUser.id }
		})

		const updatedFavorites = await prisma.favoriteItem.findMany()
		return NextResponse.json(updatedFavorites)
	} catch (error) {
		return NextResponse.json(error)
	}
}
