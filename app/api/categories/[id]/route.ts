import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const categories = await prisma.category.findUnique({
		where: { id: params.id },
		include: {
			properties: true,
			products: true
		}
	})

	return NextResponse.json(categories)
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	try {
		const category = await prisma.category.findUnique({
			where: { id: params.id }
		})

		if (!category) return new Error('Category not found')

		await prisma.category.delete({
			where: { id: params.id }
		})

		return NextResponse.json({ message: 'Category deleted' })
	} catch (error) {
		return NextResponse.json(error)
	}
}
