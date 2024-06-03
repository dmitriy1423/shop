'use client'

import { ExtendedCart } from '@/types'
import { FC } from 'react'

interface SetQuantityProps {
	cartCounter?: boolean
	cartProduct: ExtendedCart
	handleIncrease: () => void
	handleDecrease: () => void
	isLoading?: boolean
}

const btnStyles = 'border-[1.2px] border-slate-300 px-2 rounded'

const SetQuantity: FC<SetQuantityProps> = ({
	cartCounter,
	cartProduct,
	handleIncrease,
	handleDecrease,
	isLoading
}) => {
	return (
		<div className="flex gap-8 items-center">
			{cartCounter ? null : <div className="font-semibold">КОЛИЧЕСТВО:</div>}
			<div className="flex gap-4 items-center text-base">
				<button
					onClick={handleDecrease}
					className={btnStyles}
					disabled={isLoading}
				>
					-
				</button>
				<div>{cartProduct.quantity}</div>
				<button
					onClick={handleIncrease}
					className={btnStyles}
					disabled={isLoading}
				>
					+
				</button>
			</div>
		</div>
	)
}

export default SetQuantity
