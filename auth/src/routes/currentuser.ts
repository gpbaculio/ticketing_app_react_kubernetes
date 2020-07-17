import express from 'express'

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {
  res.send(`you're on currentUser route!`)
})

export { router as currentUserRouter }