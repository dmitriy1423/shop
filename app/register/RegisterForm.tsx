'use client'

import { SafeUser } from '@/types'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../components/ui/Heading'
import Button from '../components/ui/Button'
import { AiOutlineGoogle } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import Input from '../components/ui/inputs/Input'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

interface RegisterFormProps {
	currentUser: SafeUser | null
}

const RegisterForm: FC<RegisterFormProps> = ({ currentUser }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)

		axios
			.post('/api/register', data)
			.then(() => {
				toast.success('Account created')

				signIn('credentials', {
					redirect: false,
					email: data.email,
					password: data.password
				}).then(response => {
					if (response?.ok) {
						/* router.push('/cart')
						router.refresh() */
						router.replace('/')
						toast.success('Logged In')
					}

					if (response?.error) {
						toast.error(response.error)
					}
				})
			})
			.catch(() => toast.error('Something went wrong'))
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<>
			<Heading title="Регистрация" />
			<Button
				outline
				label="Войти с помощью Goggle"
				icon={AiOutlineGoogle}
				onClick={() => {
					signIn('google')
				}}
			/>
			<hr className="bg-slate-300 w-full h-px" />
			<Input
				id="name"
				label="Name"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<Input
				id="email"
				label="Email"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
			<Input
				id="password"
				label="Password"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
				type="password"
			/>
			<Button
				label={isLoading ? 'Loading' : 'Sign Up'}
				onClick={handleSubmit(onSubmit)}
			/>
			<p className="text-sm">
				Зарегистрированы ?{' '}
				<Link className="underline" href={'/login'}>
					Войти
				</Link>
			</p>
		</>
	)
}

export default RegisterForm
