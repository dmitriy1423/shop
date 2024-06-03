import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		const favorites = await prisma.favoriteItem.findMany({
			where: { userId: currentUser.id },
			include: {
				product: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return NextResponse.json(favorites)
	} catch (error) {
		return NextResponse.json(error)
	}
}
