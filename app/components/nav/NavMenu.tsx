'use client'

import { navLinks } from '@/constants'
import { useMediaQuery } from '@react-hook/media-query'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MdClose, MdMenuOpen } from 'react-icons/md'

const NavMenu = () => {
	const pathname = usePathname()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const isMdScreen = useMediaQuery('(min-width: 768px)')

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		if (isMdScreen) {
			setIsMenuOpen(false)
		}

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isMenuOpen, isMdScreen])

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<>
			<div>
				<nav className="hidden sm:flex items-center justify-between gap-3">
					{navLinks.map((link, index) => (
						<Link
							href={link.route}
							key={index}
							className={`${pathname === link.route ? 'underline' : ''}`}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<button onClick={toggleMenu} className="sm:hidden flex items-center">
					{isMenuOpen ? <MdClose size={24} /> : <MdMenuOpen size={24} />}
				</button>
			</div>
			{isMenuOpen && (
				<nav className="sm:hidden absolute -left-4 flex flex-col items-center w-screen h-screen bg-white shadow-md">
					{navLinks.map((link, index) => (
						<Link
							href={link.route}
							key={index}
							className={`w-full text-center py-2 ${
								pathname === link.route ? 'underline' : ''
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							{link.label}
						</Link>
					))}
				</nav>
			)}
		</>
	)
}

export default NavMenu
