'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import OrderItemsGrid from '@/app/components/order/OrderItemsGrid'
import OrderStatusCard from '@/app/components/order/OrderStatusCard'
import Container from '@/app/components/ui/Container'
import { ExtendedOrder } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'

interface OrderClientProps {
	order: ExtendedOrder
}

const Horizontal = () => {
	return <hr className="my-2" />
}

const OrderClient: FC<OrderClientProps> = ({ order }) => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const totalQty = order.items.reduce((acc, item) => {
		return (acc += item.quantity)
	}, 0)

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
			toast.success('Заказ успешно отменён')
			router.refresh()
		} catch (error) {
			toast.error('Ошибка при отмене заказа')
			console.error('Error cancelling order:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const repeatOrder = async (order: ExtendedOrder) => {
		setIsLoading(true)
		try {
			await axios.post('/api/cart/repeat-order', { orderId: order.id })
			toast.success('Заказ добавлен в корзину')
			router.push('/cart')
		} catch (error) {
			toast.error('Ошибка при повторе заказа')
			console.error('Error repeating order:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const deleteOrder = async (order: ExtendedOrder) => {
		setIsLoading(true)
		try {
			await axios.delete(`/api/orders/${order.id}`).then(() => {
				toast.success('Заказ успешно удален')
				router.replace('/user/orders')
			})
		} catch (error) {
			toast.error('Ошибка при удалении заказа')
			console.error('Error deleting order:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Детали заказа" />
				</div>
				<div className="bg-white rounded-lg p-5">
					<div>
						<div className="mb-2 flex flex-col">
							<p>
								<span className="font-semibold">Дата создания заказа: </span>{' '}
								{new Date(order.createdAt).toLocaleString()}
							</p>
							{new Date(order.updatedAt).toLocaleString() !==
								new Date(order.createdAt).toLocaleString() && (
								<p className="text-sm text-gray-500">
									Изменено: {new Date(order.updatedAt).toLocaleString()}
								</p>
							)}
						</div>
						<div className="max-w-[260px]">
							<OrderStatusCard status={order.deliveryStatus} />
						</div>
					</div>
					<Horizontal />
					<div>Количество товаров в заказе: {totalQty} шт.</div>
					<div>На общую сумму {Math.round(order.amount)} руб.</div>
					<OrderItemsGrid
						orderItems={order.items}
						orderStatus={order.deliveryStatus}
					/>
					<div className="max-w-[300px]">
						{!order.isPaid && order.deliveryStatus !== 'CANCELED' && (
							<Button label="Оплатить" onClick={() => createPayment(order)} />
						)}
						{order.deliveryStatus !== 'CANCELED' &&
							order.deliveryStatus !== 'COMPLETED' && (
								<Button
									label="Отменить заказ"
									onClick={() => {
										cancelOrder(order)
									}}
									outline
								/>
							)}
						{(order.deliveryStatus === 'CANCELED' ||
							order.deliveryStatus === 'COMPLETED') && (
							<Button
								label="Повторить заказ"
								onClick={() => repeatOrder(order)}
							/>
						)}
						{(order.deliveryStatus === 'PENDING' ||
							order.deliveryStatus === 'COMPLETED' ||
							order.deliveryStatus === 'CANCELED') && (
							<Button
								label="Удалить заказ"
								onClick={() => deleteOrder(order)}
								outline
							/>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}

export default OrderClient
