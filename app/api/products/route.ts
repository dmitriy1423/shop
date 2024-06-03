import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(req: NextRequest) {
	const products = await prisma.product.findMany({
		include: {
			category: true
		}
	})

	return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const {
		name,
		description,
		price,
		discountPercent,
		images,
		categoryId,
		properties
	} = body

	const product = await prisma.product.create({
		data: {
			name,
			description,
			price: parseFloat(price),
			discountPercent: parseInt(discountPercent),
			images,
			categoryId,
			properties
		},
		include: {
			category: true
		}
	})

	return NextResponse.json(product)
}

export async function PUT(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const {
		id,
		name,
		description,
		price,
		discountPercent,
		images,
		categoryId,
		properties
	} = body

	const product = await prisma.product.update({
		where: { id },
		data: {
			name,
			description,
			price: parseFloat(price),
			discountPercent: parseInt(discountPercent),
			images,
			categoryId,
			properties
		},
		include: {
			category: true
		}
	})

	return NextResponse.json(product)
}
