export async function createList(parent, args, context) {
   return context.prisma.list.create({
        data:{
          title: args.title,
        }
      })
}
export function createTask(parent, args, context) {
    return context.prisma.task.create({
        data: {
          title: args.title,
          completed: false,
          list: {connect: {id: args.listID}}
          
        }
      })
}
export function updateTask(parent, args, context) {}
export function moveTask(parent, args, context) {}