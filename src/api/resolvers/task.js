export function tasks(parent, args, context) {
    return context.prisma.task.findMany({
        where: {
            listId: parent.id
        },
        orderBy: {
            position: 'desc',
        },
    })
}