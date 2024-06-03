import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '@/app/components/ui/Container'
import ManageUsersClient from './ManageUsersClient'

const ManageUsers = async () => {
	const user = await getCurrentUser()
	if (!user) return null

	return (
		<>
			<Container>
				<ManageUsersClient currentUser={user} />
			</Container>
		</>
	)
}

export default ManageUsers
