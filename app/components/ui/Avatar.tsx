import Image from 'next/image'
import { FC } from 'react'
import { FaUserCircle } from 'react-icons/fa'

interface AvatarProps {
	src?: string | null | undefined
}

const Avatar: FC<AvatarProps> = ({ src }) => {
	if (src) {
		return (
			<Image
				src={src}
				alt={'Avatar'}
				className="rounded-full"
				height={24}
				width={24}
			/>
		)
	}

	return <FaUserCircle size={24} />
}

export default Avatar
