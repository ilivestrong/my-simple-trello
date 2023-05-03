export function lists(parent, {skip, take}, context) {
   return context.prisma.list.findMany({
      skip,
      take,
   })
}