const userTypes = `
    
    # User Type
    type User {
        id: ID!
        name: String!
        email: String!
        photo: String
        createAt: String!
        updateAt: String!
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
`

const userMutations = `
    # Create a user
    createUser(input: UserCreateInput!): User

    # Update a user
    updateUser(id: ID!, input: UserUpdateInput!): User

    # Update a password of user
    updateUserPassword(id: ID!, input: UserUpdatePasswordInput!): Boolean

    # Delete a user
    deleteUser(id: ID!): Boolean
`

export {
    userTypes,
    userQueries,
    userMutations
}