'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AiOutlineGoogle } from 'react-icons/ai'
import { MdArrowBack } from 'react-icons/md'
import Button from '../components/buttons/Button'
import Heading from '../components/heading/Heading'
import Input from '../components/inputs/Input'
import { SafeUser } from '@/types'

interface LoginFormProps {
	user: SafeUser | null
}

const LoginForm: FC<LoginFormProps> = ({ user }) => {
	const router = useRouter()

	useEffect(() => {
		if (user) router.replace('/')
	}, [user, router])

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
					router.replace('/')
					router.refresh()
					toast.success('Вход выполнен')
				}

				if (response?.error) {
					toast.error(response.error)
				}
			})
			.catch(error => {
				toast.error(error.message)
			})
	}

	if (user) return null

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
				register={register('email', {
					required: { value: true, message: 'Поле обязательно' }
				})}
				errors={errors}
				type="email"
			/>
			<Input
				id="password"
				label="Пароль"
				disabled={isLoading}
				register={register('password', {
					required: { value: true, message: 'Поле обязательно' },
					minLength: { value: 6, message: 'Минимум 6 символов' }
				})}
				errors={errors}
				type="password"
			/>
			<Button
				label={isLoading ? 'Загрузка' : 'Войти'}
				onClick={handleSubmit(onSubmit)}
				disabled={isLoading}
			/>
			<p className="text-sm">
				Нет аккаунта ?{' '}
				<Link className="underline" href={'/register'}>
					Зарегистрироваться
				</Link>
			</p>
			<p className="text-sm">
				<Link href={'/'} className="flex items-center gap-1 underline">
					<MdArrowBack /> Вернуться на главную
				</Link>
			</p>
		</>
	)
}

export default LoginForm
