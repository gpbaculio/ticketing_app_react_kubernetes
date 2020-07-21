import mongoose from 'mongoose'
import { Password } from '../services/password'

interface UserPropsType {
  email: string,
  password: string
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(props: UserPropsType): UserDocument
}

interface UserDocument extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      }
    }
  }
)

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hased = await Password.toHash(this.get('password'))
    this.set('password', hased)
  }
  done()
})

userSchema.statics.build = (props: UserPropsType) => {
  return new User(props)
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema)

export default User