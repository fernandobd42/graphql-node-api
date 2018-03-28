import * as jwt from 'jsonwebtoken'
import { app, db, chai, handleError, expect } from './../../test-utils'
import { UserInstance } from '../../../src/models/UserModel';
import { JWT_SECRET } from '../../../src/utils/utils';

describe('User', () => {

  let token: string;
  let userId: number;

  beforeEach(() => {
    return db.Comment.destroy({where: {}})
      .then((rows: number) => db.Post.destroy({where: {}}))
      .then((rows: number) => db.User.destroy({where: {}}))
      .then((rows: number) => db.User.bulkCreate([
        {
          name: 'Goku',
          email: 'goku@gmail.com',
          password: 'goku123'
        },
        {
          name: 'Vegita',
          email: 'vegita@gmail.com',
          password: 'vegita123'
        },
        {
          name: 'gohan',
          email: 'gohan@gmail.com',
          password: 'gohan123'
        }
      ])).then((users: UserInstance[]) => {
        userId = users[0].id;
        const payload = {sub: userId}
        token = jwt.sign(payload, JWT_SECRET)
      })
  })

  describe('Queries', () => {

    describe('Application/json', () => {

      describe('user', () => {
        
        it('should return a single user', () => {

          let body = {
            query: `
              query getSingleUser($id: ID!) {
                user(id: $id) {
                  id
                  name
                  email
                  posts {
                    title
                  }
                }
              }
            `,
            variables: {
              id: userId
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const singleUser = res.body.data.user
              expect(res.body.data).to.be.an('object')
              expect(singleUser).to.be.an('object')
              expect(singleUser).to.have.keys(['id', 'name', 'email', 'posts'])
              expect(singleUser.name).to.equal('Goku')
              expect(singleUser.email).to.equal('goku@gmail.com')
            }).catch(handleError)
        })

        it('should return only \'name\' attribute', () => {

          let body = {
            query: `
              query getSingleUser($id: ID!) {
                user(id: $id) {
                  name
                }
              }
            `,
            variables: {
              id: userId
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const singleUser = res.body.data.user
              expect(res.body.data).to.be.an('object')
              expect(singleUser).to.be.an('object')
              expect(singleUser).to.have.key('name')
              expect(singleUser.name).to.equal('Goku')
              expect(singleUser.email).to.equal(undefined)
            }).catch(handleError)
        })

        it('should return an error if user not exists', () => {

          let body = {
            query: `
              query getSingleUser($id: ID!) {
                user(id: $id) {
                  name
                }
              }
            `,
            variables: {
              id: -1
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.user).to.be.null
              expect(res.body.errors).to.be.an('array')
              expect(res.body).to.have.keys(['data', 'errors'])
              expect(res.body.errors[0].message).to.equal('Error: User with id -1 not found!')
            }).catch(handleError)
        })

      })
      
      describe('users', () => {

        it('should return a list of Users', () => {

          let body = {
            query: `
              query {
                users {
                  name
                  email
                }
              }
            `
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const userList = res.body.data.users
              expect(res.body.data).to.be.an('object')
              expect(userList).to.be.an('array')
              expect(userList[0]).to.not.have.keys(['id', 'photo', 'createdAt', 'updatedAt', 'posts'])
              expect(userList[0]).to.have.keys(['name', 'email'])
            }).catch(handleError)
        })

        it('should paginate a list of Users', () => {

          let body = {
            query: `
              query getUsersList($first: Int, $offset: Int) {
                users(first: $first, offset: $offset) {
                  name
                  email
                  createdAt
                }
              }
            `,
            variables: {
              first: 2,
              offset: 1
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const userList = res.body.data.users
              expect(res.body.data).to.be.an('object')
              expect(userList).to.be.an('array').lengthOf(2)
              expect(userList[0]).to.not.have.keys(['id', 'photo', 'updatedAt', 'posts'])
              expect(userList[0]).to.have.keys(['name', 'email', 'createdAt'])
            }).catch(handleError)
        })

      })

      describe('currentUser', () => {

        it('should return the User owner of the token', () => {

          let body = {
            query: `
              query {
                currentUser {
                  name
                  email
                }
              }
            `
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const currentUser = res.body.data.currentUser
              expect(currentUser).to.be.an('object')
              expect(currentUser).to.have.keys(['name', 'email'])
              expect(currentUser.name).to.equal('Goku')
              expect(currentUser.email).to.equal('goku@gmail.com')
            }).catch(handleError)
        })

      })

    })

  })

  describe('Mutations', () => {

    describe('application/json', () => {
    
      describe('createUser', () => {
        
        it('should create a new User', () => {

          let body = {
            query: `
              mutation createNewUSer($input: UserCreateInput!) {
                createUser(input: $input) {
                  id
                  name
                  email
                }
              }  
            `,
            variables: {
              input: {
                 name: 'Piculo',
                 email: 'piculo@gmail.com',
                 password: 'piculo123'
              }
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const createUser = res.body.data.createUser
              expect(createUser).to.be.an('object')
              expect(createUser.name).to.equal('Piculo')
              expect(createUser.email).to.equal('piculo@gmail.com')
              expect(parseInt(createUser.id)).to.be.a('number')
            }).catch(handleError)

        })

      })

      describe('updateUser', () => {
        
        it('should update an existing User', () => {

          let body = {
            query: `
              mutation updateExistingUser($input: UserUpdateInput!) {
                updateUser(input: $input) {
                  name
                  email
                  photo
                }
              }  
            `,
            variables: {
              input: {
                 name: 'Goten',
                 email: 'goten@gmail.com',
                 photo: 'goten.png'
              }
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const updatedUser = res.body.data.updateUser
              expect(updatedUser).to.be.an('object')
              expect(updatedUser.name).to.equal('Goten')
              expect(updatedUser.email).to.equal('goten@gmail.com')
              expect(updatedUser.photo).to.be.not.undefined
              expect(parseInt(updatedUser.id)).to.be.a('number')
            }).catch(handleError)

        })

        it('should block operation if token is invalid', () => {

          let body = {
            query: `
              mutation updateExistingUser($input: UserUpdateInput!) {
                updateUser(input: $input) {
                  name
                  email
                  photo
                }
              }  
            `,
            variables: {
              input: {
                 name: 'Goten',
                 email: 'goten@gmail.com',
                 photo: 'goten.png'
              }
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .set('authorization', 'Bearer INVALID TOKEN')
            .send(JSON.stringify(body))
            .then(res => {
             expect(res.body.data.updateUser).to.be.null
             expect(res.body).to.have.keys(['data', 'errors'])
             expect(res.body.errors).to.be.an('array')
             expect(res.body.errors[0].message).to.equal('JsonWebTokenError: jwt malformed')
            }).catch(handleError)

        })

      })

      describe('updateUserPassword', () => {

        it('should update the password of an existing User', () => {

          let body = {
            query: `
              mutation updateUserPassword($input: UserUpdatePasswordInput!) {
                updateUserPassword(input: $input) 
              }  
            `,
            variables: {
              input: {
                password: 'goten123'
              }
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.updateUserPassword).to.be.true
            }).catch(handleError)

        })

      })

      describe('deleteUser', () => {

        it('should delete an existing User', () => {

          let body = {
            query: `
              mutation {
                deleteUser
              }  
            `
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.deleteUser).to.be.true
            }).catch(handleError)

        })

        it('should block operation if token is not provided', () => {

          let body = {
            query: `
              mutation {
                deleteUser
              }  
            `
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.errors[0].message).to.equal('Unauthorized! Token was not provider!')
            }).catch(handleError)

        })
        
      })

    })

  })

})