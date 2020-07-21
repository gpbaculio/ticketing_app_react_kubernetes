import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest } from '../middlewares/validate-request'
import User from '../models/user-model'
import { BadRequestError } from '../errors/bad-request-error'
import { Password } from '../services/password'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (!existingUser)
      throw new BadRequestError('Invalid credentials')

    const validPassword = await Password.compare(existingUser.password, password)
    if (!validPassword)
      throw new BadRequestError('Invalid credentials')

    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!)

    req.session = {
      jwt: userJwt
    }
    return res.status(201).send(existingUser)
  })

export { router as signInRouter }