import { commentQueries } from './resouces/comment/comment.schema';
import { postQueries } from './resouces/post/post.schema';
import { userQueries } from './resouces/user/user.schema'

const Query = `
    # All Queries
    type Query {
        ${commentQueries}
        ${postQueries}
        ${userQueries}
    }
`

export { 
    Query
}