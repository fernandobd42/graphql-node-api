import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";

import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const commentResolvers = {

    Comment: {
        user:  (comment, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.dataloaders.userLoader
                .load({
                    key: comment.get('user'),
                    info
                })
                .catch(handleError) 
        },

        post:  (comment, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.dataloaders.postLoader
                .load({
                    key: comment.get('post'),
                    info
                })
                .catch(handleError) 
        }
    },

    Query: {
        commentsByPost: compose()((parent, { postId, first = 10, offset = 0 }, context: ResolverContext, info: GraphQLResolveInfo) => {
            postId = parseInt(postId)
            return context.db.Comment
                .findAll({
                    where: { post: postId },
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: undefined})
                })
                .catch(handleError)
        })  
    },

    Mutation: {
        createComment: compose(...authResolvers)((parent, { input }, context: ResolverContext, info: GraphQLResolveInfo) => {
            input.user = context.authUser.id
            
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Comment
                    .create(input, {transaction: t})
            })
            .catch(handleError) 
        }),
        
        updateComment: compose(...authResolvers)((parent, { id, input }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError (!comment, `Comment with id ${id} not found!`)
                        throwError (comment.get('user') != context.authUser.id, `Unauthorized! You can only edit comments by yourself!`)
                        input.user = context.authUser.id
                        return comment.update(input, {transaction: t})
                    })
            })
            .catch(handleError)
        }),

        deleteComment: compose(...authResolvers)((parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id)
            return context.db.sequelize.transaction((t: Transaction) => {
                return context.db.Comment
                    .findById(id)
                    .then((comment: CommentInstance) => {
                        throwError (!comment, `Comment with id ${id} not found!`)
                        throwError (comment.get('user') != context.authUser.id, `Unauthorized! You can only edit comments by yourself!`)
                        return comment.destroy({transaction: t})
                            .then(comment => !!comment)
                    })
            })
            .catch(handleError)
        }),
    }
}   