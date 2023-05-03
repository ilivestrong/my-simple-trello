import {
  GraphQLError
} from 'graphql';

const ErrCodeRequiredFieldNotFound = "P2025"

export async function createList(parent, { title }, { prisma }) {
  try {
    if (title.trim() == "") {
      return new GraphQLError('title is required', {
        extensions: {
          code: 'BAD_REQIEST',
          http: {
            code: 400
          },
        },
      });
    }

    return await prisma.list.create({
      data: {
        title,
      }
    })
  } catch (err) {
    return new GraphQLError(`internal server error: ${err.message}`, {
      extensions: {
        code: 'INTERNAL_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}
export async function createTask(parent, { title, listID }, { prisma }) {
  if (title.trim() == "") {
    return new GraphQLError('title is required', {
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
      return new GraphQLError(`listID not found in db: ${listID}`, {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }
    return new GraphQLError(`internal server error on: ${err.meta.target.join(",")}`, {
      extensions: {
        code: 'INTERNAL_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}

export async function updateTask(parent, { title, completed, taskID }, { prisma }) {
  if (title.trim() == "") {
    return new GraphQLError('title is required', {
      extensions: {
        code: 'BAD_REQIEST',
        http: {
          code: 400
        },
      },
    });
  }

  try {
    return await prisma.task.update({
      where: {
        id: taskID,
      },
      data: {
        title,
        completed,
      }
    })
  } catch (err) {
    if (err.code === ErrCodeRequiredFieldNotFound) {
      return new GraphQLError(`taskID not found in db: ${taskID}`, {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }
    return new GraphQLError(`internal server error on: ${err.meta.target.join(",")}`, {
      extensions: {
        code: 'INTERNAL_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}
export async function moveTask(parent, { taskID, listID, newPosition }, { prisma }) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        listId: listID,
      }
    })

    if ((tasks.length == 1 && newPosition > 1)
      || (tasks.length == 0)
      || (tasks.length > 1 && newPosition > tasks.length)
    ) {
      return new GraphQLError('new position for task is invalid', {
        extensions: {
          code: 'BAD_REQUEST',
          http: {
            status: 400,
          },
        },
      });
    }

    const existingTaskWithNewPos = tasks.find((task) => task.position == newPosition)
    const taskTobeUpdated = tasks.find((task) => task.id == taskID)
    if (existingTaskWithNewPos == undefined || taskTobeUpdated == undefined) {
      return new GraphQLError('invalid operation - aborted', {
        extensions: {
          code: 'BAD_REQUEST',
          http: {
            status: 400,
          },
        },
      });
    }

    return await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: {
          id: existingTaskWithNewPos.id,
        },
        data: {
          position: taskTobeUpdated.position
        }
      });

      await tx.task.update({
        where: {
          id: taskID,
        },
        data: {
          position: newPosition,
        }
      });


      return tx.task.findMany({
        where: {
          listId: listID,
        }
      });
    })
  } catch (err) {
    await prisma.$disconnect();
    if (err.code === ErrCodeRequiredFieldNotFound) {
      return new GraphQLError(`taskID not found in db: ${taskID}`, {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }
    return new GraphQLError(`internal server error: ${err.message}`, {
      extensions: {
        code: 'INTERNAL_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}