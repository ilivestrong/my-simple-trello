import {
  GraphQLError
} from 'graphql';

const ErrCodeRequiredFieldNotFound = "P2025"

export async function createList(parent, {title}, {prisma}) {
  try {
    return await prisma.list.create({
      data: {
        title,
      }
    })
  } catch (err) {

  }
}
export async function createTask(parent, {title, listID}, { prisma }) {
  if (title.trim()  == "") {
    throw new GraphQLError('title is required', {
      extensions: {
        code: 'BAD_REQIEST',
        http: {
          code: 400
        },
      },
    });
  }

  const listTasksCount = await prisma.task.count({
    where: {
      listId: listID,
    }
  })

  try {
    return await prisma.task.create({
      data: {
        title,
        completed: false,
        position: listTasksCount + 1,
        list: {
          connect: {
            id: listID
          }
        }
      }
    })
  } catch (err) {
    if (err.code === ErrCodeRequiredFieldNotFound) {
      throw new GraphQLError(`listID not found in db: ${listID}`, {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }
    throw new GraphQLError(`internal server error on: ${err.meta.target.join(",")}`, {
      extensions: {
        code: 'INTERNAL_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}
export function updateTask(parent, args, context) {}
export function moveTask(parent, args, context) {}