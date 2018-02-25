# typescript, node(express) e graphql

### Mutations and Queries examples

- [User Mutations](#user-mutations)
- [User Queries](#user-queries)
- [Post Mutations](#post-mutations)
- [Post Queries](#post-queries)
- [Comment Mutations](#comment-mutations)
- [Comment Queries](#comment-queries)

##### USER MUTATIONS
```mutation CreateUser {
  createUser(input: {
    name: "beltranao"
    email: "beltrano@gmail.com"
    password: "beltrano123"
  }) {
    id
    name
    email
  }
}

mutation UpdateUser {
  updateUser(id: 1, input: {
    name: "Ciclano"
    email: "ciclano@gmail.com",
    photo: "ciclano.png"
  }) {
    id
    name
    email
    photo
    createdAt
    updatedAt
  }
}

mutation UpdateUserPassword {
  updateUserPassword(id: 1, input: {
    password: "ciclano123"
  }) 
}

mutation DeleteUser {
  deleteUser(id: 1) 
}
```

##### USER QUERIES
```
query Users {
  users(first: 10, offset: 0){
    id
    name
    email
    photo
    createdAt
    updatedAt
  }
}

query User {
  user(id: 1) {
    id
    createdAt
    updatedAt
  }
}
```


##### POST MUTATIONS
```
mutation CreatePost {
  createPost(input: {
    title: "first post title"
    content: "first post content"
    photo: "photo.png"
    author: 2
  }) {
    id
    title
    content
    photo
   	author {
      id
      name
    }
  }
}

mutation UpdatePost {
  updatePost(id: 1, input: {
    title: "updated title"
    content: "updated content"
    photo: "updatedPhoto.png"
    author: 2
  }) {
    id
    title
    content
    photo
    author {
      id
      name
    }
    createdAt
    updatedAt
  }
}

mutation DeletePost {
  deletePost(id: 1)
}
```

##### POST QUERIES
```
query Posts {
  posts {
    id
    title
    content
    photo
    author {
      id
    }
    comments {
      id
      comment
      user {
        id
      }
    }
  }
}

query Post {
  post(id: 1) {
    id
    title
    content
    photo
    author {
      id
      name
    }
    comments {
      id
      comment
    }
    createdAt
    updatedAt
  }
}
```


##### COMMENT MUTATIONS
```
mutation CreateComment {
  createComment(input: {
    comment: "new comment"
    post: 5
    user: 1
  }) {
    id
    comment
    user {
      id
      name
    }
  }
}

mutation UpdateComment {
  updateComment(id: 2, input: {
    comment: "updated comment"
    post: 1
    user: 1
  }) {
    id
    comment
    user {
      id
      name
    }
    createdAt
    updatedAt
  }
}

mutation deleteComment {
  deleteComment(id: 1)
}
```

##### COMMENT QUERIES
```
query CommentsByPost {
  commentsByPost(postId: 5, first: 10, offset: 0) {
    id
    comment
    user {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```