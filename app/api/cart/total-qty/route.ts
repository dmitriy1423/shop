import { getCurrentUser } from '@/actions/getCurrentUser'
import prisma from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const currentUser = await getCurrentUser()

	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	try {
		const products = await prisma.cartItem.findMany({})
		const totalQty = products.reduce((total, item) => total + item.quantity, 0)

		return NextResponse.json(totalQty)
	} catch (error) {
		return NextResponse.json(error)
	}
}
