'use client'

import { ExtendedOrderItem } from '@/types'
import { OrderStatus } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import ProductDiscountedPrice from '../product/ProductDiscountedPrice'

interface OrderItemCardProps {
	orderItem: ExtendedOrderItem
	orderStatus: OrderStatus
}

const OrderItemCard: FC<OrderItemCardProps> = ({ orderItem, orderStatus }) => {
	return (
		<div className="p-5">
			<div className="flex flex-col items-center">
				<Link
					href={`/product/${orderItem.productId}`}
					className="relative w-48 h-48 mb-4 aspect-square"
				>
					<Image
						src={orderItem.product.images[0]}
						alt={orderItem.product.name}
						fill
						className="object-contain rounded-t-lg"
					/>
				</Link>
				<Link href={`/product/${orderItem.productId}`} className="f">
					<h3 className="text-lg font-bold mb-2">{orderItem.product.name}</h3>
				</Link>
				<span>Количество: {orderItem.quantity} шт.</span>
				<ProductDiscountedPrice product={orderItem.product} />
				{/* <span>Цена: {order}</span> */}
				{orderStatus === 'COMPLETED' && (
					<Link href={`/product/${orderItem.productId}`}>Оставить отзыв</Link>
				)}
			</div>
		</div>
	)
}

export default OrderItemCard
