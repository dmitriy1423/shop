import { getAllOrders } from '@/actions/getAllOrders'
import getGraphData from '@/actions/getGraphData'
import { getProducts } from '@/actions/getProducts'
import { getUsers } from '@/actions/getUsers'
import Container from '../components/ui/Container'
import Summary from './Summary'
import BarGraph from './BarGraph'

const Admin = async () => {
	const products = await getProducts()
	const orders = await getAllOrders()
	const users = await getUsers()
	const graphData = await getGraphData()

	return (
		<>
			<Container>
				<Summary products={products} orders={orders} users={users} />
				<div className="mt-4 mx-auto max-w-[1150px]">
					<BarGraph data={graphData} />
				</div>
			</Container>
		</>
	)
}

export default Admin
