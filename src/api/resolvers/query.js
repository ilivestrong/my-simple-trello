export async function lists(parent, args, context) {
   return context.prisma.list.findMany()
}
