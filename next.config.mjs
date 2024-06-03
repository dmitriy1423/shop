/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'files.stripe.com'
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com'
			}
		]
	},
	typescript: {
		ignoreBuildErrors: true
	}
}

export default nextConfig
