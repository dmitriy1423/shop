'use client'

import axios from 'axios'
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

interface RegisterFormProps {
	user: SafeUser | null
}

const RegisterForm: FC<RegisterFormProps> = ({ user }) => {
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
			name: '',
			email: '',
			password: ''
		}
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)

		axios
			.post('/api/register', data)
			.then(response => {
				if (response.data.message) {
					toast.error(response.data.message)
					return
				}
				toast.success('Профиль создан')

				signIn('credentials', {
					redirect: false,
					email: data.email,
					password: data.password
				}).then(response => {
					if (response?.ok) {
						router.replace('/')
						toast.success('Вход выполнен')
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

	if (user) return null

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
				label="Имя"
				disabled={isLoading}
				register={register('name', {
					required: { value: true, message: 'Поле обязательно' }
				})}
				errors={errors}
				type="text"
			/>
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
				label={isLoading ? 'Загрузка' : 'Зарегистрироваться'}
				onClick={handleSubmit(onSubmit)}
				disabled={isLoading}
			/>
			<p className="text-sm">
				Зарегистрированы ?{' '}
				<Link className="underline" href={'/login'}>
					Войти
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

export default RegisterForm
