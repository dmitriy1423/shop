'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import Container from '@/app/components/ui/Container'
import { useCartStore } from '@/store/cartStore'
import { SafeUser } from '@/types'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { MdArrowBack } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'
import ItemContent from './ItemContent'

interface CartClientProps {
	user: SafeUser | null
}

const CartClient: FC<CartClientProps> = ({ user }) => {
	const { cartItems, getCartItems, isLoading, clearCart } = useCartStore()
	const router = useRouter()

	useEffect(() => {
		getCartItems()
	}, [getCartItems])

	const totalPrice = cartItems.reduce((acc, item) => {
		const discountedPrice = Number(
			(item.product.price * (1 - item.product.discountPercent / 100)).toFixed(2)
		)

		if (item.product.discountPercent > 0) {
			return (acc += discountedPrice * item.quantity)
		}
		return (acc += item.product.price * item.quantity)
	}, 0)

	const createOrder = async () => {
		if (!user) {
			router.push('/login')
			return
		}

		try {
			const response = await axios.post('/api/orders/create', { cartItems })
			const order = response.data

			router.push(`/create-order?orderId=${order.id}`)
		} catch (error) {
			console.error('Error creating order:', error)
		}
	}

	if (isLoading && (!cartItems || cartItems.length === 0)) {
		return <Skeleton count={5} height={15} />
	}

	if (!isLoading && cartItems.length === 0) {
		return (
			<div className="flex flex-col items-center">
				<div className="text-2xl">Корзина пуста</div>
				<div>
					<Link
						href={'/'}
						className="text-slate-500 flex items-center gap-1 mt-2"
					>
						<MdArrowBack />
						<span>Вернуться на главную</span>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Корзина" />
				</div>
				<div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
					<div className="col-span-2 justify-self-start">НАИМЕНОВАНИЕ</div>
					<div className="justify-self-center">СТОИМОСТЬ</div>
					<div className="justify-self-center">КОЛИЧЕСТВО</div>
					<div className="justify-self-end">ОБЩАЯ СТОИМОСТЬ</div>
				</div>
				<div>
					{cartItems &&
						cartItems.map(item => <ItemContent key={item.id} item={item} />)}
				</div>
				<div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
					<div className="w-[90px]">
						<Button
							label="Очистить корзину"
							onClick={clearCart}
							small
							outline
						/>
					</div>
					<div className="text-sm flex flex-col gap-1 items-start">
						<div className="flex justify-between w-full text-base font-semibold">
							<span>Итого</span>
							<span>{totalPrice} руб.</span>
						</div>
						<Button
							label={user ? 'Оформить заказ' : 'Войдите, чтобы продолжить'}
							outline={user ? false : true}
							onClick={createOrder}
						/>
						<Link
							href={'/'}
							className="text-slate-500 flex items-center gap-1 mt-2"
						>
							<MdArrowBack />
							<span>Вернуться на главную</span>
						</Link>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default CartClient
