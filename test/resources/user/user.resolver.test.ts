import { app, db, chai, handleError, expect } from './../../test-utils'
import { UserInstance } from '../../../src/models/UserModel';

describe('User', () => {

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

    })

  })

})