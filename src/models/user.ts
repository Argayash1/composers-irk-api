import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';
import UnauthorizedError from '../errors/UnauthorizedError';
import { INCORRECT_USERDATA_MESSAGE } from '../utils/constants';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: [2, 'длина имени пользователя должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени пользователя должна быть не более 30 символов'],
      required: [true, 'не передано имя пользователя'],
    },
    email: {
      type: String,
      required: [true, 'не передан e-mail пользователя'],
      unique: true,
      validate: {
        validator: (email: string) => isEmail(email),
        message: 'e-mail не соответствует формату',
      },
    },
    password: {
      type: String,
      required: [true, 'не передан пароль пользователя'],
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email: string, password: string): Promise<IUser> {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(INCORRECT_USERDATA_MESSAGE));
      }
      return bcrypt.compare(password, user.password).then((matched: boolean) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError(INCORRECT_USERDATA_MESSAGE));
        }
        return user;
      });
    });
};

const User = model<IUser>('User', userSchema) as IUserModel;

export default User;
