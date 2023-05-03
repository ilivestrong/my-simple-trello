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
            findMany: jest.fn(),
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
});