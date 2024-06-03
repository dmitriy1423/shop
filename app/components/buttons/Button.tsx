'use client'

import { FC, MouseEvent } from 'react'
import { IconType } from 'react-icons'

interface ButtonProps {
	label?: string
	disabled?: boolean
	outline?: boolean
	small?: boolean
	custom?: string
	icon?: IconType
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void
	type?: 'button' | 'submit' | 'reset'
	ariaLabel?: string
	maxWidth?: number
}

const Button: FC<ButtonProps> = ({
	label,
	disabled,
	outline,
	small,
	custom,
	icon: Icon,
	onClick,
	type,
	ariaLabel,
	maxWidth
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hover:bg-opacity-80 transition w-full border border-transparent flex items-center justify-center gap-2 ${
				outline ? 'bg-white' : 'bg-blue-700'
			} ${outline ? 'text-blue-700' : 'text-white'} ${
				small ? 'text-sm font-medium' : 'text-base font-semibold'
			} ${small ? 'py-1 px-3' : 'py-3 px-4'} ${custom ? custom : ''} ${
				maxWidth ? `max-w-[${maxWidth}px]` : ''
			}`}
			type={type}
			aria-label={ariaLabel}
		>
			{Icon && <Icon size={24} />}
			{label}
		</button>
	)
}

export default Button
