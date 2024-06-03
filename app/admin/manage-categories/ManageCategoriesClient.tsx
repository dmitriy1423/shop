'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import Input from '@/app/components/inputs/Input'
import TextArea from '@/app/components/inputs/TextArea'
import { ExtendedCategory } from '@/types'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
	FieldValues,
	SubmitHandler,
	useFieldArray,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdDelete, MdEdit } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

const ManageCategoriesClient: FC = () => {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		control,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			description: '',
			properties: []
		}
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'properties'
	})

	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [categories, setCategories] = useState<ExtendedCategory[]>([])
	const [editedCategory, setEditedCategory] = useState<ExtendedCategory | null>(
		null
	)

	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchCategories = () => {
		setIsLoading(true)
		axios
			.get('/api/categories')
			.then(response => {
				setCategories(response.data)
			})
			.finally(() => setIsLoading(false))
	}

	const saveCategory: SubmitHandler<FieldValues> = async data => {
		if (editedCategory) {
			await axios
				.put('/api/categories', { ...data, id: editedCategory.id })
				.then(response => {
					toast.success('Category edited')
					setEditedCategory(null)
				})
		} else {
			await axios.post('/api/categories', data).then(response => {
				toast.success('Category created')
			})
		}

		setValue('name', '')
		setValue('description', '')
		setValue('properties', [])
		fetchCategories()
	}

	const editCategory = (category: ExtendedCategory) => {
		setEditedCategory(category)
		setValue('name', category.name)
		setValue('description', category.description)

		if (category.properties) {
			const formattedProperties = category.properties.map(
				({ name, values }) => ({
					name,
					values: values.join(',')
				})
			)
			setValue('properties', formattedProperties)
		} else {
			setValue('properties', [])
		}
	}

	const deleteCategory = (category: ExtendedCategory) => {
		if (!category.products) {
			return toast.error('xxxxxxxxx')
		}

		axios.delete(`/api/categories/${category.id}`).then(response => {
			toast.success('Category deleted')
			fetchCategories()
		})
	}

	const addProperty = () => {
		append({ name: '', values: '' })
	}

	const handlePropertyNameChange = (index: number, newName: string) => {
		setValue(`properties.${index}.name`, newName)
	}

	const handlePropertyValuesChange = (index: number, newValues: string) => {
		setValue(`properties.${index}.values`, newValues)
	}

	const removeProperty = (indexToRemove: number) => {
		remove(indexToRemove)
	}

	let rows: any = []

	if (categories) {
		rows = categories.map(category => {
			return {
				id: category.id,
				name: category.name,
				description: category.description,
				properties: category.properties
			}
		})
	}

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 220 },
		{ field: 'name', headerName: 'Наименование', width: 130 },
		{ field: 'description', headerName: 'Описание', width: 300 },
		{
			field: 'action',
			headerName: 'Действия',
			width: 400,
			renderCell: params => {
				return (
					<div className="flex justify-between items-center gap-4 w-full h-full">
						<Button
							label="Редактировать"
							icon={MdEdit}
							onClick={() => editCategory(params.row)}
							small
						/>
						<Button
							label="Удалить"
							icon={MdDelete}
							onClick={() => deleteCategory(params.row)}
							small
						/>
					</div>
				)
			}
		}
	]

	return (
		<div className="mt-10">
			<Heading title="Категории" />
			<div className="mt-4">
				{editedCategory
					? `Редактирование категории "${editedCategory.name}"`
					: 'Создание категории'}
			</div>
			<div className="max-w-[700px] py-4">
				<form onSubmit={handleSubmit(saveCategory)}>
					<div className="flex flex-col gap-4">
						<Input
							id="name"
							register={register('name', {
								required: { value: true, message: 'Наименование обязательно' }
							})}
							label="Наименование"
							type="text"
							errors={errors}
						/>
						<TextArea
							id="description"
							register={register('description', {
								required: { value: true, message: 'Описание обязательно' }
							})}
							label="Описание"
							errors={errors}
						/>
					</div>

					<div className="mb-2">
						<h2 className="text-2xl font-bold">Параметры</h2>
						<div className="max-w-[200px] my-4">
							<Button
								label="Добавить новый параметр"
								onClick={addProperty}
								small
								type="button"
							/>
						</div>
						{fields.map((property, index) => (
							<div className="flex items-center gap-4 mb-2" key={index}>
								<input
									{...register(`properties.${index}.name`)}
									className="mb-0 w-full"
									onChange={e =>
										handlePropertyNameChange(index, e.target.value)
									}
									type="text"
									placeholder="Наименование параметра (пример: цвет)"
								/>
								-
								<input
									{...register(`properties.${index}.values`)}
									className="mb-0 w-full"
									onChange={e =>
										handlePropertyValuesChange(index, e.target.value)
									}
									type="text"
									placeholder="Значения (разделенные через запятую)"
								/>
								<Button
									label="Удалить параметр"
									onClick={() => removeProperty(index)}
									type="button"
									small
									outline
								/>
							</div>
						))}
					</div>

					<div className="flex gap-1">
						{editedCategory && (
							<Button
								type="button"
								label="Отмена"
								onClick={() => {
									setEditedCategory(null)
									setValue('name', '')
									setValue('description', '')
									setValue('properties', [])
								}}
								outline
							/>
						)}

						<div className="flex items-center gap-4 w-full">
							<Button label="Сохранить" type="submit" />
						</div>
					</div>
				</form>
			</div>

			{isLoading && (
				<div className="py-4">
					<Skeleton count={10} />
				</div>
			)}
			{categories.length > 0 && (
				<div style={{ height: 600, width: '100%' }} className="mt-5">
					<DataGrid
						rows={rows}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 }
							}
						}}
						pageSizeOptions={[9, 20]}
						checkboxSelection
						disableRowSelectionOnClick
					/>
				</div>
			)}
		</div>
	)
}

export default ManageCategoriesClient
