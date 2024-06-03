'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import firebaseApp from '@/libs/firebase'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Product } from '@prisma/client'
import axios from 'axios'
import { deleteObject, getStorage, ref } from 'firebase/storage'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdDelete, MdEdit } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

const ManageProductsClient = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const storage = getStorage(firebaseApp)

	useEffect(() => {
		setIsLoading(true)
		axios
			.get('/api/products')
			.then(response => {
				setProducts(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [])

	let rows: any = []

	if (products) {
		rows = products.map(product => {
			return {
				id: product.id,
				name: product.name,
				price: product.price,
				discountPercent: product.discountPercent,
				photo: product.images[0]
			}
		})
	}

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 220 },
		{ field: 'name', headerName: 'Наименование', width: 130 },
		{ field: 'price', headerName: 'Стоимость', width: 100 },
		{
			field: 'discountPercent',
			headerName: 'Скидка',
			width: 100,
			renderCell: params => {
				return (
					<>
						{params.row.discountPercent > 0 ? (
							<div>-{params.row.discountPercent}%</div>
						) : (
							<div>Нет</div>
						)}
					</>
				)
			}
		},
		{
			field: 'discountedPrice',
			headerName: 'Итоговая стоимость',
			width: 160,
			renderCell: params => {
				const discountedPrice = Math.round(
					params.row.price * (1 - params.row.discountPercent / 100)
				)

				return (
					<>
						{params.row.discountPercent > 0 ? (
							<div>{discountedPrice}</div>
						) : (
							<div>{params.row.price}</div>
						)}
					</>
				)
			}
		},
		{
			field: 'photo',
			headerName: 'Фото',
			headerAlign: 'center',
			width: 200,
			renderCell: params => {
				return (
					<div className="relative w-full h-full aspect-square">
						<Image
							src={params.row.photo}
							alt={params.row.id}
							fill
							className="object-contain"
						/>
					</div>
				)
			}
		},
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
							onClick={() =>
								router.push(`/admin/manage-products/edit/${params.id}`)
							}
							small
						/>
						<Button
							label="Удалить"
							icon={MdDelete}
							onClick={() => handleDelete(params.row.id, params.row.photo)}
							small
						/>
					</div>
				)
			}
		}
	]

	const handleDelete = async (id: string, images: string[]) => {
		toast('Deleting product, please wait')

		const handleImageDelete = async () => {
			try {
				for (const item of images) {
					if (item) {
						const imageRef = ref(storage, item)
						await deleteObject(imageRef)
						console.log('image deleted', item)
					}
				}
			} catch (error: any) {
				return console.log('Deleting images error')
			}
		}

		await handleImageDelete()

		axios
			.delete(`/api/products/${id}`)
			.then(response => {
				toast.success('Product deleted')
				router.refresh()
			})
			.catch((err: any) => {
				toast.error('Oops! Something went wrong')
			})
	}

	return (
		<>
			<div className="mb-4 mt-8">
				<Heading title="Товары" center />
			</div>

			<Button
				label="Добавить новый товар"
				onClick={() => router.push('/admin/manage-products/new')}
				maxWidth={250}
			/>

			{isLoading && (
				<div className="py-4">
					<Skeleton count={10} height={50} />
				</div>
			)}
			{products.length > 0 && (
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
		</>
	)
}

export default ManageProductsClient
