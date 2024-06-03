import prisma from '@/libs/prisma'

export async function getSettingValue(name: string) {
	const setting = await prisma.setting.findUnique({
		where: { name }
	})

	return setting
}
