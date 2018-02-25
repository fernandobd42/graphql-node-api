const postTypes = `

    # Post Type
    type Post {
        id: ID!
        title: String!
        content: String!
        photo: String!
        author: User!
        comments(first: Int, offset: Int): [Comment!]!
        createdAt: String!
        updatedAt: String!
    }

    # Post Input
    input PostInput {
        title: String!
        content: String!
        photo: String!
        author: Int!
    }
`

const postQueries = `
    # Posts
    posts(first: Int, offset: Int): [Post!]!

    # Post
    post(id: ID!): Post
`

const postMutations = `
    # Create a post
    createPost(input: PostInput!): Post

    # Update a post
    updatePost(id: ID!, input: PostInput!): Post

    # Delete a post
    deletePost(id: ID!): Boolean
`

export {
    postTypes,
    postQueries,
    postMutations
}
