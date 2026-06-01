import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:[true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required:[true, 'Email is required'],
      lowercase: true,
      unique:true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength:[6, 'password must be at least and 6 character']
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hash(this.password)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User", userSchema);
export default User;
