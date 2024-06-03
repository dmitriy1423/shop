'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md'
import Heading from '../heading/Heading'

interface DialogProps {
	title: string
	onClose: () => void
	onOk: () => void
}

const Dialog: FC<PropsWithChildren<DialogProps>> = ({
	title,
	onClose,
	onOk,
	children
}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const dialogRef = useRef<null | HTMLDialogElement>(null)
	const showDialog = searchParams.get('showDialog')

	useEffect(() => {
		if (showDialog === 'y') {
			dialogRef.current?.showModal()
		} else {
			dialogRef.current?.close()
		}
	}, [showDialog])

	const closeDialog = () => {
		dialogRef.current?.close()
		router.push('/admin/manage-products')
		onClose()
	}

	const clickOk = () => {
		onOk()
		closeDialog()
	}

	const dialog: JSX.Element | null =
		showDialog === 'y' ? (
			<dialog
				ref={dialogRef}
				className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-50 rounded-xl backdrop:bg-gray-800/50"
			>
				<div className="w-[500px] max-w-full bg-gray-200 flex flex-col">
					<div className="flex justify-between mb-4 pt-2 px-5 bg-yellow-400">
						<Heading title={title} />
						<button
							onClick={closeDialog}
							className="mb-2 py-1 px-2 cursor-pointer rounded border-none w-8 h-8 font-bold bg-red-600 text-white"
						>
							<MdClose />
						</button>
					</div>
					<div className="px-5 pb-6">
						{children}
						<div className="flex justify-end">
							<button onClick={clickOk}>OK</button>
						</div>
					</div>
				</div>
			</dialog>
		) : null

	return dialog
}

export default Dialog
