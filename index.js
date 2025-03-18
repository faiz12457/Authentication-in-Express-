import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import { User } from "./models/user.js";
import encrypt from "mongoose-encryption";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;


await mongoose.connect("mongodb://localhost:27017/userDB");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are requried" });
    }

    const newUser = new User({
      email: username,
      password,
    });

    await newUser.save();

    res.render("secrets");
  } catch (err) {
    console.log("Registration Error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are requried" });
    }

    const foundUser = await User.findOne({ email: username });

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        return res.status(401).json({ message: "Invalid  password" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("Server on running on port 3000");
});
