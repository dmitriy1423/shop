import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(req: NextRequest) {
	const searchParam = req.nextUrl.searchParams.get('name')

	const setting = await prisma.setting.findUnique({
		where: { name: searchParam as string }
	})

	if (!setting) return NextResponse.json(null)

	return NextResponse.json(setting)
}

export async function PUT(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()

	const { name, values } = body

	const setting = await prisma.setting.findUnique({
		where: { name }
	})

	if (setting) {
		const updatedSetting = await prisma.setting.update({
			where: { name },
			data: {
				values:
					typeof values === 'string' ? Array.from(values.split(',')) : values
			}
		})
		return NextResponse.json(updatedSetting)
	} else {
		const setting = await prisma.setting.create({
			data: {
				name,
				values:
					typeof values === 'string' ? Array.from(values.split(',')) : values
			}
		})
		return NextResponse.json(setting)
	}
}
