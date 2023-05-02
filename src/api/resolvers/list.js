export function list(parent, args, context) {
    return context.prisma.task.findUnique({ where: { id: parent.id } }).list()
 }
