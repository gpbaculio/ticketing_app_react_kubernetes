import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'


export class DatabaseValidationError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'
  constructor(private errors: ValidationError[]) {
    super('Error connecting to database')
    //only because we're extending a built in class
    Object.setPrototypeOf(this, DatabaseValidationError.prototype)
  }
  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}
