import { getCurrentUser } from '@/actions/getCurrentUser'
import { Review } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { rating, comment } = body

	const review = await prisma.review.update({
		where: { id: params.id },
		data: {
			rating,
			comment
		}
	})

	return NextResponse.json(review)
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	await prisma.review.delete({
		where: { id: params.id }
	})

	return NextResponse.json({ message: 'Review deleted' })
}
