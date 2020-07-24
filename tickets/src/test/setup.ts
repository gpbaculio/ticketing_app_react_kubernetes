import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import app from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin: () => string[]
    }
  }
}

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'MY_SECRET'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  // build payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  // build sesion object { jwt }
  const session = { jwt: token }
  // turn to json
  const sessionJSON = JSON.stringify(session)
  // encode json to base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // return cookie string with encoded data
  return [`express:sess=${base64}`]
}