'use client'

import { SafeUser } from '@/types'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { FC, useCallback, useEffect, useState } from 'react'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import Avatar from '../ui/Avatar'
import BackDrop from './BackDrop'
import { truncateText } from '@/utils'

interface UserMenuProps {
	currentUser: SafeUser | null
}

const UserMenu: FC<UserMenuProps> = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}

		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])

	const toggleOpen = useCallback(() => {
		setIsOpen(prev => !prev)
	}, [])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === 'Enter' || event.key === ' ') {
				toggleOpen()
				event.preventDefault()
			}
		},
		[toggleOpen]
	)

	return (
		<>
			<button
				className="relative z-30"
				onClick={toggleOpen}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				<div className="p-1 sm:p-2 border-[1px] border-slate-400 flex items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition">
					<Avatar src={currentUser?.image} />
					{currentUser?.name && (
						<span className="hidden sm:inline">
							{truncateText(currentUser.name)}
						</span>
					)}
					{isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
				</div>
				{isOpen && (
					<div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
						{currentUser ? (
							<div>
								<Link href={'/user'} onClick={toggleOpen}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Линый кабинет
									</div>
								</Link>
								{currentUser.role === 'ADMIN' && (
									<Link href={'/admin'} target="_blank" onClick={toggleOpen}>
										<div
											onClick={toggleOpen}
											className="px-4 py-3 hover:bg-neutral-100 transition"
										>
											Панель администратора
										</div>
									</Link>
								)}

								<hr />
								<div
									onClick={() => {
										toggleOpen()
										signOut()
									}}
									className="px-4 py-3 hover:bg-neutral-100 transition"
								>
									Выход
								</div>
							</div>
						) : (
							<div>
								<Link href={'/login'} onClick={toggleOpen}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Вход
									</div>
								</Link>
								<Link href={'/register'} onClick={toggleOpen}>
									<div
										onClick={toggleOpen}
										className="px-4 py-3 hover:bg-neutral-100 transition"
									>
										Регистрация
									</div>
								</Link>
							</div>
						)}
					</div>
				)}
			</button>
			{isOpen && <BackDrop onClick={toggleOpen} />}
		</>
	)
}

export default UserMenu
