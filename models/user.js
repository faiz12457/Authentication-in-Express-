import dotenv from "dotenv";
dotenv.config();
import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  username: {  // 🔹 Changed "email" to "username"
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String
  }
});

userSchema.plugin(passportLocalMongoose); // 🔹 Ensures email is used as username

export const User = model("User", userSchema);
