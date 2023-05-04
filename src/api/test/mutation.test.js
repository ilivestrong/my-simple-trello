import {
    createList,
    createTask,
    ErrCodeRequiredFieldNotFound,
    moveTask,
    updateTask
} from "../resolvers/mutation";
import {
    PrismaClient
} from '@prisma/client';
import {
    GraphQLError
} from 'graphql';

jest.mock('@prisma/client', () => {
    const mockClient = {
        list: {
            create: jest.fn(),
        },
        task: {
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn(),
        },
        $transaction: jest.fn(),
        $disconnect: jest.fn(),
    };

    return {
        PrismaClient: jest.fn(() => mockClient),
    };
});

describe('createList()', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return GraphQLError when title is blank', async () => {
        const args = {
            title: ""
        }
        const result = await createList({}, args, {
            prisma: {}
        });
        expect(result).toEqual(new GraphQLError('title is required'));
    });

    it('should create a new list', async () => {
        const args = {
            title: "My Todo list"
        }
        const newList = {
            id: 1,
            title: args.title,
        }
        prisma.list.create.mockResolvedValue(newList);
        const ctx = {
            prisma
        }
        const result = await createList({}, args, ctx);
        expect(prisma.list.create).toHaveBeenCalled()
        expect(result).toEqual(newList);
        expect(prisma.list.create).toHaveBeenCalledWith({
            data: {
                title: args.title,
            }
        })
    });

    it('should return GraphQLError when create mutation failed', async () => {
        const args = {
            title: "My Todo list"
        }
        const mockedErrResponse = new GraphQLError('internal server error', {
            extensions: {
                code: 'INTERNAL_ERROR',
                http: {
                    status: 500,
                },
            },
        })
        prisma.list.create.mockResolvedValue(mockedErrResponse);
        const ctx = {
            prisma
        }
        const result = await createList({}, args, ctx);
        expect(prisma.list.create).toHaveBeenCalled()
        expect(result).toEqual(mockedErrResponse);
    });
});


describe('createTask()', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return GraphQLError when title is blank', async () => {
        const args = {
            title: ""
        }
        const result = await createTask({}, args, {
            prisma: {}
        });
        expect(result).toEqual(new GraphQLError('title is required'));
    });

    it('should create a new task with correct id value', async () => {
        const ctx = {
            prisma
        }
        const todoList = {
            id: 1,
            title: "My todo list",
        }
        const taskArgs = {
            title: 'Grocery shopping',
            listID: todoList.id,
        }
        const existingTasksInList = 1
        prisma.task.count.mockResolvedValue(existingTasksInList);

        const result = await createTask({}, taskArgs, ctx);

        expect(prisma.task.create).toHaveBeenCalled()
        expect(prisma.task.create).toHaveBeenCalledWith({
            data: {
                title: taskArgs.title,
                completed: false,
                position: existingTasksInList + 1,
                list: {
                    connect: {
                        id: todoList.id,
                    }
                }
            }
        })
    });

    it('should return GraphQLError when listID not found', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            listID: -1, // invalid listID provided
        }
        const expected = new GraphQLError(`listID not found in db: ${taskArgs.listID}`, {
            extensions: {
                code: 'NOT_FOUND',
                http: {
                    status: 404,
                },
            },
        });

        prisma.task.count.mockImplementation(() => {
            const errorNotFound = new Error('not found');
            errorNotFound.code = ErrCodeRequiredFieldNotFound
            throw errorNotFound
        });

        const result = await createTask({}, taskArgs, ctx);

        expect(prisma.task.create.mock.calls).toHaveLength(0);
        expect(result).toEqual(expected);
    });

    it('should return GraphQLError when count() call fails', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            listID: 1, // invalid listID provided
        }
        const expected = new GraphQLError(`internal server error on: ${['some field'].join(",")}`, {
            extensions: {
                code: 'INTERNAL_ERROR',
                http: {
                    status: 500,
                },
            },
        });

        prisma.task.count.mockImplementation(() => {
            const internalError = new Error('internal error');
            internalError.code = "P2021"
            internalError.meta = {
                target: ["some field"]
            }
            throw internalError
        });

        const result = await createTask({}, taskArgs, ctx);

        expect(prisma.task.create.mock.calls).toHaveLength(0);
        expect(result).toEqual(expected);
    });

    it('should return GraphQLError when create() call fails', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            listID: 1, // invalid listID provided
        }
        const existingTasksInList = 1
        prisma.task.count.mockResolvedValue(existingTasksInList);
        const expected = new GraphQLError(`internal server error on: ${['some field'].join(",")}`, {
            extensions: {
                code: 'INTERNAL_ERROR',
                http: {
                    status: 500,
                },
            },
        });

        prisma.task.create.mockImplementation(() => {
            const internalError = new Error('internal error');
            internalError.code = "P2021"
            internalError.meta = {
                target: ["some field"]
            }
            throw internalError
        });

        const result = await createTask({}, taskArgs, ctx);

        expect(prisma.task.create).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });
});

describe('updateTask()', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return GraphQLError when title is blank', async () => {
        const args = {
            title: ""
        }
        const result = await createTask({}, args, {
            prisma: {}
        });
        expect(result).toEqual(new GraphQLError('title is required'));
    });

    it('should update a task with correct input', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            completed: true,
            taskID: 1,
        }

        const result = await updateTask({}, taskArgs, ctx);

        expect(prisma.task.update).toHaveBeenCalled()
        expect(prisma.task.update).toHaveBeenCalledWith({
            data: {
                title: taskArgs.title,
                completed: taskArgs.completed,
            },
            where: {
                id: taskArgs.taskID,
            }
        })
    });

    it('should return GraphQLError when taskID not found', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            completed: true,
            taskID: -1, // invalid taskID
        }
        const expected = new GraphQLError(`taskID not found in db: ${taskArgs.taskID}`, {
            extensions: {
                code: 'NOT_FOUND',
                http: {
                    status: 404,
                },
            },
        });
        prisma.task.update.mockImplementation(() => {
            const errorNotFound = new Error('not found');
            errorNotFound.code = ErrCodeRequiredFieldNotFound
            throw errorNotFound
        });

        const result = await updateTask({}, taskArgs, ctx);

        expect(result).toEqual(expected);
    });

    it('should return GraphQLError when update() call fails with internal error', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            title: 'Grocery shopping',
            completed: true,
            taskID: 1,
        }
        const expected = new GraphQLError(`internal server error on: ${['some field'].join(",")}`, {
            extensions: {
                code: 'INTERNAL_ERROR',
                http: {
                    status: 500,
                },
            },
        });

        prisma.task.update.mockImplementation(() => {
            const internalError = new Error('internal error');
            internalError.code = "P2021"
            internalError.meta = {
                target: ["some field"]
            }
            throw internalError
        });

        const result = await updateTask({}, taskArgs, ctx);

        expect(result).toEqual(expected);
    });
});

describe('moveTask()', () => {
    let prisma;
    const mockTasks = [{
        id: 1,
        title: "Grocery shopping",
        completed: false,
        position: 1,
    },
    {
        id: 2,
        title: "Buy gym equipment",
        completed: true,
        position: 2,
    },
    {
        id: 3,
        title: "Daily diary writing",
        completed: false,
        position: 3,
    }
    ]

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return GraphQLError when input is incorrect', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            taskID: 1,
            listID: 1,
            newPosition: 4,
        }
        prisma.task.findMany.mockResolvedValue(mockTasks)

        const result = await moveTask({}, taskArgs, ctx);
        expect(result).toEqual(new GraphQLError('new position for task is invalid'));
    });

    it('should move a task to new position with correct input', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            taskID: 1,
            listID: 1,
            newPosition: 2,
        }
        prisma.task.findMany.mockResolvedValue(mockTasks)
        prisma.$transaction.mockImplementation(async () => { });

        await moveTask({}, taskArgs, ctx);
        expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    });

    it('should return GraphQLError when taskID not found', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            taskID: 1,
            listID: 1,
            newPosition: 2,
        }
        prisma.task.findMany.mockResolvedValue(mockTasks)
        prisma.$transaction.mockImplementation(() => {
            const errorNotFound = new Error('not found');
            errorNotFound.code = ErrCodeRequiredFieldNotFound
            throw errorNotFound
        });
        const expected = new GraphQLError(`taskID not found in db: ${taskArgs.taskID}`, {
            extensions: {
                code: 'NOT_FOUND',
                http: {
                    status: 404,
                },
            },
        });


        const result = await moveTask({}, taskArgs, ctx);

        expect(result).toEqual(expected);
    });

    it('should return GraphQLError when internal error encountered', async () => {
        const ctx = {
            prisma
        }
        const taskArgs = {
            taskID: 1,
            listID: 1,
            newPosition: 2,
        }
        prisma.task.findMany.mockResolvedValue(mockTasks)
        prisma.$transaction.mockImplementation(() => {
            const internalError = new Error('internal error');
            internalError.code = "P2021"
            internalError.meta = {
                target: ["some field"]
            }
            throw internalError
        });
        const expected = new GraphQLError(`internal server error: internal error`, {
            extensions: {
                code: 'INTERNAL_ERROR',
                http: {
                    status: 500,
                },
            },
        });

        const result = await moveTask({}, taskArgs, ctx);

        expect(result).toEqual(expected);
    });
});


