import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  res.send(`you're on signOutRouter route!`)
})

export { router as signOutRouter }