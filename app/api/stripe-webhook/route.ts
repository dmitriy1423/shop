import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2024-04-10'
})

export async function POST(req: NextRequest) {
	const body = await req.text()
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
	const sig = headers().get('stripe-signature') as string

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
	} catch (err: any) {
		return NextResponse.json(`Webhook Error: ${err}`, {
			status: 400
		})
	}

	switch (event.type) {
		case 'checkout.session.completed':
			const data = event.data.object
			const orderId = data.metadata?.orderId
			const paid = data.payment_status === 'paid'

			if (orderId && paid) {
				await prisma.order.update({
					where: { id: orderId },
					data: {
						isPaid: true,
						deliveryStatus: 'PROCESSING'
					}
				})
			}
			break
		default:
			console.log(`Unhandled event type ${event.type}`)
	}

	return NextResponse.json({ received: true })
}
