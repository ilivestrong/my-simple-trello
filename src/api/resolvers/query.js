export function lists(parent, { input: { skip, take } }, context) {
   return context.prisma.list.findMany({
      skip,
      take,
   })
}