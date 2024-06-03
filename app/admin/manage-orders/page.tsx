import Container from '@/app/components/ui/Container'
import ManageOrdersClient from './ManageOrdersClient'
import { getAllOrders } from '@/actions/getAllOrders'

const ManageOrders = async () => {
	return (
		<>
			<Container>
				<ManageOrdersClient />
			</Container>
		</>
	)
}

export default ManageOrders
