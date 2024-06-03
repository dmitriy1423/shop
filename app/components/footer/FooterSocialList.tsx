import Link from 'next/link'
import { FC } from 'react'
import {
	AiFillInstagram,
	AiFillTwitterCircle,
	AiFillYoutube
} from 'react-icons/ai'
import { MdFacebook } from 'react-icons/md'

const FooterSocialList: FC = () => {
	return (
		<div className="flex gap-2 justify-end items-start">
			<Link href={'#'} aria-label="Facebook" className="hover:text-blue-400">
				<MdFacebook size={24} />
			</Link>
			<Link href={'#'} aria-label="Twitter" className="hover:text-blue-400">
				<AiFillTwitterCircle size={24} />
			</Link>
			<Link href={'#'} aria-label="Youtube" className="hover:text-blue-400">
				<AiFillYoutube size={24} />
			</Link>
			<Link href={'#'} aria-label="Instagram" className="hover:text-blue-400">
				<AiFillInstagram size={24} />
			</Link>
		</div>
	)
}

export default FooterSocialList
