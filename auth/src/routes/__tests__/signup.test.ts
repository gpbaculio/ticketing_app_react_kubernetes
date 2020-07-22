import request from 'supertest'
import app from '../../app'

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
})

it('handles invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@.com',
      password: 'password'
    })
    .expect(400)
})

it('handles invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400)
})

it('handles email/password is required', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'abcd123'
    })
    .expect(400)
})

it('handles email already in use', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})
it('sets cookie after success signup', async () => {


  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})