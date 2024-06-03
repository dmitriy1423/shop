'use client'

import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { CiShoppingCart } from 'react-icons/ci'

const CartCount = () => {
	const { getTotalQuantity } = useCartStore()
	const totalQty = getTotalQuantity()

	return (
		<Link
			href={'/cart'}
			className="relative cursor-pointer"
			aria-label="Корзина"
		>
			<div className="text-3xl">
				<CiShoppingCart />
			</div>
			{totalQty > 0 ? (
				<span className="absolute top-[-10px] right-[-10px] bg-blue-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-sm">
					{totalQty}
				</span>
			) : null}
		</Link>
	)
}

export default CartCount
