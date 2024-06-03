'use client'

import { usePathname } from 'next/navigation'
import Container from '../ui/Container'
import { adminNavLinks } from '@/constants'
import Link from 'next/link'
import AdminNavItem from './AdminNavItem'

const AdminNav = () => {
	const pathname = usePathname()

	return (
		<div className="w-full shadow-sm top-20 border-[1px] pt-4">
			<Container>
				<nav className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">
					{adminNavLinks.map((link, index) => (
						<Link href={link.route} key={index}>
							<AdminNavItem
								label={link.label}
								icon={link.icon}
								selected={
									pathname === '/admin'
										? pathname === link.route
										: pathname.split('/')[2] === link.name
								}
							/>
						</Link>
					))}
				</nav>
			</Container>
		</div>
	)
}

export default AdminNav
