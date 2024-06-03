'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Input from '@/app/components/inputs/Input'
import OrderCard from '@/app/components/order/OrderCard'
import ProductReviewCart from '@/app/components/product/ProductReviewCart'
import Avatar from '@/app/components/ui/Avatar'
import Container from '@/app/components/ui/Container'
import firebaseApp from '@/libs/firebase'
import { ExtendedOrder, ExtendedReview, SafeUser } from '@/types'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdArrowForward } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

interface UserClientProps {
	user: SafeUser
	orders: ExtendedOrder[]
	reviews: ExtendedReview[]
}

const UserClient: FC<UserClientProps> = ({ user, orders, reviews }) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [avatar, setAvatar] = useState<File | null>(null)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: user.name,
			email: user.email,
			image: user.image || ''
		}
	})

	useEffect(() => {
		setValue('name', user.name)
		setValue('email', user.email)
		setValue('image', user.image)
	}, [setValue, user])

	const uploadImageToFirebase = async (file: File): Promise<string> => {
		const storage = getStorage(firebaseApp)
		const fileName = `${new Date().getTime()}-${file.name}`
		const storageRef = ref(storage, `images/${fileName}`)

		const snapshot = await uploadBytes(storageRef, file)
		const downloadURL = await getDownloadURL(snapshot.ref)

		return downloadURL
	}

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)

		try {
			let avatarUrl = user.image

			if (avatar) {
				avatarUrl = await uploadImageToFirebase(avatar)
				setValue('image', avatarUrl)
			}

			const updatedUserData = {
				...data,
				image: avatarUrl
			}

			await axios.put('/api/user', updatedUserData)

			toast.success('Данные сохранены')
			router.replace('/user')
			router.refresh()
		} catch (error) {
			toast.error('Ошибка при сохранении данных')
			console.error('Error saving data:', error)
		} finally {
			setIsLoading(false)
			setIsEditing(false)
		}
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Кабинет пользователя" />
				</div>
				{isLoading && (
					<div className="max-w-[500px] bg-white p-6 rounded-lg shadow-lg mb-5">
						<div className="flex items-center mb-4">
							<Skeleton count={1} height={90} />
						</div>
					</div>
				)}

				{user && !isLoading && (
					<div className="max-w-[500px] bg-white p-6 rounded-lg shadow-lg mb-5">
						<div className="flex items-center mb-4">
							<Avatar src={user.image} />
							<div className="ml-4">
								<h2 className="text-2xl font-semibold">{user.name}</h2>
								<p className="text-gray-600">{user.email}</p>
							</div>
						</div>
						{isEditing ? (
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								<div>
									<Input
										id="name"
										register={register('name', {
											required: { value: true, message: 'Имя обязательно' }
										})}
										label="Имя"
										type="text"
										errors={errors}
									/>
								</div>
								<div>
									<Input
										id="email"
										register={register('email', {
											required: { value: true, message: 'E-mail обязателен' }
										})}
										label="E-mail"
										type="email"
										errors={errors}
									/>
								</div>
								<div>
									<Input
										id="password"
										register={register('password', {
											required: { value: true, message: 'Пароль обязателен' },
											minLength: { value: 6, message: 'Не менее 6 символов' }
										})}
										label="Пароль"
										type="password"
										errors={errors}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Аватар
									</label>
									<input
										type="file"
										{...register('image')}
										onChange={e =>
											setAvatar(e.target.files ? e.target.files[0] : null)
										}
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
									/>
								</div>
								<div className="flex gap-5 items-center">
									<Button label="Сохранить" type="submit" />
									<Button
										label="Отмена"
										type="button"
										onClick={() => setIsEditing(false)}
										outline
									/>
								</div>
							</form>
						) : (
							<Button
								label="Редактировать"
								type="button"
								onClick={() => setIsEditing(true)}
							/>
						)}
					</div>
				)}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
					{orders.length > 0 && (
						<div className="">
							<div className="mb-5">
								<SubHeading title="Ваши заказы" />
							</div>
							<Link
								href={`/user/orders`}
								className="flex items-center gap-2 underline mb-2"
							>
								Подробнее <MdArrowForward />
							</Link>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								{orders.map(order => (
									<OrderCard key={order.id} order={order} user={user} />
								))}
							</div>
						</div>
					)}
					{reviews.length > 0 && (
						<div className="">
							<div className="mb-5">
								<SubHeading title="Ваши отзывы" />
							</div>
							<Link
								href={`/user/reviews`}
								className="flex items-center gap-2 underline mb-2"
							>
								Подробнее <MdArrowForward />
							</Link>
							<div className="grid grid-cols-1 gap-5">
								{reviews.map(review => (
									<ProductReviewCart
										key={review.id}
										product={review.product}
										review={review}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</Container>
		</div>
	)
}

export default UserClient
