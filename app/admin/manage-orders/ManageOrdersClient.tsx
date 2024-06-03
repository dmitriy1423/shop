'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import OrderStatusCard from '@/app/components/order/OrderStatusCard'
import { ExtendedOrder } from '@/types'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'

const ManageOrdersClient: FC = () => {
	const [orders, setOrders] = useState<ExtendedOrder[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(true)
		axios
			.get('/api/orders')
			.then(response => {
				setOrders(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [])

	const updateOrderStatus = async (orderId: string, status: string) => {
		try {
			await axios.put('/api/orders/update-status', { orderId, status })
			toast.success(`Order status updated to ${status}`)
			setOrders((prevOrders: any) =>
				prevOrders.map((order: ExtendedOrder) =>
					order.id === orderId ? { ...order, deliveryStatus: status } : order
				)
			)
		} catch (error) {
			toast.error('Error updating order status')
		}
	}

	let rows: any = []

	if (orders) {
		rows = orders.map(order => {
			return {
				id: order.id,
				customer: order.user.name,
				paymentStatus: order.isPaid,
				date: new Date(order.createdAt).toLocaleString(),
				deliveryStatus: order.deliveryStatus,
				amount: Math.round(order.amount)
			}
		})
	}

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 220 },
		{ field: 'customer', headerName: 'Имя покупателя', width: 130 },
		{
			field: 'paymentStatus',
			headerName: 'Статус оплаты',
			width: 130,
			renderCell: params => {
				return <div>{params.row.paymentStatus ? 'да' : 'нет'}</div>
			}
		},
		{
			field: 'deliveryStatus',
			headerName: 'Статус заказа',
			width: 170,
			renderCell: params => {
				return <OrderStatusCard status={params.row.deliveryStatus} />
			}
		},
		{ field: 'amount', headerName: 'Стоимость', width: 130 },
		{ field: 'date', headerName: 'Дата создания заказа', width: 170 },
		{
			field: 'action',
			headerName: 'Действия',
			width: 180,
			renderCell: params => {
				const order = params.row

				return (
					<div className="flex gap-2">
						{order.deliveryStatus === 'PROCESSING' &&
							order.deliveryStatus !== 'CANCELED' && (
								<Button
									label="Shipped"
									onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
									small
								/>
							)}
						{order.deliveryStatus === 'SHIPPED' &&
							order.deliveryStatus !== 'CANCELED' && (
								<Button
									label="Delivered"
									onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
									small
								/>
							)}
						{order.deliveryStatus === 'DELIVERED' &&
							order.deliveryStatus !== 'CANCELED' && (
								<Button
									label="Completed"
									onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
									small
								/>
							)}
					</div>
				)
			}
		}
	]

	return (
		<div className="max-w-[1150px] m-auto text-xl">
			<div className="mb-4 mt-8">
				<Heading title="Список заказов" center />
			</div>
			{isLoading && (
				<div className="py-4">
					<Skeleton count={10} />
				</div>
			)}
			{orders.length > 0 && (
				<div style={{ height: 600, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 }
							}
						}}
						pageSizeOptions={[9, 20]}
						checkboxSelection
						disableRowSelectionOnClick
					/>
				</div>
			)}
		</div>
	)
}

export default ManageOrdersClient
