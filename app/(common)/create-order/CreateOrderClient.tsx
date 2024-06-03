'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import OrderCard from '@/app/components/order/OrderCard'
import Container from '@/app/components/ui/Container'
import { ExtendedOrder, SafeUser } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

interface CreateOrderClientProps {
	orderId: string
	user: SafeUser
}

const CreateOrderClient: FC<CreateOrderClientProps> = ({ orderId, user }) => {
	const router = useRouter()
	const [order, setOrder] = useState<ExtendedOrder | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (orderId) {
			setIsLoading(true)
			axios
				.get(`/api/orders/${orderId}`)
				.then(response => {
					setOrder(response.data)
				})
				.catch(error => {
					console.error('Error fetching order:', error)
				})
				.finally(() => setIsLoading(false))
		}
	}, [orderId])

	const createPayment = async (order: ExtendedOrder) => {
		await axios.post('/api/checkout', { order }).then(result => {
			if (result.data.url) {
				window.location = result.data.url
			}
		})
	}

	const cancelOrder = async (order: ExtendedOrder) => {
		if (!order) return

		setIsLoading(true)
		try {
			await axios.post(`/api/orders/cancel`, { orderId: order.id })
			setOrder(null)
			router.push('/user/orders')
		} catch (error) {
			console.error('Error cancelling order:', error)
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="py-10">
				<Container>
					<div className="mb-5">
						<Heading title="Оформление заказа" />
					</div>
					<div>
						<SubHeading title="Данные о заказе" />
						<Skeleton count={1} height={300} />
					</div>
				</Container>
			</div>
		)
	}

	if (!order) {
		return <div>Заказ не найден</div>
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Оформление заказа" />
				</div>
				<div>
					<SubHeading title="Данные о заказе" />
					<OrderCard order={order} user={user} />
					<div className="max-w-[500px] flex flex-col sm:flex-row gap-5 justify-between">
						<Button
							label="Перейти к оплате"
							onClick={() => createPayment(order)}
						/>
						<Button
							label="Отменить заказ"
							onClick={() => {
								cancelOrder(order)
							}}
							outline
						/>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default CreateOrderClient
