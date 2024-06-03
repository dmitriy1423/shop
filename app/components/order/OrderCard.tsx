'use client'

import { ExtendedOrder, SafeUser } from '@/types'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { MdArrowForward } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'
import OrderStatusCard from './OrderStatusCard'

interface OrderCardProps {
	order: ExtendedOrder
	user: SafeUser
	onOrderChange?: () => void
}

const OrderCard: FC<OrderCardProps> = ({ user, order, onOrderChange }) => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const [isOpenDetails, setIsOpenDetails] = useState(false)

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
		} catch (error) {
			toast.error('Ошибка при отмене заказа')
			console.error('Error cancelling order:', error)
		} finally {
			setIsLoading(false)
			onOrderChange && onOrderChange()
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

	const handleMoreDetails = () => {
		setIsOpenDetails(!isOpenDetails)
	}

	if (isLoading)
		return (
			<div className="border p-4 rounded-lg shadow-sm mb-4">
				<div className="mb-2">
					<span className="font-semibold">Order ID:</span>{' '}
					<Skeleton count={1} height={10} />
				</div>
				<div className="mb-2">
					<span className="font-semibold">Date:</span>{' '}
					<Skeleton count={1} height={10} />
				</div>
				<div className="mb-2">
					<span className="font-semibold">Products:</span>
					<Skeleton count={3} height={10} />
				</div>
				<div className="mb-2">
					<span className="font-semibold">Total Amount:</span> $
					<Skeleton count={1} height={10} />
				</div>
				<div className="mb-2">
					<span className="font-semibold">Delivery Status:</span>{' '}
					<Skeleton count={1} height={10} />
				</div>
			</div>
		)

	return (
		<div className="flex flex-col justify-between bg-white border p-4 rounded-lg shadow-sm mb-4">
			<div>
				<div className="mb-2 flex flex-col">
					<span className="font-semibold">Дата создания заказа: </span>{' '}
					{new Date(order.createdAt).toLocaleString()}
					{new Date(order.updatedAt).toLocaleString() !==
						new Date(order.createdAt).toLocaleString() && (
						<p className="text-sm text-gray-500">
							Изменено: {new Date(order.updatedAt).toLocaleString()}
						</p>
					)}
				</div>
				<div className="mb-2">
					<span className="font-semibold">Содержимое заказа:</span>
					<ul className="ml-4 max-h-[225px] overflow-auto">
						{order.items.map(item => (
							<li key={item.id} className="flex items-center gap-4">
								<div className="relative w-24 h-24 mb-4 aspect-square">
									<Image
										src={item.product.images[0]}
										alt={item.product.name}
										fill
										className="object-contain rounded-t-lg"
									/>
								</div>
								<div className="flex flex-col">
									<span>
										{item.product.name} x {item.quantity}
									</span>
									<span className="">{Math.round(item.price)} руб.</span>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div>
				<div className="mb-2">
					<span className="font-semibold">Итого: </span>
					{Math.round(order.amount)} руб.
				</div>
				<div className="mb-2 flex items-center gap-2">
					<OrderStatusCard status={order.deliveryStatus} />
				</div>
				<Link href={`/order/${order.id}`} className="flex items-center gap-1">
					Подробнее <MdArrowForward />{' '}
				</Link>
			</div>
		</div>
	)
}

export default OrderCard
