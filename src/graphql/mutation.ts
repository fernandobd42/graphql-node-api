import { commentMutations } from './resouces/comment/comment.schema';
import { postMutations } from './resouces/post/post.schema';
import { userMutations } from './resouces/user/user.schema'

const Mutation = `
    # All Mutations
    type Mutation {
        ${commentMutations}
        ${postMutations}
        ${userMutations}
    }
`

export {
    Mutation
} 