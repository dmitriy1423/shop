'use client'

import firebaseApp from '@/libs/firebase'
import { ExtendedCategory } from '@/types'
import { JsonValue } from '@prisma/client/runtime/library'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
	ChangeHandler,
	FieldValues,
	SubmitHandler,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdUpload } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'
import { ReactSortable } from 'react-sortablejs'
import Button from '../buttons/Button'
import Checkbox from '../inputs/Checkbox'
import Input from '../inputs/Input'
import TextArea from '../inputs/TextArea'
import Spinner from './Spinner'

interface ProductFormProps {
	id?: string
	name?: string
	description?: string
	price?: number
	discountPercent?: number
	images?: string[]
	categoryId?: string | null
	properties?: JsonValue
}

const ProductForm: FC<ProductFormProps> = ({
	id,
	name: existingName,
	description: existingDescription,
	price: existingPrice,
	discountPercent: existingDiscountPercent,
	images: existingImages,
	categoryId: existingCategoryId,
	properties: existingProperties
}) => {
	const router = useRouter()
	const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [categories, setCategories] = useState<ExtendedCategory[]>([])

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		getValues,
		control,
		trigger,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: existingName || '',
			description: existingDescription || '',
			price: existingPrice || 0,
			discountPercent: existingDiscountPercent || 0,
			images: existingImages || [],
			categoryId: existingCategoryId || '',
			properties: existingProperties || {}
		}
	})

	useEffect(() => {
		setIsCategoriesLoading(true)
		axios
			.get('/api/categories')
			.then(result => {
				setCategories(result.data)
			})
			.finally(() => setIsCategoriesLoading(false))
	}, [])

	useEffect(() => {
		if (existingCategoryId) {
			axios.get(`/api/categories/${existingCategoryId}`).then(result => {
				setValue('categoryId', result.data.id)
			})
		}
	}, [existingCategoryId, setValue, getValues('properties')])

	const saveProduct: SubmitHandler<FieldValues> = async data => {
		if (id) {
			await axios.put('/api/products', { ...data, id }).then(res => {
				router.push('/admin/manage-products')
				toast.success('Товар отредактирован')
			})
		} else {
			await axios.post('/api/products', data).then(res => {
				router.push('/admin/manage-products')
				toast.success('Товар создан')
			})
		}
	}

	const uploadImages: ChangeHandler = async e => {
		const uploadedFiles = e.target.files

		if (uploadedFiles && uploadedFiles.length > 0) {
			setIsUploading(true)
			const imagePaths = [...getValues('images')]

			for (let i = 0; i < uploadedFiles.length; i++) {
				const file = uploadedFiles[i]
				const fileName = new Date().getTime() + '-' + file.name
				const storage = getStorage(firebaseApp)
				const storageRef = ref(storage, `images/${fileName}`)

				try {
					const snapshot = await uploadBytes(storageRef, file)
					const downloadURL = await getDownloadURL(snapshot.ref)
					imagePaths.push(downloadURL)
					toast.success('Изображение загружено')
				} catch (error) {
					toast.error('Ошибка')
					console.error('Error uploading image:', error)
				}
			}

			setValue('images', imagePaths)
			setIsUploading(false)
		}
	}

	function updateImagesOrder(images: any) {
		setValue('images', images)
	}

	const productImages = watch('images')
	const category = watch('categoryId')

	const propertiesToFill: any[] = []
	if (categories.length > 0 && category) {
		let catInfo = categories.find(({ id }) => id === category)
		propertiesToFill.push(...(catInfo?.properties as []))
	}

	return (
		<div className="max-w-[700px] py-4">
			<form
				onSubmit={handleSubmit(saveProduct)}
				className="flex flex-col gap-5"
			>
				<Input
					id="name"
					register={register('name', {
						required: { value: true, message: 'Наименование обязательно' }
					})}
					label="Наименование"
					type="text"
					errors={errors}
				/>

				<div className="flex flex-col">
					<label htmlFor="category" className="font-bold text-2xl">
						Категория
					</label>
					{isCategoriesLoading ? (
						<Skeleton count={3} height={25} />
					) : (
						<select
							{...register('categoryId', {
								required: { value: true, message: 'ffffff' }
							})}
							id="category"
							className={`w-full p-2 mb-4 border ${
								errors.categoryId ? 'border-red-500' : 'border-gray-300'
							} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
							required
						>
							<option value={''}>Категория не выбрана</option>
							{categories.length > 0 &&
								categories.map(category => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
						</select>
					)}
					{propertiesToFill.length > 0 && (
						<h2 className="text-2xl font-bold">Параметры</h2>
					)}
					{isCategoriesLoading ? (
						<Skeleton count={3} height={25} />
					) : (
						propertiesToFill.length > 0 &&
						propertiesToFill.map((p, index) => (
							<div className="flex gap-4" key={index}>
								<label className="text-xl fon-bold">
									{p.name[0].toUpperCase() + p.name.slice(1)}
								</label>
								<div>
									<select
										{...register(`properties[${p.name}]`)}
										defaultValue={getValues(`properties[${p.name}]`)}
										className="max-w-[250px] mb-4 border rounded-md"
									>
										{p.values.map((v: string, idx: number) => (
											<option key={idx} value={v}>
												{v}
											</option>
										))}
									</select>
								</div>
							</div>
						))
					)}
				</div>

				<h2 className="text-2xl font-bold">Фотографии</h2>

				<div className="mb-2 flex flex-wrap gap-1 relative">
					<ReactSortable
						className="flex  gap-1"
						list={productImages}
						setList={updateImagesOrder}
					>
						{!!productImages?.length &&
							productImages.map((link: string) => (
								<div
									key={link}
									className="h-24 w-24 bg-white p-4 shadow-sm rounded-sm border-gray-200"
								>
									<img
										src={link}
										alt=""
										className="rounded-lg object-contain aspect-square"
									/>
								</div>
							))}
					</ReactSortable>
					{isUploading && (
						<div className="h-24 p-1 flex items-center">
							<Spinner />
						</div>
					)}
					<label className="w-24 h-24 cursor-pointer border text-center text-sm flex flex-col items-center justify-center gap-1 text-primary rounded-sm bg-white shadow-sm border-primary">
						<MdUpload />
						<div>Добавить изображение</div>
						<input
							type="file"
							className="hidden"
							{...register('images')}
							onChange={uploadImages}
						/>
					</label>
				</div>
				<TextArea
					id="description"
					register={register('description', {
						required: { value: true, message: 'Описание обязательно' }
					})}
					label="Описание"
					errors={errors}
				/>
				<Input
					id="price"
					register={register('price', {
						required: { value: true, message: 'Стоимость обязательна' },
						min: { value: 0, message: 'Введите значение не менее 0' }
					})}
					label="Стоимость, руб."
					type="number"
					errors={errors}
				/>

				<Input
					id="discountPercent"
					register={register('discountPercent', {
						min: { value: 0, message: 'Скидка не может быть меньше 0%' },
						max: {
							value: 100,
							message: 'Скидка не может быть больше 100%'
						}
					})}
					label="Скидка, %"
					type="number"
					errors={errors}
				/>

				<div className="flex items-center gap-4">
					<Button type="submit" label="Сохранить" />
					<Button
						type="button"
						label="Назад"
						outline
						onClick={() => router.back()}
					/>
				</div>
			</form>
		</div>
	)
}

export default ProductForm
