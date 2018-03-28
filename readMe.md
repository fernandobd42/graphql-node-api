# typescript, node(express) e graphql

### After download, just follow:

- to install dependencies, run:
```
npm install
```

- to generate the bundle through gulp, run: 
```
npm run gulp
```

- to start server, run: 
```
npm run dev
```

- to run tests, run:
```
npm test
```

- to run code coverage, run:

```
npm run coverage
```
Then open coverage directory on root of project and open index.html on browser to see the results;

### Mutations and Queries examples

- [User Mutations](#user-mutations)
- [User Queries](#user-queries)
- [Post Mutations](#post-mutations)
- [Post Queries](#post-queries)
- [Comment Mutations](#comment-mutations)
- [Comment Queries](#comment-queries)
- [Token Mutation](#token-mutation)

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
  updateUser(input: {
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
  updateUserPassword(input: {
    password: "ciclano123"
  }) 
}

mutation DeleteUser {
  deleteUser
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
    name
    email
    photo
    createdAt
    updatedAt
    posts {
      id
      title
      content
      photo
      comments {
        id
        comment
        user {
          id
          name
        }
      }
    }
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
  }) {
    id
    title
    content
    photo
    createdAt
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
  }) {
    id
    title
    content
    photo
    createdAt
    updatedAt
    author {
      id
      name
    }
    comments {
      id
      comment
      user {
        id
        name
      }
    }
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
    createdAt
    updatedAt
    author {
      id
      name
    }
    comments {
      id
      comment
      user {
        id
        name
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
    createdAt
    updatedAt
    author {
      id
      name
    }
    comments {
      id
      comment
        user {
        id
        name
      }
    }
  }
}
```


##### COMMENT MUTATIONS
```
mutation CreateComment {
  createComment(input: {
    comment: "new comment"
    post: 5
  }) {
    id
    comment
    createdAt
    user {
      id
      name
    }
    post {
      id
      title
    }
  }
}

mutation UpdateComment {
  updateComment(id: 2, input: {
    comment: "updated comment"
    post: 1
  }) {
    id
    comment
    createdAt
    updatedAt
    user {
    	id
      name
    }
    post {
      id
      title
    }
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
    createdAt
    updatedAt
    post {
      id
      title
    }
    user {
      id
      name
    }
  }
}
```

##### TOKEN MUTATION
````
mutation createNewToken {
  createToken(email: "Fulano@email.com", password: "123456"
  ) {
    token
  }
}
```