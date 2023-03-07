import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default defineEventHandler(async (event: any) => {

    const body = await readBody(event)

    let deleted = null
    if (body && body.id)
        deleted = await prisma.data.delete({
            where: {
                id: body.id
            }
        })
    else
        deleted = await prisma.data.deleteMany()
    return deleted

})