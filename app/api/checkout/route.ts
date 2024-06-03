import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import Stripe from 'stripe'
import { getCurrentUser } from '@/actions/getCurrentUser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2024-04-10'
})

export async function POST(req: NextRequest) {
	const user = await getCurrentUser()
	if (!user) return NextResponse.json({ message: 'User not found' })

	const body = await req.json()

	const { order } = body

	let line_items = []

	for (const item of order.items) {
		line_items.push({
			quantity: item.quantity,
			price_data: {
				currency: 'RUB',
				unit_amount: item.price * 100,
				product_data: {
					name: item.product.name
				}
			}
		})
	}

	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: 'payment',
		customer_email: user.email as string,
		success_url: process.env.NEXTAUTH_URL + '/user/orders?success=true',
		cancel_url: process.env.NEXTAUTH_URL + '/user/orders?cancelled=true',
		metadata: { orderId: order.id }
	})

	return NextResponse.json({
		url: session.url
	})
}
