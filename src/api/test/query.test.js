import {
    lists
} from "../resolvers/query";
import {
    PrismaClient
} from '@prisma/client';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
    const mockClient = {
        list: {
            findMany: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockClient),
    };
});

describe('lists', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return list', async () => {
        const mockList = [{
            id: 1,
            title: 'Todo list',
            tasks: [{ id: 1, title: 'complete unit tests', completed: false, position: 1 }]
        }];
        prisma.list.findMany.mockResolvedValue(mockList);
        const ctx = { prisma }
        const args = { input: { skip: 0, take: 1 } }
        const list = await lists({}, args, ctx);

        expect(list).toEqual(mockList);
        expect(prisma.list.findMany).toHaveBeenCalled()
        expect(prisma.list.findMany).toHaveBeenCalledWith({
            skip: args.input.skip,
            take: args.input.take,
        })
    });
});