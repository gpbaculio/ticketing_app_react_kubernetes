import express, { Request, Response } from 'express'
import { body } from 'express-validator'

const router = express.Router()

const emailValidator = body('email')
  .isEmail()
  .withMessage('Invalid email address')
const passwordValidator = body('password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Passwprd must be 4 to 20 characters')

router.post(
  '/api/users/signup',
  [emailValidator, passwordValidator],
  (_req: Request, res: Response) => {
    res.send(`you're on signUpRouter route!`)
  })

export { router as signUpRouter }