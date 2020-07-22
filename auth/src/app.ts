import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/currentuser'
import { signUpRouter } from './routes/signup'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'

import { errorHandler } from './middlewares/errorhandler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app