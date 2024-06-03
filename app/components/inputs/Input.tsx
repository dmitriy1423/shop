'use client'

import { FC, ReactNode } from 'react'
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'

interface InputProps {
	id: string
	label: string
	type?: string
	disabled?: boolean
	required?: boolean
	register: UseFormRegisterReturn
	errors: FieldErrors
	onChange?: (e: any) => void
}

const Input: FC<InputProps> = ({
	id,
	label,
	type,
	disabled,
	required,
	register,
	errors,
	onChange
}) => {
	return (
		<div className="w-full relative">
			<input
				autoComplete="off"
				id={id}
				disabled={disabled}
				{...register}
				placeholder=""
				type={type}
				required={required}
				onChange={onChange}
				className={`peer w-full px-4 py-2 pt-6 outline-none bg-white font-light border-2 rounded-md transition appearance-auto disabled:opacity-70 disabled:cursor-not-allowed ${
					errors[id] ? 'border-rose-400' : 'border-blue-300'
				} ${errors[id] ? 'focus:border-rose-400' : 'focus:border-blue-300'}`}
			/>
			<label
				htmlFor={id}
				className={`absolute cursor-text text-sm duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
					errors[id] ? 'text-rose-500' : 'text-blue-400'
				}`}
			>
				{label}
			</label>
			{errors[id] && (
				<p className="text-rose-500 mt-2">{errors[id]?.message as ReactNode}</p>
			)}
		</div>
	)
}

export default Input
