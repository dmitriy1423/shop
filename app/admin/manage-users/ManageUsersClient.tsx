'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import Avatar from '@/app/components/ui/Avatar'
import { SafeUser } from '@/types'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { User } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'

interface ManageUsersClientProps {
	currentUser: SafeUser
}

const ManageUsersClient: FC<ManageUsersClientProps> = ({ currentUser }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		loadUsers()
	}, [])

	const loadUsers = () => {
		setIsLoading(true)
		axios
			.get('/api/users')
			.then(response => {
				setUsers(response.data)
			})
			.finally(() => setIsLoading(false))
	}

	const updateUserRole = async (userId: string, newRole: string) => {
		try {
			await axios.put('/api/users/update-role', { userId, role: newRole })
			toast.success(`Роль изменена на ${newRole}`)
			setUsers((prevUsers: any) =>
				prevUsers.map((user: SafeUser) =>
					user.id === userId ? { ...user, role: newRole } : user
				)
			)
		} catch (error) {
			toast.error('Error updating role')
		}
	}

	let rows: any = []

	if (users) {
		rows = users.map(user => {
			return {
				id: user.id,
				image: user.image,
				name: user.name,
				email: user.email,
				role: user.role
			}
		})
	}

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 220 },
		{
			field: 'image',
			headerName: 'Фото',
			width: 130,

			renderCell: params => {
				return (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							height: '100%'
						}}
					>
						<Avatar src={params.row.image} />
					</div>
				)
			}
		},
		{ field: 'name', headerName: 'Имя пользователя', width: 130 },
		{ field: 'email', headerName: 'Email', width: 130 },
		{
			field: 'role',
			headerName: 'Роль',
			width: 130,
			renderCell: params => {
				const user = params.row
				return (
					<div className="flex gap-2">
						{user.role === 'ADMIN' ? (
							<span>Администратор</span>
						) : (
							<span>Пользователь</span>
						)}
					</div>
				)
			}
		},
		{
			field: 'action',
			headerName: 'Редактирование ролей',
			width: 260,
			renderCell: params => {
				const user = params.row
				return (
					<div className="flex flex-col justify-center h-full">
						{user.role !== 'ADMIN' ? (
							<Button
								label="Назначить администратором"
								onClick={() => updateUserRole(user.id, 'ADMIN')}
								small
								disabled={user === currentUser}
							/>
						) : (
							<Button
								label="Лишить прав администратора"
								onClick={() => updateUserRole(user.id, 'USER')}
								small
								outline
								disabled={user.id === currentUser.id}
							/>
						)}
					</div>
				)
			}
		}
	]

	return (
		<div className="max-w-[1150px] m-auto text-xl">
			<div className="mb-4 mt-8">
				<Heading title="Пользователи" center />
			</div>
			{isLoading && (
				<div className="py-4">
					<Skeleton count={10} />
				</div>
			)}
			{users.length > 0 && (
				<div style={{ height: 600, width: '100%' }}>
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

export default ManageUsersClient
