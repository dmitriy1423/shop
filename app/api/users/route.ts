import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const users = await prisma.user.findMany({})

	return NextResponse.json(users)
}
