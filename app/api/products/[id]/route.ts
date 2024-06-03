import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const product = await prisma.product.findUnique({
			where: { id: params.id }
		})

		return NextResponse.json(product)
	} catch (error) {
		return NextResponse.json(error)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	try {
		const product = await prisma.product.findUnique({
			where: { id: params.id }
		})

		if (!product) return new Error('Product not found')

		await prisma.product.delete({
			where: { id: params.id }
		})

		return NextResponse.json(product)
	} catch (error) {
		return NextResponse.json(error)
	}
}
