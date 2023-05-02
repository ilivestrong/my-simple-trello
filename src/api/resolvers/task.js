export function tasks(parent, args, context) {
    return context.prisma.list.findUnique({ where: { id: parent.id } }).tasks()
 }