export async function tasks(parent, args, context) {
    const tasks = await context.prisma.task.findMany({
        where: {
            listId: parent.id
        },
        orderBy: {
            position: 'desc',
        },
    })
    return tasks
}