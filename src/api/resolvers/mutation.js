export async function createList(parent, args, context) {
  return context.prisma.list.create({
    data: {
      title: args.title,
    }
  })
}
export async function createTask(parent, args, context) {
  const listTasksCount = await context.prisma.task.count({
    where: {
      listId: args.listID,
    }
  })
  return context.prisma.task.create({
    data: {
      title: args.title,
      completed: false,
      position : listTasksCount+ 1,
      list: {
        connect: {
          id: args.listID
        }
      }
    }
  })
}
export function updateTask(parent, args, context) {}
export function moveTask(parent, args, context) {}