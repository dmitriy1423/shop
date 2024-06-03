import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function PUT(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const { userId, role } = body

	try {
		const user = await prisma.user.update({
			where: { id: userId },
			data: { role }
		})

		return NextResponse.json(user)
	} catch (error) {
		return NextResponse.json(error)
	}
}
