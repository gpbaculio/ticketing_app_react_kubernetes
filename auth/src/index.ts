import express from 'express'
import { json } from 'body-parser'

import { currentUserRouter } from './routes/currentuser'
import { signUpRouter } from './routes/signup'
import { signInRouter } from './routes/signin'
import { signOutRouter } from './routes/signout'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.listen(3000, () => {
  console.log('Listening on port 3000 auth! shelajoy!!1212')
})