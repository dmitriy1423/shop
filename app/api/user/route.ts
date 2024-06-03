import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'
import bcrypt from 'bcrypt'

export async function GET(req: NextRequest) {
	const currentUser = await getCurrentUser()
	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const user = await prisma.user.findUnique({
		where: {
			email: currentUser.email as string
		}
	})

	return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
	const currentUser = await getCurrentUser()
	if (!currentUser) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()
	const { name, email, password, image } = body
	const updatedData = { name, email, password, image }

	if (password) {
		updatedData.password = await bcrypt.hash(password, 10)
	}

	const user = await prisma.user.update({
		where: { email: currentUser.email as string },
		data: updatedData
	})

	return NextResponse.json(user)
}
