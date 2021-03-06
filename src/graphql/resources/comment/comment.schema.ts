const commentTypes = `

    # Comment Type
    type Comment {
        id: ID!
        comment: String!
        user: User!
        post: Post!
        createdAt: String!
        updatedAt: String!
    }

    # Comment Input
    input CommentInput {
        comment: String!
        post: Int!
    }
`

const commentQueries = `
    # Comments by post
    commentsByPost(postId: ID!, first: Int, offset: Int): [Comment!]!
`

const commentMutations = `
    # Create a comment
    createComment(input: CommentInput!): Comment

    # Update a comment
    updateComment(id: ID!, input: CommentInput!): Comment

    # Delete a comment
    deleteComment(id: ID!): Boolean
`

export {
    commentTypes,
    commentQueries,
    commentMutations
}