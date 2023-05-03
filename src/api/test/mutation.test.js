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
        const newList = {
            id: 1,
            title: args.title,
        }
        prisma.list.create.mockResolvedValue(newList);
        const ctx = { prisma }
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
        const args = { title: "My Todo list" }
        const mockedErrResponse = new GraphQLError('internal server error: Variable \"$title\" of required type \"String!\" was not provided.', {
            extensions: {
                code: 'BAD_REQIEST',
                http: {
                    code: 400
                },
            },
        })
        prisma.list.create.mockResolvedValue(mockedErrResponse);
        const ctx = { prisma }
        const result = await createList({}, args, ctx);
        expect(prisma.list.create).toHaveBeenCalled()
        expect(result).toEqual(mockedErrResponse);
    });
});