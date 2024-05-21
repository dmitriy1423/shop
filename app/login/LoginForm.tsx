'use client'

import { SafeUser } from '@/types'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AiOutlineGoogle } from 'react-icons/ai'
import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import Input from '../components/ui/inputs/Input'

interface LoginFormProps {
	currentUser: SafeUser | null
}

const LoginForm: FC<LoginFormProps> = ({ currentUser }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)
		signIn('credentials', {
			...data,
			redirect: false
		})
			.then(response => {
				setIsLoading(false)

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
			.catch(error => {
				toast.error(error.message)
			})
	}

	return (
		<>
			<Heading title="Вход" />
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
				label={isLoading ? 'Loading' : 'Login'}
				onClick={handleSubmit(onSubmit)}
			/>
			<p className="text-sm">
				Нет аккаунта ?{' '}
				<Link className="underline" href={'/register'}>
					Зарегистрироваться
				</Link>
			</p>
		</>
	)
}

export default LoginForm
