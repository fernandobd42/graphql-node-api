import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'

import { Query } from './query'
import { Mutation } from './mutation'

import { commentTypes } from './resouces/comment/comment.schema';
import { postTypes } from './resouces/post/post.schema';
import { userTypes } from './resouces/user/user.schema';

import { commentResolvers } from './resouces/comment/comment.resolvers';
import { postResolvers } from './resouces/post/post.resolvers';
import { userResolvers } from './resouces/user/user.resolver';

const resolvers = merge(
    commentResolvers,
    postResolvers,
    userResolvers
)

const SchemaDefinition = `
    type Schema {
        query: Query,
        mutation: Mutation
    }
`

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        commentTypes,
        postTypes,
        userTypes,
    ],
    resolvers
})