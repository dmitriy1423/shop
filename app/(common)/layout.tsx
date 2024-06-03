import { getCurrentUser } from '@/actions/getCurrentUser'
import Footer from '../components/footer/Footer'
import NavBar from '../components/nav/NavBar'
import LoadCartAndFav from './LoadCartAndFav'

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await getCurrentUser()

	return (
		<div className="bg-gray-100 flex flex-col min-h-screen">
			<LoadCartAndFav user={user} />
			<NavBar />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	)
}
