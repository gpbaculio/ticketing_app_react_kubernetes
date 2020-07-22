
import mongoose from 'mongoose'
import app from './app'

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error('JWT_KEY must be defined')
  try {
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to mongodb')
  } catch (error) {
    console.log('Error: ', error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000 auth! shelajoy!!1212')
  })
}

start()