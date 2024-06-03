import { OrderStatus } from '@prisma/client'
import { FC } from 'react'
import {
	AiOutlineCheckCircle,
	AiOutlineClockCircle,
	AiOutlineCloseCircle,
	AiOutlineGift,
	AiOutlineLoading3Quarters,
	AiOutlineRocket
} from 'react-icons/ai'

interface OrderStatusCardProps {
	status: OrderStatus
}

const OrderStatusCard: FC<OrderStatusCardProps> = ({ status }) => {
	let statusIcon, statusColor, statusText

	switch (status) {
		case OrderStatus.PENDING:
			statusIcon = <AiOutlineClockCircle className="text-yellow-500" />
			statusColor = 'bg-yellow-100'
			statusText = 'Ожидает оплаты'
			break
		case OrderStatus.PROCESSING:
			statusIcon = <AiOutlineLoading3Quarters className="text-orange-500" />
			statusColor = 'bg-orange-100'
			statusText = 'В обработке'
			break
		case OrderStatus.SHIPPED:
			statusIcon = <AiOutlineRocket className="text-blue-500" />
			statusColor = 'bg-blue-100'
			statusText = 'Доставка'
			break
		case OrderStatus.DELIVERED:
			statusIcon = <AiOutlineGift className="text-green-500" />
			statusColor = 'bg-green-100'
			statusText = 'Доставлен'
			break
		case OrderStatus.COMPLETED:
			statusIcon = <AiOutlineCheckCircle className="text-purple-500" />
			statusColor = 'bg-purple-100'
			statusText = 'Завершён'
			break
		case OrderStatus.CANCELED:
			statusIcon = <AiOutlineCloseCircle className="text-red-500" />
			statusColor = 'bg-red-100'
			statusText = 'Отменён'
			break
		default:
			statusIcon = <AiOutlineClockCircle className="text-gray-500" />
			statusColor = 'bg-gray-100'
			statusText = 'Unknown'
			break
	}

	return (
		<div className={`p-2 flex items-center gap-2 rounded-md ${statusColor}`}>
			<div className="text-xl">{statusIcon}</div>
			<div className="text-sm font-semibold">{statusText}</div>
		</div>
	)
}

export default OrderStatusCard
