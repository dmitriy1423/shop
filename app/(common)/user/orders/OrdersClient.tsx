'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Checkbox from '@/app/components/inputs/Checkbox'
import OrderCard from '@/app/components/order/OrderCard'
import OrderStatusCard from '@/app/components/order/OrderStatusCard'
import Container from '@/app/components/ui/Container'
import Pagination from '@/app/components/ui/Pagination'
import { ExtendedOrder, SafeUser } from '@/types'
import { OrderStatus } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdArrowBack } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

interface OrdersClientProps {
	orders: ExtendedOrder[]
	user: SafeUser
	totalPages: number
}

const OrdersClient: FC<OrdersClientProps> = ({ user, orders, totalPages }) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
		searchParams.get('status')?.split(',') || []
	)

	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			statuses: selectedStatuses,
			sort: searchParams.get('sort') || 'all'
		}
	})

	useEffect(() => {
		setValue('statuses', selectedStatuses)
	}, [selectedStatuses, setValue])

	const createPageURL = (statuses: string[], sort: string) => {
		const params = new URLSearchParams(searchParams)
		if (params.get('page')) {
			params.delete('page')
		}
		if (statuses.length > 0) {
			params.set('status', statuses.join(','))
		} else {
			params.delete('status')
		}
		if (sort === 'all') {
			params.delete('sort')
		} else {
			params.set('sort', sort)
		}

		return `${pathname}?${params.toString()}`
	}

	const handleStatusChange = (status: string, isChecked: boolean) => {
		setSelectedStatuses(prev =>
			isChecked ? [...prev, status] : prev.filter(id => id !== status)
		)
	}

	const searchReviews: SubmitHandler<FieldValues> = async data => {
		const selectedStatuses = getValues('statuses') || []
		router.push(createPageURL(selectedStatuses, data.sort))
	}

	const resetFilters = () => {
		setSelectedStatuses([])
		reset({
			statuses: [],
			sort: 'all'
		})
		router.push(pathname)
	}

	const [isLoading, setIsLoading] = useState(false)

	const statuses = [
		{
			id: '111111111111111',
			value: 'PENDING'
		},
		{
			id: '222222222222222222',
			value: 'PROCESSING'
		},
		{
			id: '333333333333333',
			value: 'SHIPPED'
		},
		{
			id: '44444444444444444',
			value: 'DELIVERED'
		},
		{
			id: '55555555555555',
			value: 'COMPLETED'
		},
		{
			id: '6666',
			value: 'CANCELED'
		}
	]

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Ваши заказы" />
				</div>
				<Link href={`/user`} className="flex items-center gap-1 mb-5">
					<MdArrowBack /> Назад
				</Link>
				<div className="mb-4">
					<SubHeading title="Фильтры" />
				</div>
				<form
					onSubmit={handleSubmit(searchReviews)}
					key={selectedStatuses.join(',')}
					className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-md mb-5"
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div className="flex flex-col gap-2">
							<span className="text-lg font-semibold">Статус</span>
							<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 items-center">
								{statuses.length > 0 &&
									statuses.map(status => (
										<div key={status.id}>
											<Checkbox
												register={register}
												id={`statuses.${status.id}`}
												label={
													<div className="">
														<OrderStatusCard
															status={status.value as OrderStatus}
														/>
													</div>
												}
												defaultChecked={selectedStatuses.includes(status.value)}
												onChange={e =>
													handleStatusChange(status.value, e.target.checked)
												}
											/>
										</div>
									))}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<span className="text-lg font-semibold">Сортировка</span>
							<label htmlFor="sort">Параметр сортировки:</label>
							<select
								id="sort"
								{...register('sort')}
								className="bg-white border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="all">Показать все</option>
								<option value="new">Сначала новые</option>
								<option value="old">Сначала старые</option>
							</select>
						</div>
					</div>

					<div className="max-w-[350px] flex gap-5 justify-between">
						<Button label="Применить" small type="submit" />
						<Button
							label="Сбросить фильтры"
							small
							outline
							onClick={resetFilters}
						/>
					</div>
				</form>
				{isLoading && (
					<div className="flex flex-col gap-4">
						<div className="border p-2">
							<Skeleton count={1} height={130} />
						</div>
						<div className="border p-2">
							<Skeleton count={1} height={130} />
						</div>
						<div className="border p-2">
							<Skeleton count={1} height={130} />
						</div>
					</div>
				)}
				{orders.length > 0 ? (
					<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
						{orders.map(order => (
							<OrderCard key={order.id} order={order} user={user} />
						))}
					</div>
				) : (
					<div className="flex items-center justify-center text-center text-2xl font-semibold">
						Заказы не найдены
					</div>
				)}
				{totalPages > 1 && (
					<div className="mt-5 flex w-full justify-center">
						<Pagination totalPages={totalPages} />
					</div>
				)}
			</Container>
		</div>
	)
}

export default OrdersClient
