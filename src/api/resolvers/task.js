export async function tasks(parent, args, context) {
    return await context.prisma.task.findMany({
        where: {
            listId: parent.id
        },
        orderBy: {
            position: 'desc',
        },
    })
}