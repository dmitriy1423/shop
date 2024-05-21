'use client'

import { SafeUser } from '@/types'
import { FC, useCallback, useState } from 'react'
import Avatar from '../ui/Avatar'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import Link from 'next/link'
import BackDrop from './BackDrop'
import { signOut } from 'next-auth/react'

interface UserMenuProps {
	currentUser: SafeUser | null
}

const UserMenu: FC<UserMenuProps> = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleOpen = useCallback(() => {
		setIsOpen(prev => !prev)
	}, [])

	return (
		<>
			<div className="relative z-30">
				<div
					onClick={toggleOpen}
					className="p-2 border-[1px] border-slate-400 flex items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition"
				>
					<Avatar src={currentUser?.image} />
					{currentUser?.name && <span>{currentUser.name}</span>}
					{isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
				</div>
				{isOpen && (
					<div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
						{currentUser ? (
							<div>
								<Link href={'/orders'}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Orders
									</div>
								</Link>
								<Link href={'/admin'}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Admin panel
									</div>
								</Link>
								<hr />
								<div
									onClick={() => {
										toggleOpen()
										signOut()
									}}
									className="px-4 py-3 hover:bg-neutral-100 transition"
								>
									Logout
								</div>
							</div>
						) : (
							<div>
								<Link href={'/login'}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Login
									</div>
								</Link>
								<Link href={'/register'}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Register
									</div>
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
			{isOpen && <BackDrop onClick={toggleOpen} />}
		</>
	)
}

export default UserMenu
