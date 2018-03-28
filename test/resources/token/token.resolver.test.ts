import * as jwt from 'jsonwebtoken'
import { app, db, chai, handleError, expect } from './../../test-utils'
import { JWT_SECRET } from '../../../src/utils/utils';

describe('Token', () => {

  let token: string;
  let userId: number;
  let postId: number;
  let commentId: number;

  beforeEach(() => {
    return db.Comment.destroy({where: {}})
      .then((rows: number) => db.Post.destroy({where: {}}))
      .then((rows: number) => db.User.destroy({where: {}}))
      .then((rows: number) => db.User.create(
        {
          name: 'Goku',
          email: 'goku@gmail.com',
          password: 'goku123'
        }
      )).catch(handleError)
  })

  describe('Mutations', () => {

    describe('application/json', () => {

      describe('createToken', () => {

        it('should return a new valid token', () => {

          let body = {
            query: `
              mutation createNewToken($email: String!, $password: String!) {
                createToken(email: $email, password: $password) {
                  token
                }
              }
            `,
            variables: {
              email: 'goku@gmail.com',
              password: 'goku123'
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data).to.have.key('createToken')
              expect(res.body.data.createToken).to.have.key('token')
              expect(res.body.data.createToken).to.be.string
              expect(res.body.erros).to.be.undefined
            }).catch(handleError)

        })

        it('should return an error if password is incorrect', () => {

          let body = {
            query: `
              mutation createNewToken($email: String!, $password: String!) {
                createToken(email: $email, password: $password) {
                  token
                }
              }
            `,
            variables: {
              email: 'goku@gmail.com',
              password: 'wrong_password'
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body).to.have.keys(['data', 'errors'])
              expect(res.body.data).to.have.key('createToken')
              expect(res.body.data.createToken).to.be.null
              expect(res.body.errors).to.be.an('array').with.length(1)
              expect(res.body.errors[0].message).to.equal('Unauthorized! Wrong email or password!')
            }).catch(handleError)

        })

        it('should return an error when email not exists', () => {

          let body = {
            query: `
              mutation createNewToken($email: String!, $password: String!) {
                createToken(email: $email, password: $password) {
                  token
                }
              }
            `,
            variables: {
              email: 'goku_vegita@gmail.com',
              password: 'senha123'
            }
          }

          return chai.request(app)
            .post('/graphql')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body).to.have.keys(['data', 'errors'])
              expect(res.body.data).to.have.key('createToken')
              expect(res.body.data.createToken).to.be.null
              expect(res.body.errors).to.be.an('array').with.length(1)
              expect(res.body.errors[0].message).to.equal('Unauthorized! Wrong email or password!')
            }).catch(handleError)

        })

      })

    })

  }) 
})