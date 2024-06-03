import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getCurrentUser } from '@/actions/getCurrentUser'

export async function GET(req: NextRequest) {
	const categories = await prisma.category.findMany({
		include: {
			properties: true,
			products: true
		}
	})

	return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const { name, description, properties } = body

	let category

	try {
		let categoryData = {
			name,
			description,
			properties: {
				create: properties.map((prop: { [key: string]: string }) => ({
					name: prop.name,
					values: prop.values.split(',')
				}))
			}
		}

		const category = await prisma.category.create({
			data: categoryData
		})

		return NextResponse.json(category)
	} catch (error) {
		console.error('Error creating category:', error)
		return NextResponse.error()
	}
}

export async function PUT(req: NextRequest, res: NextResponse) {
	const user = await getCurrentUser()
	if (user?.role !== 'ADMIN')
		return NextResponse.json({ message: 'Admin not found' })

	const body = await req.json()
	const { name, description, properties, id } = body

	try {
		let categoryData: any = { name, description }

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: categoryData,
			include: { properties: true }
		})

		await prisma.property.deleteMany({
			where: {
				categoryId: id,
				NOT: {
					name: { in: properties.map((prop: { name: string }) => prop.name) }
				}
			}
		})

		for (const property of properties) {
			const trimmedValues = property.values
				.split(',')
				.map((value: string) => value.trim())

			const existingProperty = await prisma.property.findFirst({
				where: {
					categoryId: id,
					name: property.name
				}
			})

			if (existingProperty) {
				await prisma.property.update({
					where: { id: existingProperty.id },
					data: { values: trimmedValues }
				})
			} else {
				await prisma.property.create({
					data: {
						name: property.name,
						values: trimmedValues,
						category: { connect: { id } }
					}
				})
			}
		}

		return NextResponse.json(updatedCategory)
	} catch (error) {
		console.error('Error updating category:', error)
		return NextResponse.error()
	}
}
