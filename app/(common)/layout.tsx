import { getCurrentUser } from '@/actions/getCurrentUser'
import Footer from '../components/footer/Footer'
import dynamic from 'next/dynamic'

const DynamicC = dynamic(() => import('./LoadCartAndFav'))
const DynamicN = dynamic(() => import('../components/nav/NavBar'))

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await getCurrentUser()

	return (
		<div className="bg-gray-100 flex flex-col min-h-screen">
			<DynamicC user={user} />
			<DynamicN />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	)
}
