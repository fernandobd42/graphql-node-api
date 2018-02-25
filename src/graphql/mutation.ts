import { commentMutations } from './resources/comment/comment.schema';
import { postMutations } from './resources/post/post.schema';
import { userMutations } from './resources/user/user.schema'

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