import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(req: NextRequest) {
	const searchParam = req.nextUrl.searchParams.get('categoryId')

	const properties = await prisma.property.findMany({
		where: { categoryId: searchParam as string }
	})

	if (!properties) return NextResponse.json(null)

	return NextResponse.json(properties)
}
