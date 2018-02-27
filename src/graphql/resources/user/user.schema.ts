const userTypes = `
    
    # User Type
    type User {
        id: ID!
        name: String!
        email: String!
        photo: String
        posts(first: Int, offset: Int): [Post!]!
        createdAt: String!
        updatedAt: String!
    }

    # UserCreate Input
    input UserCreateInput {
        name: String!
        email: String!
        password: String!
    }

    # UserUpdate Input
    input UserUpdateInput {
        name: String!
        email: String!
        photo: String!
    }

    # UserUpdatePassword Input
    input UserUpdatePasswordInput {
        password: String!
    }
`

const userQueries = `
    # Users
    users(first: Int, offset: Int): [User!]!

    # User
    user(id: ID!): User

    # Current user
    currentUser: User
`

const userMutations = `
    # Create a user
    createUser(input: UserCreateInput!): User

    # Update a user
    updateUser(input: UserUpdateInput!): User

    # Update a password of user
    updateUserPassword(input: UserUpdatePasswordInput!): Boolean

    # Delete a user
    deleteUser: Boolean
`

export {
    userTypes,
    userQueries,
    userMutations
}