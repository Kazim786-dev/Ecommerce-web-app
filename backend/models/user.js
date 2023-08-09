import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  // add more fields like profile picture, etc. as per your requirements
},{ 
  timestamps: true
});

UserSchema.pre(
  'save',
  async function(next) {
    const user = this;
    // bcrypt.hash(this.password, 10) passes the password and the value of salt round (or cost) to 10.
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

const User = model('User', UserSchema);

export default User;
