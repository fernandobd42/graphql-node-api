const commentTypes = `

    # Comment Type
    type Comment {
        id: ID!
        comment: String!
        createAt: String!
        updateAt: String!
        user: User!
        post: Post!
    }

    # Comment Input
    input CommentInput {
        comment: String!
        post: Int!
        user: Int!
    }
`

const commentQueries = `
    # Comments by post
    commentsByPost(post: ID!, first: Int, offset: Int): [Comment!]!
`

const commentMutations = `
    # Create a comment
    createComment(input: CommentInput!): Comment

    # Update a comment
    updateComment(id: ID!, input: CommentInput!): Comment

    # Delete a comment
    deleteComent(id: ID!): Boolean
`

export {
    commentTypes,
    commentQueries,
    commentMutations
}