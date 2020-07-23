import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError, validateRequest } from '@gpbaculiok8stickets/common'


import User from '../models/user-model'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Passwprd must be 4 to 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const isExisting = await User.findOne({ email })

    if (isExisting)
      throw new BadRequestError('Email already in use')
    else {
      const newUser = User.build({ email, password })
      await newUser.save()

      const userJwt = jwt.sign({
        id: newUser.id,
        email: newUser.email
      }, process.env.JWT_KEY!)

      req.session = {
        jwt: userJwt
      }

      return res.status(201).send(newUser)
    }
  })

export { router as signUpRouter }