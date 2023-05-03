import {
    createList
} from "../resolvers/mutation";
import {
    PrismaClient
} from '@prisma/client';
import {
    GraphQLError
} from 'graphql';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
    const mockClient = {
        list: {
            create: jest.fn(),
        },
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
        const args = { title: "" }
        const result = await createList({}, args, { prisma: {} });
        expect(result).toEqual(new GraphQLError('title is required'));
    });

    it('should create a new list', async () => {
        const args = { title: "My Todo list" }
        const ctx = { prisma }
        const result = await createList({}, args, ctx);
        expect(prisma.list.create).toHaveBeenCalled()
    });
});