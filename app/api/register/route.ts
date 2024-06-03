import bcrypt from 'bcrypt'
import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const body = await request.json()
	const { name, email, password } = body

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email }
		})

		if (existingUser)
			return NextResponse.json({
				message: 'Пользователь с таким email уже существует'
			})

		const hashedPassword = await bcrypt.hash(password, 10)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			}
		})

		return NextResponse.json(user)
	} catch (error: any) {
		console.log(error)
		return NextResponse.json(error)
	}
}
