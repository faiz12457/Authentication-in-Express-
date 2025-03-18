import dotenv from "dotenv";
dotenv.config();
import { Schema, model } from "mongoose";
import encrypt from "mongoose-encryption";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });

export const User = model("User", userSchema);
