'use client'

import { ExtendedOrderItem } from '@/types'
import { RevealWrapper } from 'next-reveal'
import { FC } from 'react'
import OrderItemCard from './OrderItemCard'
import { OrderStatus } from '@prisma/client'

interface OrderItemsGridProps {
	orderItems: ExtendedOrderItem[]
	orderStatus: OrderStatus
}

const OrderItemsGrid: FC<OrderItemsGridProps> = ({
	orderItems,
	orderStatus
}) => {
	return (
		<>
			{orderItems.length > 0 && (
				<div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
					{orderItems.map((orderItem, index) => (
						<RevealWrapper delay={index * 50} key={orderItem.id}>
							<OrderItemCard orderItem={orderItem} orderStatus={orderStatus} />
						</RevealWrapper>
					))}
				</div>
			)}
		</>
	)
}

export default OrderItemsGrid
