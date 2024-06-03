'use client'

import { FC } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

interface CheckboxProps {
	id: string
	label: string | JSX.Element
	disabled?: boolean
	register: UseFormRegister<FieldValues>
	defaultChecked?: boolean
	checked?: boolean
	value?: string
	onChange?: (e: any) => void
}

const Checkbox: FC<CheckboxProps> = ({
	id,
	label,
	register,
	disabled,
	defaultChecked,
	checked,
	value,
	onChange
}) => {
	return (
		<div className="w-full flex flex-row gap-2 items-center">
			<input
				type="checkbox"
				id={id}
				disabled={disabled}
				{...register(id)}
				onChange={onChange}
				checked={checked}
				value={value}
				defaultChecked={defaultChecked}
				placeholder=""
				className="cursor-pointer"
			/>
			<label htmlFor={id} className="font-medium cursor-pointer">
				{label}
			</label>
		</div>
	)
}

export default Checkbox
