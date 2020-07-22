import request from 'supertest'
import app from '../../app'

it('handles get current user', async () => {
  const cookie = await global.signin()
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('handles no authenticated user', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  expect(response.body.currentUser).toEqual(null)
})