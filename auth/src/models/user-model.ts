import mongoose from 'mongoose'

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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.statics.create = (props: UserPropsType) => {
  return new User(props)
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema)

export default User