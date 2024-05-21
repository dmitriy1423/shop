import Link from 'next/link'
import Container from '../ui/Container'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu'
import { getCurrentUser } from '@/actions/getCurrentUser'

const NavBar = async () => {
	const currentUser = await getCurrentUser()

	return (
		<div>
			<Container>
				<div className="flex items-center justify-between">
					<Link href={'/'} className="font-bold text-2xl order-0 sm:-order-1">
						E-Shop
					</Link>
					<div className="relative -order-1 sm:order-0">
						<NavMenu />
					</div>
					<div className="flex items-center gap-3 justify-between">
						<div>Корзина</div>
						<div>Избранное</div>
						<UserMenu currentUser={currentUser} />
					</div>
				</div>
			</Container>
		</div>
	)
}

export default NavBar
