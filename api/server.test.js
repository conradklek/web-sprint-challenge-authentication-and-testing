const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server.js')

const user = {
  username: 'test',
  password: '12345'
}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('/api/auth', () => {
  describe('POST /register', () => {
    it('should return 201 on successful registration', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(user)
        .expect(201)
    })
    it('should return 400 on failed registration due to missing username or password', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({})
        .expect(400)
    })
    it('should return 400 on failed registration due to username already taken', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(user)
      await request(server)
        .post('/api/auth/register')
        .send(user)
        .expect(400)
    })
  })
  describe('POST /login', () => {
    it('should return 200 on successful login', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(user)
      await request(server)
        .post('/api/auth/login')
        .send(user)
        .expect(200)
    })
    it('should return 400 on failed login due to invalid username or password', async () => {
      await request(server)
        .post('/api/auth/register')
        .send(user)
      await request(server)
        .post('/api/auth/login')
        .send({
          username: 'test',
          password: 'wrong'
        })
        .expect(400)
        .expect(res => {
          expect(res.body.message).toBe('invalid credentials')
        })
    })
  })
})

describe('/api/jokes', () => {
    describe('GET /', () => {
      it('401 if the request headers include authorization', async () => {
        await request(server)
          .get('/api/jokes')
          .set('Authorization', 'Bearer')
          .expect(401)
      })
    })
  })