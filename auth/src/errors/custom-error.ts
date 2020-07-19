export abstract class CustomError extends Error {
  abstract statusCode: number
  constructor(message: string) {
    // throw new Error(error.response.message)
    super(message)
    //only because we're extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }
  abstract serializeErrors(): {
    message: string
    field?: string
  }[]
}
