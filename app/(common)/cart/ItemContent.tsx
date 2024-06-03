'use client'

import ProductDiscountedPrice from '@/app/components/product/ProductDiscountedPrice'
import SetQuantity from '@/app/components/ui/SetQuantity'
import { useCartStore } from '@/store/cartStore'
import { ExtendedCart } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface ItemContentProps {
	item: ExtendedCart
}

const ItemContent: FC<ItemContentProps> = ({ item }) => {
	const { removeFromCart, increaseQuantity, decreaseQuantity, isLoading } =
		useCartStore()

	const discountedPrice = Number(
		(item.product.price * (1 - item.product.discountPercent / 100)).toFixed(2)
	)

	return (
		<div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
			<div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
				<Link href={`/product/${item.id}`}>
					<div className="relative w-[70px] aspect-square">
						<Image
							src={item.product.images[0]}
							alt={item.product.name}
							fill
							className="object-contain"
						/>
					</div>
				</Link>
				<div className="flex flex-col justify-between">
					<Link href={`/product/${item.id}`}>{item.product.name}</Link>
					<div className="w-[240px]">
						<button
							className="text-slate-500 underline"
							onClick={() => removeFromCart(item.productId)}
						>
							Удалить товар из корзины
						</button>
					</div>
				</div>
			</div>
			<div className="justify-self-center">
				<ProductDiscountedPrice product={item.product} />
			</div>
			<div className="justify-self-center">
				<SetQuantity
					cartCounter
					cartProduct={item}
					handleIncrease={() => {
						increaseQuantity(item.productId)
					}}
					handleDecrease={() => {
						decreaseQuantity(item.productId)
					}}
					isLoading={isLoading}
				/>
			</div>
			<div className="justify-self-end font-semibold">
				{item.product.discountPercent > 0
					? discountedPrice * item.quantity
					: item.product.price * item.quantity}{' '}
				руб.
			</div>
		</div>
	)
}

export default ItemContent
